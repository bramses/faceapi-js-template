const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("assets/weights"),
  faceapi.nets.faceLandmark68Net.loadFromUri("assets/weights"),
  faceapi.nets.faceRecognitionNet.loadFromUri("assets/weights"),
  faceapi.nets.faceExpressionNet.loadFromUri("assets/weights"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = document.getElementById('overlay')
  const displaySize = { width: video.width, height: video.height};
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    // detect and resize to canvas
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetections = await faceapi.resizeResults(
      detections,
      displaySize
    );

    // clear canvas old rects
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    resizedDetections.forEach((detection) => {
      if (detection.expressions.happy > 0.5) {
        console.log('happy! :)')
      }

      // // see DrawBoxOptions below
      // const box = { x: 50, y: 50, width: 100, height: 100 };
      // const drawOptions = {
      //   label: "Hello I am a box!",
      //   lineWidth: 2,
      //   boxColor: "blue",
      // };
      // const drawBox = new faceapi.draw.DrawBox(box, drawOptions);
      // drawBox.draw(canvas);

      // draw detections and expressions
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    });
  }, 100);
});
