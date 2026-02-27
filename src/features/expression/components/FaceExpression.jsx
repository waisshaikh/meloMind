import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [expression, setExpression] = useState("No expression detected");

  // Load model
  useEffect(() => {
    const loadModel = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const landmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
          },
          outputFaceBlendshapes: true,
          runningMode: "IMAGE",
          numFaces: 1
        }
      );

      setFaceLandmarker(landmarker);
    };

    loadModel();
  }, []);

  // Start webcam
  useEffect(() => {
    const enableCam = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      videoRef.current.srcObject = stream;
    };

    enableCam();
  }, []);

  // Detect Expression
const detect = async () => {
  if (!faceLandmarker || !videoRef.current) return;

  const results = await faceLandmarker.detect(videoRef.current);

  if (results.faceBlendshapes.length > 0) {
    const blendshapes = results.faceBlendshapes[0].categories;

    const get = (name) =>
      blendshapes.find(b => b.categoryName === name)?.score || 0;

    // =======================
    // EMOTION VALUES
    // =======================

    const smile =
      get("mouthSmileLeft") + get("mouthSmileRight");

    const sad =
      get("mouthLowerDownLeft") +
      get("mouthLowerDownRight") +
      get("browInnerUp");

    const shocked =
      get("jawOpen") +
      get("browOuterUpLeft") +
      get("browOuterUpRight");

    console.clear();
    console.log("Smile:", smile.toFixed(3));
    console.log("Sad:", sad.toFixed(3));
    console.log("Shocked:", shocked.toFixed(3));

    // =======================
    // DECISION LOGIC
    // =======================

    if (shocked > 1.5) {
      setExpression("😲 Shocked");
    } 
    else if (smile > 1.0) {
      setExpression("😊 Happy");
    } 
    else if (sad > 0.6) {
      setExpression("😢 Sad");
    } 
    else {
      setExpression("😐 Neutral");
    }

  } else {
    setExpression("No face detected");
  }
};


  return (
    <div style={{ textAlign: "center" }}>
      <h2>MeloMind Expression Detector</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="400"
        style={{ borderRadius: "10px" }}
      />

      <br />
      <button
        onClick={detect}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Detect Expression
      </button>

      <h3 style={{ marginTop: "20px" }}>{expression}</h3>
    </div>
  );
};

export default FaceExpression;