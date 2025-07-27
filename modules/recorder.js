let mediaRecorder;
let audioChunks = [];

export function startRecording(onStopCallback, updateUI) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      onStopCallback(audioBlob);
    };

    mediaRecorder.start();
    updateUI("listening");
  });
}

export function stopRecording(updateUI) {
  mediaRecorder.stop();
  updateUI("processing");
}
