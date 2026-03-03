import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";


export const init = async ({ landmarkerRef, videoRef, streamRef }) => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1
        }
    );

    streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = streamRef.current;
    await videoRef.current.play();
};

export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
  if (!landmarkerRef.current || !videoRef.current) return;

  const results = landmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now()
  );

  if (results.faceBlendshapes?.length > 0) {
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
