import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const videoWidth = 500;
const videoHeight = 500;
const videoFrameRate = 5;

interface QRCodeScannerProps {
  onScan: (data: string | null) => void;
  videoDeviceId: string | null;
  devices: MediaDeviceInfo[];
  handleDeviceChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, videoDeviceId, devices, handleDeviceChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isContinue, setIsContinue] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string[]>([]);

  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
      width: { min: 1280, ideal: 1920, max: 2560 },
      height: { min: 720, ideal: 1080, max: 1440 },
      frameRate: {
        max: videoFrameRate,
      },
    },
  };

  useEffect(() => {
    const openCamera = async () => {
      const video = videoRef.current;
      if (video) {
        video.addEventListener('play', () => {
          console.log("(w,h)=(", video.videoWidth, ", " + video.videoHeight, ")");
        });
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
      }
    };
    openCamera();
  }, [videoDeviceId]);

  useEffect(() => {
    if (!isContinue) {
      return;
    }

    const decodeQRCode = () => {
      const context = canvasRef.current?.getContext('2d');
      const video = videoRef.current;

      if (!context || !video) {
        return null;
      }

      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
      const code = jsQR(imageData.data, videoWidth, videoHeight);

      return code?.data;
    };

    const intervalId = window.setInterval(() => {
      const decodedValue = decodeQRCode();

      if (decodedValue && !qrCodeData.includes(decodedValue)) {
        setQrCodeData((prev) => [...prev, decodedValue]);
        onScan(decodedValue); // スキャンしたデータを渡す
      }
    }, 1_000 / videoFrameRate);
    intervalRef.current = intervalId;

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isContinue, qrCodeData, onScan]);

  const handleStart = () => {
    setIsContinue(true);
  };

  const handleStop = () => {
    setIsContinue(false);
  };

  return (
    <div className="App">
      <p>QR Code Scanner</p>
      <div style={{ display: 'grid' }}>
        <div>
          <select onChange={handleDeviceChange} value={videoDeviceId ?? ''}>
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `カメラ ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <video autoPlay playsInline={true} ref={videoRef} style={{ width: '100%' }}>
            <canvas width={videoWidth} height={videoHeight} ref={canvasRef} />
          </video>
        </div>
        <div>
          <p>{qrCodeData.join('\n')}</p>
        </div>
        <div>
          <button onClick={handleStart}>Start Scan</button>
          <button onClick={handleStop}>Stop Scan</button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeScanner;
