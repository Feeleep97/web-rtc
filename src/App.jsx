import {useRef, useState } from 'react'
import './App.css'

function App() {
const [stream,setStream] = useState(null);
const [countdown, setCountdown] = useState(null);
const [capturedImage, setCapturedImage] = useState(null);
const [errorMessage,setErrorMessage] = useState('');

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
    if(error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      setErrorMessage('Camera permission denied. Please allow camera permissions in order to take a photo.')
    } else {
      setErrorMessage(`Error accessing camera:${error.message}`)
    }
  }
}

const capturePhoto = () => {
  // save photo and show to the UI
  if(videoRef.current && canvasRef.current) {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if(ctx) {
      ctx.drawImage(video,0,0,canvas.width,canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png')
      setCapturedImage(imageDataUrl)
    }
  }
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

    {capturedImage && (
    <div>
      <img src={capturedImage} alt="selfie" />
    </div>
)}
    {errorMessage && (
      <div>Error message: {errorMessage}</div>
    )}
    </div>
  )
}

export default App
