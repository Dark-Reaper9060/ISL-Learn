from diagrams import Diagram, Cluster, Edge
from diagrams.onprem.client import User, Client
from diagrams.programming.framework import React, Fastapi
from diagrams.programming.language import Python
from diagrams.generic.device import Camera

# Note: You need to install the diagrams library to run this:
# pip install diagrams

graph_attr = {
    "fontsize": "20",
    "bgcolor": "white"
}

with Diagram("SignBridge ISL Architecture", show=False, graph_attr=graph_attr):
    user = User("Learner")

    with Cluster("Frontend (Browser)"):
        cam = Camera("Webcam")
        ui = React("React App\n(SignBridge UI)")
        ws_client = Client("WebSocket\nHook")

    with Cluster("Backend Service"):
        server = Fastapi("FastAPI Server\n(Localhost:8000)")
        
        with Cluster("Inference Pipeline"):
            mediapipe_node = Python("MediaPipe\n(Hand Detection)")
            model = Python("TensorFlow Model\n(Dual Input)")

    # Data Flow Steps
    user >> Edge(label="Gestures") >> cam
    cam >> Edge(label="Video Stream") >> ui
    ui >> Edge(label="Capture Frame") >> ws_client
    
    # WebSocket Communication
    ws_client >> Edge(label="WS: /ws/predict\n(Base64 Image)") >> server
    
    # Internal Backend Processing
    server >> Edge(label="Decode") >> mediapipe_node
    mediapipe_node >> Edge(label="Crop & Landmarks") >> model
    model >> Edge(label="Confidence Score") >> server
    
    # Response
    server >> Edge(label="WS: Response\n(Label: 'A', Conf: 0.99)") >> ws_client
    ws_client >> Edge(label="Feedback") >> ui
