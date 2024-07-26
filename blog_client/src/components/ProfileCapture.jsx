import React from 'react';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Alert, Button } from 'flowbite-react';
import { useRef, useState } from 'react';
import {ShieldCheck} from 'phosphor-react'

export default function ProfileCapture({score, setScore}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [isPredicting, setIsPredicting] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    

    //Function to start webcam
    const startWebcam = async () => {
        setShowVideo(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
  };

  //Function to capture a photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        // Set canvas dimensions to match video feed
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame on the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));
      }
    }
  };

  //Load the Cocossd model
  const loadModel = async () => {
    setIsPredicting(true);
    const img = document.getElementById("captured-image");
    const model = await cocoSsd.load();
    const predictions = await model.detect(img);

    if (predictions.length === 0) {
        setErrorMessage("Could not capture image properly. Try Again.")
        
    } else {
        if (predictions[0].class === "person" && predictions[0].score >= 0.875) {
            setScore(predictions[0].score); // Now setting the score from props
            setIsVerified(true);
            setErrorMessage("Identity Verified");
        } else {
            setErrorMessage("Identity Verification failed. Retry. Testing");
        }
    }

    if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
            if (track.readyState === "live") {
                track.stop();
            }
        });
    }
    setIsPredicting(false);
  };

  return (
    <div className='mt-4'>
        
        <p className='block text-lime-500 text-lg font-bold mb-2'>Identity Verification</p>
        {isVerified?(
            <p className="flex justify-center items-center">
                Verified <ShieldCheck size={36} color="#04d600" weight="fill" />
            </p>
        ):(
            <div>
                <p className='text-sm'>Few Points to Remember:</p>
                <ul className='list-dic list-inside text-sm'>
                    <li>Make sure your face is clearly visible and there is a clean background.</li>
                    <li>Make sure there is no one/nothing else in the frame.</li>
                    <li>Make sure there is enough light in the room.</li>
                    <li>No image is saved. This is just for verification and will not be used for other purposes.</li>
                </ul>
                <div className="flex justify-center gap-4">
                    <Button onClick={startWebcam} type="button" gradientMonochrome="lime" outline className="font-bold mt-2">Start Webcam</Button>
                    <Button onClick={capturePhoto} type="button" gradientMonochrome="lime" outline className="font-bold mt-2">Capture</Button>
                </div>
                <div className="flex gap-2 mt-4">
                    {showVideo && (
                        <div className="m-0 w-1/2">
                            <h2>Live Video Feed:</h2>
                            <video ref={videoRef} autoPlay playsInline style={{ display: "inline" }}/>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    {capturedImage && (
                        <div className="m-0 w-1/2">
                            <h2>Captured Image:</h2>
                            <img id="captured-image" src={capturedImage} alt="Captured" style={{ display: "inline" }}/>
                        </div>
                    )}
                </div>
                {capturedImage && (
                    <Button onClick={loadModel} type="button" gradientMonochrome="lime" outline className="font-bold mt-2 w-full">Verify</Button>
                )}
                {isPredicting && (
                    <p className="text-xs text-gray-500">Checking if you are human or not. This may take a while...</p>
                )}
                {
                    errorMessage && (
                        <Alert className='mt-5' color='failure'>
                        {errorMessage}
                        </Alert>
                    )
                }
            </div>
        )}
    </div>
  )
}
