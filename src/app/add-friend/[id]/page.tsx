"use client"; // クライアントコンポーネントとしてマーク

import { useState } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode.react';
import dynamic from 'next/dynamic';

// `react-qr-scanner`を動的にインポート
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

const AddFriend = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleScan = (data: string | null) => {
    if (data) {
      setScannedData(data);
      setIsCameraActive(false); // カメラを停止
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const handleCameraToggle = () => {
    setIsCameraActive(!isCameraActive);
  };

  return (
    <div>
      <h1>フレンド追加画面</h1>
      <p>以下のQRコードを読み取って、あなたのIDを共有してください。</p>
      <QRCode value={String(id)} /> {/* IDをQRコードに変換して表示 */}

      <div>
        <button onClick={handleCameraToggle}>
          {isCameraActive ? 'カメラを停止' : 'カメラを起動'}
        </button>
      </div>

      {isCameraActive && (
        <div style={{ marginTop: '20px' }}>
          <QrScanner
            onScan={handleScan}
            onError={handleError}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {scannedData && (
        <div>
          <p>スキャンされたデータ: {scannedData}</p>
        </div>
      )}
    </div>
  );
};

export default AddFriend;
