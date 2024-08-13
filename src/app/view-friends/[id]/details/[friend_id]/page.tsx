"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams をインポート
import { supabase } from '../../../../../supabase/supabaseClient'; // 相対パスを修正

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
  const [iconUrl, setIconUrl] = useState<string | null>(null); // アイコン画像URLの状態
  const [favoriteImageUrl, setFavoriteImageUrl] = useState<string | null>(null); // 推し画像URLの状態

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
          setFriend(friendData);

          // アイコン画像のURLを生成
          const { data: iconData } = await supabase
            .storage
            .from('all_users')
            .getPublicUrl(`${friend_id}_icon/${friend_id}_icon.jpg`);
          
          if (iconData) {
            setIconUrl(iconData.publicUrl);
          }

          // 推し画像のURLを生成
          const { data: favoriteImageData } = await supabase
            .storage
            .from('all_users')
            .getPublicUrl(`${friend_id}_favorite/${friend_id}_favorite.jpg`);
          
          if (favoriteImageData) {
            setFavoriteImageUrl(favoriteImageData.publicUrl);
          }
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
          <h1>{friend.name}さんのプロフィール</h1>
          <p>ID: {friend.id}</p>
          <p>Name: {friend.name}</p>
          <p>Age: {friend.age}</p>
          <p>Favorite Name: {friend.favorite_name}</p>
          <p>Favorite Career: {friend.favorite_carrer}</p>
          <p>Address: {friend.address}</p>
          <p>Favorite Point: {friend.favorite_point}</p>
          <p>Free Comment: {friend.free_comment}</p>
          <p>X ID: {friend.x_id}</p>
          <p>Instagram ID: {friend.instagram_id}</p>
          
          {iconUrl && (
            <div>
              <img src={iconUrl} alt={`${friend.name}のアイコン`} style={{ width: '100px', height: '100px' }} />
            </div>
          )}

          {favoriteImageUrl && (
            <div>
              <img src={favoriteImageUrl} alt={`${friend.name}の推し画像`} style={{ width: '200px', height: '200px' }} />
            </div>
          )}
        </div>
      ) : (
        <p>プロフィール情報が見つかりませんでした。</p>
      )}
    </div>
  );
};

export default ViewFriendDetails;
