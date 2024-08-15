"use client"; // クライアントコンポーネントとしてマーク

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// インターフェースを定義
interface Friend {
  ID: number;
  Name: string; // Nameフィールドを追加
  Age: number;
  Favorite_name: string;
  Favorite_carrier: number;
  Address: string;
  Favorite_point: string;
  Free_space: string;
  X_ID: string;
  Instagram_ID: string;
  PhotoURL: string; //PhotoURLを追加
}

// 正方形A関数を定義 (Function Component)
function SquareA({
  width = '200px',
  height = '200px',
  backgroundColor = 'white',
  category = '',
  content = '',
}: {
  width?: string;
  height?: string;
  backgroundColor?: string;
  category?: string;
  content?: string | React.ReactNode;
}) {
  const squareStyle = {
    width,
    height,
    backgroundColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: '18px',
    textAlign: 'center',
    border: '1px solid black',
  };

  return (
    <div style={squareStyle}>
      <div>
        {category}<br />
        {content}
      </div>
    </div>
  );
}
//正方形B関数を定義
function SquareB({
  width = '200px',
  height = '200px',
  backgroundColor = 'white',
  category = '',
}: {
  width?: string;
  height?: string;
  backgroundColor?: string;
  category?: string;
}) {
  const squareStyle = {
    width,
    height,
    backgroundColor,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: '18px',
    textAlign: 'center',
    border: '1px solid black',
  };

  return (
    <div style={squareStyle}>
      <div>
        {category}
      </div>
    </div>
  )
}
// データを直書きする
const friendData: Friend[] = [
    { ID: 1, Name: 'Alice Johnson', Age: 25, Favorite_name: 'Alice', Favorite_carrier: 1, Address: '123 Street', Favorite_point: '10', Free_space: '50', X_ID: 'X1', Instagram_ID: '@alice', PhotoURL: 'https://example.com/photo-alice.jpg' },
    { ID: 2, Name: 'Bob Smith', Age: 30, Favorite_name: 'Bob', Favorite_carrier: 2, Address: '456 Avenue', Favorite_point: '20', Free_space: '60', X_ID: 'X2', Instagram_ID: '@bob', PhotoURL: 'https://example.com/photo-bob.jpg' },
    { ID: 3, Name: 'Charlie Brown', Age: 35, Favorite_name: 'Charlie', Favorite_carrier: 3, Address: '789 Boulevard', Favorite_point: '30', Free_space: '70', X_ID: 'X3', Instagram_ID: '@charlie', PhotoURL: 'https://example.com/photo-charlie.jpg' },
    { ID: 4, Name: 'Dave Wilson', Age: 28, Favorite_name: 'Dave', Favorite_carrier: 4, Address: '101 Highway', Favorite_point: '40', Free_space: '80', X_ID: 'X4', Instagram_ID: '@dave', PhotoURL: 'https://example.com/photo-dave.jpg' },
    { ID: 5, Name: 'Eve Adams', Age: 22, Favorite_name: 'Eve', Favorite_carrier: 5, Address: '202 Lane', Favorite_point: '50', Free_space: '90', X_ID: 'X5', Instagram_ID: '@eve', PhotoURL: 'https://example.com/photo-eve.jpg' },
  ];

const Exist = (): JSX.Element => {
  const { id } = useParams(); // useParams を使って URL パラメータを取得
  const [friend, setFriend] = useState<Friend | null>(null); // 初期状態は null に設定

  useEffect(() => { // データをフィルタリングする処理
    if (typeof id === 'string') {
      const userId = parseInt(id);
      const filteredFriend = friendData.find((friend) => friend.ID === userId) || null;
      setFriend(filteredFriend);
    }
  }, [id]);

  console.log(id)

  // friend が null の場合、データが見つからなかったことを表示
  if (!friend) {
    return <div>データが見つかりませんでした。</div>;
  }

  //画面の表示（長さ、幅、中に入っている文字はそのまま編集可能）
  return (
    <div>
      <h1>Friend List</h1>
      <ul>
        <li key={friend.ID}>
          <SquareB width= '500px' height='50px' category={'プロフィール'} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <SquareA width='245px' height='100px' category={'ID'} content={friend.ID} />
            <SquareA width='245px' height='100px' category={'名前'} content={friend.Name} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <SquareA width='245px' height='100px' category={'年齢'} content={friend.Age} />
            <SquareA width='245px' height='100px' category={'推しの名前'} content={friend.Favorite_name} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <SquareA width='245px' height='100px' category={'住所'} content={friend.Address} />
            <SquareA width='245px' height='100px' category={'推しのいいところ'} content={friend.Favorite_point} />
          </div>
          <SquareA width='500px' height='100px' category={'フリースペース'} content={friend.Free_space} />
          <SquareA width='500px' height='100px' category={'X'} content={friend.X_ID} />
          <SquareA width='500px' height='100px' category={'Instagram'} content={friend.Instagram_ID} />
        </li>
      </ul>
    </div>
  );
};

export default Exist;