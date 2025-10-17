import React, { useRef, useEffect } from 'react';

interface CameraViewProps {
  isCameraOn: boolean;
  setIsCameraOn: (isOn: boolean) => void;
  onMotionDetected: () => void;
}

const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2" ry="2"/></svg>);
const VideoOffIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>);

export const CameraView: React.FC<CameraViewProps> = ({ isCameraOn, setIsCameraOn, onMotionDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const motionCanvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameData = useRef<Uint8ClampedArray | null>(null);
  const motionDetectionInterval = useRef<number | null>(null);

  // Use useEffect to manage the camera stream lifecycle in response to the `isCameraOn` prop.
  // This avoids the race condition of the video element not being mounted when the stream is acquired.
  useEffect(() => {
    const videoElement = videoRef.current;
    
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoElement) {
          videoElement.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        // If we fail, we must tell the parent component to turn the camera off.
        setIsCameraOn(false);
      }
    };

    const stopCamera = () => {
      if (motionDetectionInterval.current) {
        clearInterval(motionDetectionInterval.current);
        motionDetectionInterval.current = null;
      }
      lastFrameData.current = null;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    // This is the cleanup function that will be called when the component unmounts
    // or when the dependencies of the effect change (before the effect runs again).
    return () => {
      stopCamera();
    };
  }, [isCameraOn, setIsCameraOn]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = motionCanvasRef.current;

    if (isCameraOn && video && canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      if (motionDetectionInterval.current) clearInterval(motionDetectionInterval.current);

      motionDetectionInterval.current = window.setInterval(() => {
        if (!video || video.readyState < video.HAVE_METADATA || video.videoWidth === 0) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const currentFrameData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        if (lastFrameData.current) {
          let diff = 0;
          for (let i = 0; i < currentFrameData.length; i += 4) {
            diff += Math.abs(currentFrameData[i] - lastFrameData.current[i]) +
                    Math.abs(currentFrameData[i+1] - lastFrameData.current[i+1]) +
                    Math.abs(currentFrameData[i+2] - lastFrameData.current[i+2]);
          }
          
          const avgDiff = diff / (currentFrameData.length / 4 * 3);
          const MOTION_THRESHOLD = 5; // Sensitivity for motion detection
          
          if (avgDiff > MOTION_THRESHOLD) {
            onMotionDetected();
          }
        }
        lastFrameData.current = currentFrameData;
      }, 500); // Check for motion twice per second
    } else {
      if (motionDetectionInterval.current) {
        clearInterval(motionDetectionInterval.current);
        motionDetectionInterval.current = null;
      }
    }
  }, [isCameraOn, onMotionDetected]);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  return (
    <div className="bg-dark-card p-4 rounded-lg border border-dark-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-light-text">Camera Monitor</h3>
        <button
          onClick={toggleCamera}
          className={`p-2 rounded-full ${isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-secondary hover:bg-green-600'} transition-colors text-white`}
          aria-label={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
          aria-pressed={isCameraOn}
        >
          {isCameraOn ? <VideoOffIcon /> : <VideoIcon />}
        </button>
      </div>
      <div className="bg-dark-bg rounded-md overflow-hidden aspect-video flex items-center justify-center relative">
        <canvas ref={motionCanvasRef} width="80" height="45" className="hidden"></canvas>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
        ></video>
        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-medium-text">
            <VideoOffIcon />
            <p className="mt-2 text-sm">Camera is off</p>
            <p className="text-xs mt-1 text-gray-500">(Your video is processed locally and never stored)</p>
          </div>
        )}
      </div>
    </div>
  );
};