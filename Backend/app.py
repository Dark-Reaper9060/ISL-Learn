import cv2
import numpy as np
import tensorflow as tf
import base64
import json

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
import routes

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# =====================================================
# CONFIG
# =====================================================
MODEL_PATH = "./Model/fusion_effnet_customcnn_best.h5"
HAND_MODEL = "hand_landmarker.task"

IMG_SIZE = 224
OFFSET = 40
CONF_THRESHOLD = 0.95

CLASSES = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z"
]

# =====================================================
# LOAD MODEL
# =====================================================
model = tf.keras.models.load_model(MODEL_PATH)
print("Fusion model loaded")

# =====================================================
# MEDIAPIPE
# =====================================================
BaseOptions = python.BaseOptions
HandLandmarker = vision.HandLandmarker
HandLandmarkerOptions = vision.HandLandmarkerOptions

options = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=HAND_MODEL),
    running_mode=vision.RunningMode.IMAGE,
    num_hands=2,
    min_hand_detection_confidence=0.6,
    min_hand_presence_confidence=0.6,
    min_tracking_confidence=0.6
)

landmarker = HandLandmarker.create_from_options(options)

# =====================================================
# DATABASE & FASTAPI SETUP
# =====================================================
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(routes.router, tags=["API"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# UTIL
# =====================================================
def resize_pad(img, size, bg=255):
    h, w, _ = img.shape
    scale = size / max(h, w)
    nh, nw = int(h * scale), int(w * scale)
    resized = cv2.resize(img, (nw, nh))

    canvas = np.ones((size, size, 3), dtype=np.uint8) * bg
    y0 = (size - nh) // 2
    x0 = (size - nw) // 2
    canvas[y0:y0+nh, x0:x0+nw] = resized
    return canvas

# =====================================================
# WEBSOCKET ENDPOINT
# =====================================================
@app.websocket("/ws/predict")
async def websocket_predict(ws: WebSocket):
    await ws.accept()

    while True:
        data = await ws.receive_text()
        payload = json.loads(data)

        # ---------- Decode image ----------
        image_b64 = payload.get("image", "")

        if not image_b64:
            await ws.send_json({"label": "Noise", "confidence": 0.0})
            continue

        try:
            img_bytes = base64.b64decode(image_b64)
        except Exception:
            await ws.send_json({"label": "Noise", "confidence": 0.0})
            continue

        if len(img_bytes) == 0:
            await ws.send_json({"label": "Noise", "confidence": 0.0})
            continue

        np_arr = np.frombuffer(img_bytes, np.uint8)

        if np_arr.size == 0:
            await ws.send_json({"label": "Noise", "confidence": 0.0})
            continue

        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)


        if img is None:
            await ws.send_json({"label": "Noise", "confidence": 0.0})
            continue

        h, w, _ = img.shape
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb
        )

        result = landmarker.detect(mp_image)

        if not result.hand_landmarks:
            await ws.send_json({"label": "Noise", "confidence": 0.0})
            continue

        # ---------- Bounding box ----------
        xs, ys = [], []
        for hand in result.hand_landmarks:
            for lm in hand:
                xs.append(int(lm.x * w))
                ys.append(int(lm.y * h))

        x1 = max(0, min(xs) - OFFSET)
        y1 = max(0, min(ys) - OFFSET)
        x2 = min(w, max(xs) + OFFSET)
        y2 = min(h, max(ys) + OFFSET)

        crop = img[y1:y2, x1:x2]
        if crop.size == 0:
            await ws.send_json({"label": "Noise", "confidence": 0.0})
            continue

        # =====================================================
        # REAL IMAGE INPUT
        # =====================================================
        real_img = resize_pad(crop, IMG_SIZE, 255)
        real_input = tf.keras.applications.efficientnet.preprocess_input(
            real_img.astype("float32")
        )
        real_input = np.expand_dims(real_input, axis=0)

        # =====================================================
        # LANDMARK IMAGE INPUT
        # =====================================================
        landmark_img = np.zeros_like(crop)

        for hand in result.hand_landmarks:
            for conn in vision.HandLandmarksConnections.HAND_CONNECTIONS:
                p1 = hand[conn.start]
                p2 = hand[conn.end]
                cv2.line(
                    landmark_img,
                    (int(p1.x*w)-x1, int(p1.y*h)-y1),
                    (int(p2.x*w)-x1, int(p2.y*h)-y1),
                    (0,255,0),
                    2
                )
            for lm in hand:
                cv2.circle(
                    landmark_img,
                    (int(lm.x*w)-x1, int(lm.y*h)-y1),
                    4,
                    (0,0,255),
                    -1
                )

        landmark_img = resize_pad(landmark_img, IMG_SIZE, 0)
        lm_input = landmark_img.astype("float32") / 255.0
        lm_input = np.expand_dims(lm_input, axis=0)

        # =====================================================
        # PREDICTION
        # =====================================================
        probs = model.predict([real_input, lm_input], verbose=0)[0]
        idx = int(np.argmax(probs))
        conf = float(probs[idx])

        label = CLASSES[idx] if conf >= CONF_THRESHOLD else "Noise"
        await ws.send_json({"label": label, "confidence": conf})
