"use client"; // クライアントコンポーネントとしてマーク

import { useState } from 'react';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode.react';
import dynamic from 'next/dynamic';
import { supabase } from '../../../supabase/supabaseClient'; // supabase クライアントをインポート

// `react-qr-scanner`を動的にインポート
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

const AddFriend = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const userId = Array.isArray(id) ? id[0] : id; // idがstringかstring[]かを確認し、stringに変換

  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleScan = async (data: string | null) => {
    if (data) {
      setScannedData(data);
      setIsCameraActive(false); // カメラを停止

      try {
        // ユーザ2のフレンドリストにユーザ1を追加
        const { error: addFriendToUser2 } = await supabase
          .from(`${userId}_friends`)
          .insert({ friend_id: parseInt(data, 10) });

        // ユーザ1のフレンドリストにユーザ2を追加
        const { error: addFriendToUser1 } = await supabase
          .from(`${data}_friends`)
          .insert({ friend_id: parseInt(userId, 10) });

        if (addFriendToUser2 || addFriendToUser1) {
          throw new Error('フレンドリストの更新中にエラーが発生しました');
        }

        alert('フレンドリストが更新されました！');
      } catch (error) {
        console.error(error);
        alert('フレンドリストの更新に失敗しました');
      }
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
      <QRCode value={String(userId)} /> {/* IDをQRコードに変換して表示 */}

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
