import {useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
const [stream,setStream] = useState(null);
const [countdown, setCountdown] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const [capturedPhoto, setCapturedPhoto] = useState(null);

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
      const imageDataURL = canvas.toDataURL('image/png')
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setStream(false);
      setCapturedPhoto(imageDataURL);
    }
  }
}

useEffect(() => {
  const startCamera = async() => {
    try {
      setCapturedPhoto(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {width:800, height:720},
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
    <div className="camera-container">
    <div className="camera-wrapper">
      <h1 className="camera-title">Video Capture</h1>

      <div className="camera-description">
        <p>
        Click the button to allow camera access. A photo will be
        taken automatically after a few seconds.
        </p>
      </div>

      <div className="camera-button-wrapper">
        <button
          className="camera-btn"
          disabled={countdown !== null && countdown !== 0}
          onClick={handleStart}
        >
          {countdown !== null && countdown !== 0 ? countdown : 'Start'}
        </button>
      </div>

      {errorMessage && (
        <div className="camera-error">
          <p className="camera-error-text">{errorMessage}</p>
        </div>
      )}

      {stream && !errorMessage && (
        <div className="camera-video-card">
          <h2 className="camera-card-title">Live Preview</h2>
          <div className="camera-video-wrapper">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="camera-video"
            />
            {countdown !== null && countdown > 0 && (
              <div className="camera-countdown-overlay">
                <div className="camera-countdown-number">
                  {countdown}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      { capturedPhoto && (
        <div className="camera-gallery">
          <h2 className="camera-gallery-card-title">Captured Photo</h2>
          <div className="camera-canvas"> 
          <img src={capturedPhoto} className="captured-photo" alt="" />
          </div>
        </div>
      )}
    </div>
    <canvas className="hidden" ref={canvasRef} />

  </div>
  )
}

export default App
