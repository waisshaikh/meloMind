import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import "./FaceExpression.css";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const lastExpressionRef = useRef("");

  const [expression, setExpression] = useState("Initializing...");

  useEffect(() => {
    let stream;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        landmarkerRef.current =
          await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          });

        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        detect();
      } catch (err) {
        console.error("Init error:", err);
        setExpression("Camera Error ❌");
      }
    };

    const detect = () => {
      if (!landmarkerRef.current || !videoRef.current) return;

      const results =
        landmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

      if (results.faceBlendshapes?.length > 0) {
        const blendshapes =
          results.faceBlendshapes[0].categories;

        const getScore = (name) =>
          blendshapes.find(
            (b) => b.categoryName === name
          )?.score || 0;

        // Raw scores
        const smileLeft = getScore("mouthSmileLeft");
        const smileRight = getScore("mouthSmileRight");
        const frownLeft = getScore("mouthFrownLeft");
        const frownRight = getScore("mouthFrownRight");
        const jawOpen = getScore("jawOpen");
        const eyeWideLeft = getScore("eyeWideLeft");
        const eyeWideRight = getScore("eyeWideRight");
        const browUp = getScore("browInnerUp");
        const browDown =
          (getScore("browDownLeft") +
            getScore("browDownRight")) / 2;

        // Averages
        const smile = (smileLeft + smileRight) / 2;
        const frown = (frownLeft + frownRight) / 2;
        const eyeWide = (eyeWideLeft + eyeWideRight) / 2;

        let currentExpression = "Neutral 😐";

        // 🔥 Surprise (checked first)
        if (
          jawOpen > 0.55 &&
          eyeWide > 0.35 &&
          browUp > 0.25 &&
          smile < 0.3
        ) {
          currentExpression = "Surprised 😲";
        }

        // 😢 Sad
        else if (
          frown > 0.4 &&
          browDown > 0.25 &&
          smile < 0.25
        ) {
          currentExpression = "Sad 😢";
        }

        // 😄 Happy
        else if (
          smile > 0.45 &&
          frown < 0.3
        ) {
          currentExpression = "Happy 😄";
        }

        // Prevent unnecessary re-renders
        if (
          currentExpression !== lastExpressionRef.current
        ) {
          setExpression(currentExpression);
          lastExpressionRef.current =
            currentExpression;
        }
      }

      animationRef.current =
        requestAnimationFrame(detect);
    };

    init();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="face-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="face-video"
          playsInline
        />
      </div>

      <h2 className="expression-text">
        {expression}
      </h2>
    </div>
  );
}