'use client'; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import Link from 'next/link';
import { Button, createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

interface User {
  id: number;
  name: string;
  age: number;
  favorite_name: string;
  favorite_carrer: number;
  address: string;
  favorite_point: string;
  free_comment: string;
  x_id: string;
  instagram_id: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userIconUrl, setUserIconUrl] = useState<string | null>(null);
  const [favoriteImageUrl, setFavoriteImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = 1; // テストデータのIDを指定

      const { data, error } = await supabase
        .from('all_users')
        .select(
          `id, name, age, favorite_name, favorite_carrer, address, 
          favorite_point, free_comment, x_id, instagram_id`
        )
        .eq('id', userId)
        .single();

      if (error) {
        setError('Error fetching user: ' + error.message);
        console.error('Error fetching user:', error);
      } else if (data) {
        setUser(data);
      } else {
        setError('No user found with the given ID');
      }
    };

    const fetchUserIcon = async () => {
      const { data } = supabase
        .storage
        .from('avatars')  // 修正したストレージバケット名に合わせて変更
        .getPublicUrl('1_icon/1_icon.jpg'); // 実際のアイコン画像のファイル名に置き換え

      if (data) {
        setUserIconUrl(data.publicUrl);
      }
    };

    const fetchFavoriteImage = async () => {
      const { data } = supabase
        .storage
        .from('avatars')  // 修正したストレージバケット名に合わせて変更
        .getPublicUrl('1_favorite/1_favorite.jpg'); // 実際の推し画像のファイル名に置き換え

      if (data) {
        setFavoriteImageUrl(data.publicUrl);
      }
    };

    fetchUser();
    fetchUserIcon();
    fetchFavoriteImage();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {error && <p>{error}</p>}
      {user ? (
        <div>
          {userIconUrl && <img src={userIconUrl} alt="ユーザアイコン" style={{ width: '100px', height: '100px' }} />}
          <p>Name: {user.name}</p>
          <p>Age: {user.age}</p>
          <p>Favorite Name: {user.favorite_name}</p>
          <p>Favorite Carrer: {user.favorite_carrer}</p>
          <p>Address: {user.address}</p>
          <p>Favorite Point: {user.favorite_point}</p>
          <p>Free Comment: {user.free_comment}</p>
          <p>X ID: {user.x_id}</p>
          <p>Instagram ID: {user.instagram_id}</p>
          {favoriteImageUrl && <img src={favoriteImageUrl} alt="推し画像" style={{ width: '200px', height: '200px' }} />}

          {/* カード編集画面への遷移 */}
          <Link href={`/edit/${user.id}`}>
            <Button variant="contained" color="secondary" style={{ marginRight: '10px' }}>
              カード編集画面へ
            </Button>
          </Link>

          {/* フレンド追加画面への遷移 */}
          <Link href={`/add-friend/${user.id}`}>
            <Button variant="contained" color="secondary" style={{ marginRight: '10px' }}>
              フレンド追加画面へ
            </Button>
          </Link>

          {/* フレンド一覧画面への遷移 */}
          <Link href={`/view-friends/${user.id}`}>
            <Button variant="contained" color="secondary" style={{ marginRight: '10px' }}>
              フレンド一覧画面へ
            </Button>
          </Link>

          {/* サインアップ画面への遷移 */}
          <Link href="/sign_up">
            <Button variant="contained" color="primary">
              サインアップ画面へ
            </Button>
          </Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </ThemeProvider>
  );
};

export default Home;
