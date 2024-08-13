"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams をインポート
import { supabase } from '../../../supabase/supabaseClient'; // 相対パスを修正

interface Friend {
  [key: string]: any; // 任意のプロパティを許容するため、すべてのカラムを表示するために any 型を使用
}

const ViewFriends = () => {
  const { id } = useParams(); // useParams を使って URL パラメータを取得
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!id || typeof id !== 'string') {
          throw new Error('No valid user ID found in URL');
        }
        
        const userId = parseInt(id); // URL パラメータから ID を取得

        // フレンド情報の取得
        const { data: friendsData, error: friendsError } = await supabase
          .from('[1]_friends') // テーブル名を適切に設定
          .select('*') // すべてのカラムを選択
          .eq('user_id', userId); // フレンドリレーションの条件を設定

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
  }, [id]);

  return (
    <div>
      {error && <p>{error}</p>}
      <h1>フレンド一覧ページ</h1>
      <table>
        <thead>
          <tr>
            {/* テーブルのヘッダーを設定。カラム名はテーブルのスキーマに基づいて設定してください */}
            {friends.length > 0 && Object.keys(friends[0]).map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <tr key={index}>
                {Object.values(friend).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(friends[0] || {}).length}>フレンドがいません。</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFriends;
