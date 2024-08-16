'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // 修正: 'next/navigation' を使用
import { supabase } from '../supabase/supabaseClient';
import Link from 'next/link';
import { ThemeProvider, createTheme, Button, Typography, Box } from '@mui/material';
import Header from '@/components/Header';
import image from '@/assets/image.png'
import { Public } from '@mui/icons-material';
import { User } from '@/components/user';
import { theme } from '@/components/theme';



const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userIconUrl, setUserIconUrl] = useState<string | null>(null);
  const [favoriteImageUrl, setFavoriteImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get('id'); // クエリパラメータからIDを取得

  useEffect(() => {
    const fetchUser = async () => {
      console.log('idはこいつ:')
      console.log(userId)
      if (userId) {
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
      }
    };

    const fetchUserIcon = async () => {
      const { data } = await supabase
        .storage
        .from('avatars')  // 修正したストレージバケット名に合わせて変更
        .getPublicUrl('1_icon/1_icon.jpg'); // 実際のアイコン画像のファイル名に置き換え

      if (data) {
        setUserIconUrl(data.publicUrl);
      }
    };

    const fetchFavoriteImage = async () => {
      const { data } = await supabase
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
  }, [userId]);

  const handleSignUp = () => {
    window.location.href = '/sign_up'; // 修正: useRouter ではなく、直接 window.location.href を使用
  };

  const handleLogin = () => {
    window.location.href = '/login'; // 修正: useRouter ではなく、直接 window.location.href を使用
  };

  return (
    <ThemeProvider theme={theme}>
    <Suspense>  
      {error && <p>{error}</p>}
      
      {userId ? (
        user ? (
          <div>
            <Header userID={userId} name={user.name}/>
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
          </div>
        ) : (
          <p>Loading...</p>
        )
      ) : (
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          <Button
            variant="contained"
            onClick={handleSignUp}
            style={{ marginRight: '10px', borderRadius: '15px', height: '60px', width: '300px' ,backgroundColor: "#ffd9da" , color: "#333132" }}
          >
            CREATE　ACCOUNT
          </Button>

          <Button
            variant="contained"
            onClick={handleLogin}
            style={{ marginRight: '10px', borderRadius: '15px', height: '60px', width: '300px', backgroundColor: "#ffd9da" , color: "#333132"}}
          >
            SIGN IN
          </Button>
        </div>
      )}
      </Suspense>
    </ThemeProvider>
  );
};

export default Home;
