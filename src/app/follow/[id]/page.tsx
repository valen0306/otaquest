"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../supabase/supabaseClient';
import Header from '../../../components/Header';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../../components/theme';
import React from 'react';

const FollowPage = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const router = useRouter();
  
  // idをstring型に変換
  const friend_id = Array.isArray(id) ? id[0] : id; 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginAndFollow = async () => {
    try {
      // ユーザー情報を照会
      const { data: userData, error: userError } = await supabase
        .from('all_users')
        .select('id, friends_array')
        .eq('name', username)
        .eq('pass', password)
        .single();

      if (userError || !userData) {
        throw new Error('ログインに失敗しました。ユーザー名またはパスワードが間違っています。');
      }

      const my_id = userData.id;

      // 自分のfriends_arrayを取得
      const { data: myData, error: myError } = await supabase
        .from('all_users')
        .select('friends_array')
        .eq('id', my_id)
        .single();

      if (myError) {
        throw new Error('自分のフレンドリストの取得中にエラーが発生しました');
      }

      // 相手のidが既にfriends_arrayにあるか確認
      if (myData.friends_array.includes(parseInt(friend_id, 10))) {
        setIsFollowing(true);
        return;
      }

      // 相手のfriends_arrayを取得
      const { data: otherData, error: otherError } = await supabase
        .from('all_users')
        .select('friends_array')
        .eq('id', friend_id)
        .single();

      if (otherError) {
        throw new Error('相手のフレンドリストの取得中にエラーが発生しました');
      }

      // フレンドリストを更新
      const updatedMyFriends = [...myData.friends_array, parseInt(friend_id, 10)];
      const updatedOtherFriends = [...otherData.friends_array, parseInt(my_id, 10)];

      // 自分のfriends_arrayを更新
      const { error: updateMyError } = await supabase
        .from('all_users')
        .update({ friends_array: updatedMyFriends })
        .eq('id', my_id);

      // 相手のfriends_arrayを更新
      const { error: updateOtherError } = await supabase
        .from('all_users')
        .update({ friends_array: updatedOtherFriends })
        .eq('id', friend_id);

      if (updateMyError || updateOtherError) {
        throw new Error('フレンドリストの更新中にエラーが発生しました');
      }

      setIsFollowing(true);
      alert('フォローが完了しました！');
      router.push(`/?id=${my_id}`); // フォロー後に自分のホームページに遷移
    } catch (err) {
      const errorMessage = (err as Error).message || '予期しないエラーが発生しました';
      console.error(errorMessage);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    if (isFollowing) {
      router.push(`/?id=${friend_id}`); // フォロー後に相手のプロフィールページに遷移
    }
  }, [isFollowing, friend_id, router]);

  return (
    <ThemeProvider theme={theme}>
      <div className='home_background'>
        <Header name="フォロー" userID={friend_id} />
        <form className='mt-28 ml-10' onSubmit={(e) => {
          e.preventDefault();
          handleLoginAndFollow();
        }}>
          <div>
            <label>ユーザー名:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>パスワード:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isFollowing}>
            {isFollowing ? 'フォロー済み' : 'ログインしてフォロー'}
          </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </ThemeProvider>
  );
};

export default FollowPage;
