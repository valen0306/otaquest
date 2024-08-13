"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase/supabaseClient'; // 相対パスを修正

interface Friend {
  name: string;
  age: number;
  favorite_name: string;
  [key: string]: any; // 任意のプロパティを許容するために any 型を使用
}

const ViewFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // フレンド情報の取得
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
