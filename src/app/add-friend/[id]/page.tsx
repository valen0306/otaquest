"use client";

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';
import dynamic from 'next/dynamic';
import { supabase } from '../../../supabase/supabaseClient'; // supabase クライアントをインポート
import Header from '@/components/Header';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/components/theme';
import Loading from '@/components/Loading';
import { Suspense } from 'react';
import Webcam from "react-webcam";
import jsQR from "jsqr";

const AddFriend = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const router = useRouter(); // ルーターを取得
  const my_id = Array.isArray(id) ? id[0] : id; // idがstringかstring[]かを確認し、stringに変換

  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [canBeFriendFlag, setCanBeFriendFlag] = useState(0); // フレンド追加可能フラグ

  const handleScan = async (data: string | null) => {
    // QRコードスキャンの処理
    // ...
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  const handleCameraToggle = () => {
    setIsCameraActive(!isCameraActive);
  };

  const videoConstraints = {
    facingMode: "environment" // 外向きカメラを指定
  };

  return (
    <ThemeProvider theme={theme}>
      <Suspense>
        <div>
          <Header name='フレンド追加' userID={my_id} />
          <h1>フレンド追加画面</h1>
          <p>以下のQRコードを読み取って、あなたのIDを共有してください。</p>
          <QRCode value={String(my_id)} /> {/* IDをQRコードに変換して表示 */}

          <div>
            <button onClick={handleCameraToggle}>
              {isCameraActive ? 'カメラを停止' : 'カメラを起動'}
            </button>
          </div>

          {isCameraActive && (
            <div style={{ marginTop: '20px' }}>
              <Webcam
                audio={false}
                videoConstraints={videoConstraints}
                screenshotFormat="image/jpeg"
                onUserMediaError={handleError}
              />
            </div>
          )}

          {scannedData && (
            <div>
              <p>スキャンされたデータ: {scannedData}</p>
            </div>
          )}
        </div>
      </Suspense>
    </ThemeProvider>
  );
};

export default AddFriend;
