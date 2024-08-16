"use client"; // クライアントコンポーネントとしてマーク
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams をインポート
import { supabase } from '../../../../../supabase/supabaseClient'; // 相対パスを修正
import Exist from '@/components/profile.sheets'
interface Friend {
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
  icon_url?: string; // アイコン画像のURLを追加
  favorite_image_url?: string; // 推し画像のURLを追加
}
const ViewFriendDetails = () => {
  const { friend_id } = useParams(); // URL パラメータから friend_id を取得
  const [friend, setFriend] = useState<Friend | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const { data: friendData, error: friendError } = await supabase
          .from('all_users') // 正しいテーブル名に変更
          .select(
            'id, name, age, favorite_name, favorite_carrer, address, favorite_point, free_comment, x_id, instagram_id'
          )
          .eq('id', friend_id) // 指定した friend_id のフレンド情報を取得
          .single(); // 単一の結果を期待
        if (friendError) {
          throw new Error('Error fetching friend details: ' + friendError.message);
        }
        if (friendData) {
          // アイコン画像と推し画像のURLを生成
          const icon_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/all_users/public/id_icon/${friend_id}_icon.jpg`;
          const favorite_image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/all_users/public/id_favorite/${friend_id}_favorite.jpg`;
          setFriend({ ...friendData, icon_url, favorite_image_url });
        }
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
          <Exist/ >
       
        </div>
      ) : (
        <p>プロフィール情報が見つかりませんでした。</p>
      )}
    </div>
  );
};
export default ViewFriendDetails;