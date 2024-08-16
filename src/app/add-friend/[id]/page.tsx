"use client"; // クライアントコンポーネントとしてマーク

import { useParams } from 'next/navigation';
import QRCode from 'qrcode.react';
import Header from '@/components/Header';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/components/theme';

const AddFriend = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const my_id = Array.isArray(id) ? id[0] : id; // idがstringかstring[]かを確認し、stringに変換

  return (
    <ThemeProvider theme={theme}>
      <div className='add_friend_background'>
        <Header name='フレンド追加' userID={my_id} />
        <div className='flex justify-center items-center h-screen'>
          <QRCode className='max-w-full max-h-full' size={256} value={`${process.env.NEXT_PUBLIC_BASE_URL}/follow/${my_id}`} /> {/* フォローページのURLをQRコードに変換して表示 */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default AddFriend;