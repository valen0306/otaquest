"use client"; // クライアントコンポーネントとしてマーク
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase/supabaseClient';
// インターフェースを定義
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
// 四角形関数Aの定義
function SquareA({
  width = '200px',
  height = '200px',
  backgroundColor = '#F7FCFE', // デフォルトの背景色をF7FCFEに設定
  category = '',
  content = '',
}: {
  width?: string;
  height?: string;
  backgroundColor?: string;
  category?: string;
  content?: string | React.ReactNode;
}) {
  const squareStyle:React.CSSProperties = {
    width,
    height,
    backgroundColor,
    display: 'flex',
    flexDirection: 'column', // 縦方向に並べる
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: '18px',
    border: '1px solid black',
    borderRadius: '10px',
  };
  const categoryStyle = {
    width: '100%',
    textAlign: 'left' as const, // categoryを左揃え
    padding: '5px',
  };
  const contentStyle = {
    width: '100%',
    textAlign: 'center' as const, // contentを中央揃え
    padding: '5px',
  };
  return (
    <div style={squareStyle}>
      <div style={categoryStyle}>
        {category}
      </div>
      <div style={contentStyle}>
        {content}
      </div>
    </div>
  );
}
// 四角形B関数を定義 (Function Component)
function SquareB({
  width = '200px',
  height = '200px',
  backgroundColor = 'F7FCFE', // デフォルトの背景色をF7FCFEに設定
  category = '',
  content = '',
  category1 = '',
  content1 = '',
}: {
  width?: string;
  height?: string;
  backgroundColor?: string;
  category?: string;
  content?: string | React.ReactNode;
  category1?: string;
  content1?: string | React.ReactNode;
}) {
  const squareStyle :React.CSSProperties= {
    width,
    height,
    backgroundColor,
    display: 'flex',
    flexDirection: 'column', // 縦方向に要素を並べる
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: '18px',
    border: '1px solid black',
    borderRadius: '10px',
    padding: '10px',
  };
  const categoryStyle = {
    width: '100%',
    textAlign: 'left' as const, // categoryとcategory1を左揃え
    padding: '5px 0',
  };
  const contentStyle = {
    width: '100%',
    textAlign: 'center' as const, // contentとcontent1を中央揃え
    padding: '5px 0',
  };
  return (
    <div style={squareStyle}>
      <div style={categoryStyle}>
        {category}
      </div>
      <div style={contentStyle}>
        {content}
      </div>
      <div style={categoryStyle}>
        {category1}
      </div>
      <div style={contentStyle}>
        {content1}
      </div>
    </div>
  );
}
// プロフィール表示コンポーネント
const Exist = () => {
  const { friend_id } = useParams(); // URL パラメータから friend_id を取得
  const [friend, setFriend] = useState<Friend | null>(null); // 初期状態は null に設定
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
  if (error) {
    return <div>{error}</div>;
  }
  if (!friend) {
    return <div>データが見つかりませんでした。</div>;
  }
  return (
    <div>
      <h1>{friend.name}さんのプロフィール</h1>
      <ul>
        <li key={friend.id}>
          <div style={{ border: 'solid', display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                {friend.icon_url && (
                  <SquareA width="245px" height="245px" category="アイコン" content={<img src={friend.icon_url} alt={`${friend.name}のアイコン`} style={{ width: '100%', height: '100%' }} />} />
                )}
                {friend.favorite_image_url && (
                  <SquareA width="245px" height="245px" category="推しの画像" content={<img src={friend.favorite_image_url} alt={`${friend.name}の推し画像`} style={{ width: '100%', height: '100%' }} />} />
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <SquareA width="245px" height="100px" category="名前" content={friend.name} />
                <SquareA width="245px" height="100px" category="推しの名前" content={friend.favorite_name} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <SquareA width="245px" height="100px" category="年齢" content={friend.age} />
                <SquareA width="245px" height="100px" category="住所" content={friend.address} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <SquareA width="500px" height="100px" category="推しのいいところ" content={friend.favorite_point} />
              </div>
              <SquareA width="500px" height="100px" category="フリースペース" content={friend.free_comment} />
              <SquareB width="500px" height="150px" category="X" content={friend.x_id} category1="Instagram" content1={friend.instagram_id} />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
export default Exist;