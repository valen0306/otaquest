"use client"; // クライアントコンポーネントとしてマーク

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';
import dynamic from 'next/dynamic';
import { supabase } from '../../../supabase/supabaseClient'; // supabase クライアントをインポート
import Header from '@/components/Header';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/app/page'
import Loading from '@/components/Loading';

// `react-qr-scanner`を動的にインポート
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

const AddFriend = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const router = useRouter(); // ルーターを取得
  const my_id = Array.isArray(id) ? id[0] : id; // idがstringかstring[]かを確認し、stringに変換

  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [canBeFriendFlag, setCanBeFriendFlag] = useState(0); // フレンド追加可能フラグ

  const handleScan = async (data: string | null) => {
    if (data) {
      const preFriendId = data;
      setScannedData(preFriendId);
      setIsCameraActive(false); // カメラを停止

      // pre-friend_id と my_id が一致しない場合、フラグを立てる
      if (preFriendId !== my_id) {
        setCanBeFriendFlag(1);
      }

      try {
        if (canBeFriendFlag === 1) {
          // お互いのfriends_arrayに相手のidを追加
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

          // ユーザ1のfriends_arrayを更新
          const { error: updateUser1Error } = await supabase
            .from('all_users')
            .update({ friends_array: updatedUser1Friends })
            .eq('id', my_id);

          // ユーザ2のfriends_arrayを更新
          const { error: updateUser2Error } = await supabase
            .from('all_users')
            .update({ friends_array: updatedUser2Friends })
            .eq('id', preFriendId);

          if (updateUser1Error || updateUser2Error) {
            throw new Error('フレンドリストの更新中にエラーが発生しました');
          }

          alert('フレンドリストが更新されました！');
        } else {
          alert('有効なQRコードではありません');
          router.push('/app/page.tsx'); // /app/page.tsxに遷移
        }
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
    <ThemeProvider theme = {theme}  >


    <div>
      <Header name = 'フレンド追加' userID={my_id} />
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
    </ThemeProvider>
    
  );
};

export default AddFriend;
