import {useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
const [stream,setStream] = useState(null);
const [countdown, setCountdown] = useState(null);
const [errorMessage,setErrorMessage] = useState('');

const videoRef = useRef(null);
const canvasRef = useRef(null);

const capturePhoto = () => {
  if(videoRef.current && canvasRef.current) {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if(ctx) {
      ctx.drawImage(video,0,0,canvas.width,canvas.height);
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setStream(false);
    }
  }
}

useEffect(() => {
  const startCamera = async() => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {width:1280, height:720},
        audio:false
      });
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
  if(stream) startCamera();
},[stream])

const handleStart = () => setStream(true);

  return (
    <div>
      <button onClick={handleStart}>Start</button>
      {stream && (
        <video ref={videoRef} autoPlay playsInline muted />
      )}
    countdown: {countdown}
    <canvas ref={canvasRef} />
    {errorMessage && (
      <div>Error message: {errorMessage}</div>
    )}
    </div>
  )
}

export default App
