"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams をインポート
import { supabase } from '../../../../../supabase/supabaseClient'; // 相対パスを修正

interface Friend {
  id: number;
  name: string;
  age: number;
  favorite_name: string;
  [key: string]: any; // 任意のプロパティを許容するために any 型を使用
}

const ViewFriendDetails = () => {
  const { friend_id } = useParams(); // URL パラメータから friend_id を取得
  debugger
  const [friend, setFriend] = useState<Friend | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const { data: friendData, error: friendError } = await supabase
          .from('[1]_friends') // テーブル名を適切に設定
          .select('*')
          .eq('id', friend_id) // 指定した friend_id のフレンド情報を取得
          .single(); // 単一の結果を期待

        if (friendError) {
          throw new Error('Error fetching friend details: ' + friendError.message);
        }
        setFriend(friendData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchFriendDetails();
  }, [friend_id]);

  return (
    <div>
      {error && <p>{error}</p>}
      {friend ? (
        <div>
          <h1>{friend.name}さんのプロフィール</h1>
          <p>Name: {friend.name}</p>
          <p>Age: {friend.age}</p>
          <p>Favorite: {friend.favorite_name}</p>
          {/* 必要に応じて他のフィールドを表示 */}
        </div>
      ) : (
        <p>プロフィール情報が見つかりませんでした。</p>
      )}
    </div>
  );
};

export default ViewFriendDetails;
