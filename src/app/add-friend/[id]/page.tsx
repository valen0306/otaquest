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
      <div>
        <Header name='フレンド追加' userID={my_id} />
        <h1>フレンド追加画面</h1>
        <p>以下のQRコードを読み取って、あなたのIDを共有してください。</p>
        <QRCode value={`${process.env.NEXT_PUBLIC_BASE_URL}/follow/${my_id}`} /> {/* フォローページのURLをQRコードに変換して表示 */}
      </div>
    </ThemeProvider>
  );
};

export default AddFriend;
