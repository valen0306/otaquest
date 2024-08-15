"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../supabase/supabaseClient';
import { CardComponent } from '../../../components/card_userlist';
import Header from '@/components/Header';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/components/theme'
import Loading from '@/components/Loading';


interface Friend {
  id: number;
  name: string;
  favorite_name: string;
  icon_url?: string;
}

const ViewFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {id} = useParams();
  const userId = Array.isArray(id)?id[0]:id;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // 現在のユーザーIDを取得（仮にidが1の場合とする）
        const userId = 1; // 実際の実装では適切に取得する必要があります

        // friends_arrayからフレンドのIDを取得
        const { data: userData, error: userError } = await supabase
          .from('all_users')
          .select('friends_array')
          .eq('id', userId)
          .single();

        if (userError) {
          throw new Error('ユーザーデータの取得中にエラーが発生しました: ' + userError.message);
        }

        const friendsIds = userData?.friends_array || [];

        if (friendsIds.length > 0) {
          const friendsWithData = await Promise.all(
            friendsIds.map(async (friendId: number) => {
              const { data: friendData, error: friendError } = await supabase
                .from('all_users')
                .select('id, name, favorite_name')
                .eq('id', friendId)
                .single();

              if (friendError) {
                throw new Error('フレンドデータの取得中にエラーが発生しました: ' + friendError.message);
              }

              const icon_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/all_users/id_icon/${friendId}_icon.jpg`;
              console.log(icon_url)
              return { ...friendData, icon_url };
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
    router.push(`/view-friends/[id]/details/${friendId}`);
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <ThemeProvider theme={theme}>
      <Header name = 'フレンド一覧' userID={userId}/>
      
      <h1>フレンド一覧ページ</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id} style={{ margin: '20px', width: '300px' }}>
              <CardComponent
                title={friend.name}
                description={friend.favorite_name}
                image={friend.icon_url || 'デフォルトのイメージパス'}
                onClick={() => handleViewDetails(friend.id)}
              />
            </div>
          ))
        ) : (
          <p>フレンドがいません。</p>
        )}
      </div>

      </ThemeProvider>
      
    </div>
  );
};

export default ViewFriends;
