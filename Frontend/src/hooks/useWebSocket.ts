import { useState, useCallback, useRef, useEffect } from "react";

interface PredictionResult {
  label: string;
  confidence: number;
}

interface UseWebSocketOptions {
  url: string;
  onPrediction?: (result: PredictionResult) => void;
  onError?: (error: string) => void;
}

export const useWebSocket = ({ url, onPrediction, onError }: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastPrediction, setLastPrediction] = useState<PredictionResult | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onPredictionRef = useRef(onPrediction);

  useEffect(() => {
    onPredictionRef.current = onPrediction;
  }, [onPrediction]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsConnecting(false);
      };

      ws.onmessage = (event) => {
        try {
          const data: PredictionResult = JSON.parse(event.data);
          setLastPrediction(data);
          onPredictionRef.current?.(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.("Connection error occurred");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      setIsConnecting(false);
      onError?.("Failed to establish connection");
    }
  }, [url, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setLastPrediction(null);
  }, []);

  const sendFrame = useCallback((base64Image: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Remove data URL prefix if present
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
      wsRef.current.send(JSON.stringify({ image: cleanBase64 }));
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    lastPrediction,
    connect,
    disconnect,
    sendFrame,
  };
};
