"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter をインポート
import { supabase } from '../../../supabase/supabaseClient'; // 相対パスを修正

interface Friend {
  id: number;
  name: string;
  favorite_name: string;
  icon_url?: string; // アイコン画像のURLを追加
}

const ViewFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // useRouter フックを使用

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // [1]_friends テーブルから全てのフレンド ID を取得
        const { data: friendsData, error: friendsError } = await supabase
          .from('1_friends')
          .select('id');

        if (friendsError) {
          throw new Error('友達の取得中にエラーが発生しました: ' + friendsError.message);
        }

        // 取得した ID に基づいて all_users から name, favorite_name を取得
        if (friendsData && friendsData.length > 0) {
          const friendsWithData = await Promise.all(
            friendsData.map(async (friend: { id: number }) => {
              const { data: userData, error: userError } = await supabase
                .from('all_users')
                .select('id, name, favorite_name') // アイコンURLの取得はここでは行わない
                .eq('id', friend.id)
                .single();

              if (userError) {
                throw new Error('ユーザーデータの取得中にエラーが発生しました: ' + userError.message);
              }

              // アイコン画像のURLを生成
              const icon_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/all_users/${friend.id}_icon/${friend.id}_icon.jpg`;

              return { ...userData, icon_url };
            })
          );

          setFriends(friendsWithData || []);
        } else {
          setFriends([]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('未知のエラーが発生しました');
        }
      }
    };

    fetchFriends();
  }, []);

  const handleViewDetails = (friendId: number) => {
    // 詳細ページに遷移
    router.push(`/view-friends/[id]/details/${friendId}`);
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <h1>フレンド一覧ページ</h1>
      <div>
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <p>Name: {friend.name}</p>
              <p>Favorite: {friend.favorite_name}</p>
              
              {friend.icon_url && (
                <div>
                  <img src={friend.icon_url} style={{ width: '50px', height: '50px' }} />
                </div>
              )}
              <button onClick={() => handleViewDetails(friend.id)}>詳細を表示する</button>
            </div>
          ))
        ) : (
          <p>フレンドがいません。</p>
        )}
      </div>
    </div>
  );
};

export default ViewFriends;
