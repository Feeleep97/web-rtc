import {useRef, useState } from 'react'
import './App.css'

function App() {
const [stream,setStream] = useState(null);
const [countdown, setCountdown] = useState(null);

const videoRef = useRef(null);
const canvasRef = useRef(null);

const startCamera = async() => {

  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {width:1280, height:720},
      audio:false
    });
    setStream(mediaStream);

    if(videoRef.current) {
      videoRef.current.srcObject = mediaStream;

      await new Promise((resolve) => {
        if(videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            resolve();
          }
        }
      })
    }

    let timeLeft = 5;
    setCountdown(timeLeft);
    const countdownInterval = setInterval(()=> {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if(timeLeft === 0) {
        clearInterval(countdownInterval);
        capturePhoto();
      }
    },1000);
  } catch (error) {
    console.log(error)
  }
}

const capturePhoto = () => {
  // save photo and show to the UI
  console.log('photo taken')
}

  return (
    <div>
      <button onClick={startCamera}>Take a photo</button>
      {stream && (
        <div>
          <video ref={videoRef} autoPlay playsInline muted/>
        </div>
)}
    countdown: {countdown}
    <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default App
