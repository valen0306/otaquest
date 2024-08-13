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
  id: number; // ユーザーIDを保持するためにidを追加
  name: string;
  age: number;
  favorite_name: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = 1; // テストデータのIDを指定

      const { data, error } = await supabase
        .from('users')
        .select('id, name, age, favorite_name') // idを取得するように変更
        .eq('id', userId)
        .single();

      // エラーハンドリング
      if (error) {
        setError('Error fetching user: ' + error.message);
        console.error('Error fetching user:', error);
      } else if (data) {
        setUser(data);
      } else {
        setError('No user found with the given ID');
      }
    };

    fetchUser();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {error && <p>{error}</p>}
      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Age: {user.age}</p>
          <p>Favorite: {user.favorite_name}</p>

          {/* カード編集画面への遷移 */}
          <Link href={`/edit/${user.id}`}>
            <Button variant="contained" color="secondary">
              カード編集画面へ
            </Button>
          </Link>

          {/* フレンド追加画面への遷移 */}
          <Link href={`/add-friend/${user.id}`}>
            <button>フレンド追加画面へ</button>
          </Link>

          {/* フレンド一覧画面への遷移 */}
          <Link href={`/view-friends/${user.id}`}>
            <button>フレンド一覧画面へ</button>
          </Link>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </ThemeProvider>
  );
};

export default Home;
