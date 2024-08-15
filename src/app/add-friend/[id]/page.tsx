"use client"; // このファイル全体をクライアントコンポーネントとしてマーク

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';
import dynamic from 'next/dynamic';
import { supabase } from '../../../supabase/supabaseClient'; // supabase クライアントをインポート
import Header from '@/components/Header';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/components/theme';
import Loading from '@/components/Loading';
import { Suspense } from 'react';
import { QrCodeScanner } from '@mui/icons-material';

// QRCodeScannerコンポーネントを動的にインポート
const QRCodeScanner = dynamic(() => import('@/components/QRCodeScanner'), { ssr: false });

const AddFriend = () => {
  const { id } = useParams();
  const router = useRouter();
  const my_id = Array.isArray(id) ? id[0] : id;

  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [videoDeviceId, setVideoDeviceId] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    // メディアデバイスを取得して、カメラデバイスのリストを取得する
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setVideoDeviceId(videoDevices[0].deviceId); // 最初のデバイスをデフォルトで選択
      }
    });
  }, []);

  const handleScan = async (data: string | null) => {
    if (data) {
      const preFriendId = data;
      setScannedData(preFriendId);
      setIsCameraActive(false);

      try {
        const { data: user1Data, error: user1Error } = await supabase
          .from('all_users')
          .select('friends_array')
          .eq('id', my_id)
          .single();

        const { data: user2Data, error: user2Error } = await supabase
          .from('all_users')
          .select('friends_array')
          .eq('id', preFriendId)
          .single();

        if (user1Error || user2Error) {
          throw new Error('フレンドリストの取得中にエラーが発生しました');
        }

        const updatedUser1Friends = [...user1Data.friends_array, parseInt(preFriendId, 10)];
        const updatedUser2Friends = [...user2Data.friends_array, parseInt(my_id, 10)];

        const { error: updateUser1Error } = await supabase
          .from('all_users')
          .update({ friends_array: updatedUser1Friends })
          .eq('id', my_id);

        const { error: updateUser2Error } = await supabase
          .from('all_users')
          .update({ friends_array: updatedUser2Friends })
          .eq('id', preFriendId);

        if (updateUser1Error || updateUser2Error) {
          throw new Error('フレンドリストの更新中にエラーが発生しました');
        }

        alert('フレンドリストが更新されました！');
        router.push('/app/page.tsx');

      } catch (error) {
        console.error(error);
        alert('フレンドリストの更新に失敗しました');
      }
    }
  };

  const handleCameraToggle = () => {
    setIsCameraActive(!isCameraActive);
  };

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVideoDeviceId(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <div>
          <Header name='フレンド追加 var2' userID={my_id} />
          <h1>フレンド追加画面</h1>
          <p>以下のQRコードを読み取って、あなたのIDを共有してください。</p>
          <QRCode value={String(my_id)} />

          <div>
            <button onClick={handleCameraToggle}>
              {isCameraActive ? 'カメラを停止' : 'カメラを起動'}
            </button>
            {isCameraActive && (
              <QRCodeScanner
                onScan={handleScan}
                videoDeviceId={videoDeviceId}
                devices={devices}
                handleDeviceChange={handleDeviceChange}
              />
            )}
          </div>

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
