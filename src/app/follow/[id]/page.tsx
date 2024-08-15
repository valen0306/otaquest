"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../supabase/supabaseClient';
import Header from '@/components/Header';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/components/theme';

const FollowPage = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const router = useRouter();
  
  // idをstring型に変換
  const friend_id = Array.isArray(id) ? id[0] : id; 
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFollow = async () => {
    try {
      // 自分のfriends_arrayを取得
      const { data: myData, error: myError } = await supabase
        .from('all_users')
        .select('friends_array')
        .eq('id', friend_id)
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
      const updatedOtherFriends = [...otherData.friends_array, parseInt(friend_id, 10)];

      // 自分のfriends_arrayを更新
      const { error: updateMyError } = await supabase
        .from('all_users')
        .update({ friends_array: updatedMyFriends })
        .eq('id', friend_id);

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
    } catch (err) {
      console.error(err);
      setError('フォロー中にエラーが発生しました。');
    }
  };

  useEffect(() => {
    if (isFollowing) {
      router.push(`/app/${friend_id}`); // フォロー後にプロフィールページに遷移
    }
  }, [isFollowing, friend_id, router]);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header name="フォロー" userID={friend_id} />
        <h1>フォローページ</h1>
        <p>フォローボタンを押して、相手をフォローしてください。</p>
        <button onClick={handleFollow} disabled={isFollowing}>
          {isFollowing ? 'フォロー済み' : 'フォローする'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </ThemeProvider>
  );
};

export default FollowPage;
