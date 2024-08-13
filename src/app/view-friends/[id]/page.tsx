"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter をインポート
import { supabase } from '../../../supabase/supabaseClient'; // 相対パスを修正

interface Friend {
  id: number;
  name: string;
  age: number;
  favorite_name: string;
  [key: string]: any; // 任意のプロパティを許容するために any 型を使用
}

const ViewFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // useRouter フックを使用

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data: friendsData, error: friendsError } = await supabase
          .from('[1]_friends') // テーブル名を適切に設定
          .select('*'); // すべてのカラムを選択

        if (friendsError) {
          throw new Error('Error fetching friends: ' + friendsError.message);
        }
        setFriends(friendsData || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
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
              <p>Age: {friend.age}</p>
              <p>Favorite: {friend.favorite_name}</p>
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
