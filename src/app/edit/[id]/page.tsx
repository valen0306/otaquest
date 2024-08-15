"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase/supabaseClient';
import { useParams } from 'next/navigation';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/app/page' ;
import Header from '@/components/Header';
import Loading from '@/components/Loading';

interface User {
  name: string;
  age: number;
  favorite_name: string;
  favorite_carrer: number;
  address: string;
  favorite_point: string;
  free_comment: string;
  x_id: string;
  instagram_id: string;
  icon_url: string;
  favorite_image_url: string;
}

const EditCard = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [favoriteName, setFavoriteName] = useState('');
  const [favoriteCarrer, setFavoriteCarrer] = useState<number | ''>('');
  const [address, setAddress] = useState('');
  const [favoritePoint, setFavoritePoint] = useState('');
  const [freeComment, setFreeComment] = useState('');
  const [xId, setXId] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [favoriteFile, setFavoriteFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = Array.isArray(id) ? id[0]:id;
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('all_users') // Adjust table name as needed
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError('Error fetching user: ' + error.message);
        console.error('Error fetching user:', error);
      } else if (data) {
        setUser(data);
        setName(data.name);
        setAge(data.age);
        setFavoriteName(data.favorite_name);
        setFavoriteCarrer(data.favorite_carrer);
        setAddress(data.address);
        setFavoritePoint(data.favorite_point);
        setFreeComment(data.free_comment);
        setXId(data.x_id);
        setInstagramId(data.instagram_id);
      }
    };

    fetchUser();
  }, [id]);

  const handleSave = async () => {
    const { error: updateError } = await supabase
      .from('all_users') // Adjust table name as needed
      .update({
        name,
        age,
        favorite_name: favoriteName,
        favorite_carrer: favoriteCarrer,
        address,
        favorite_point: favoritePoint,
        free_comment: freeComment,
        x_id: xId,
        instagram_id: instagramId,
      })
      .eq('id', id);

    if (updateError) {
      alert('正常に保存できませんでした。home画面に戻ります');
      router.push('/');
      return;
    }

    if (iconFile) {
      try {
        const { data: uploadIconData, error: uploadIconError } = await supabase.storage
          .from('all_users') // ストレージバケット名が正しいか確認
          .upload(`/public/id_icon/${id}_icon.jpg`, iconFile, {
            cacheControl: '3600',
            upsert: false,// ファイルの上書きを避けたい場合は、falseに設定
          });
    
        if (uploadIconError) {
          throw new Error('アイコンファイルのアップロード中にエラーが発生しました(icon): ' + uploadIconError.message);
        } else {
          console.log('ファイルが正常にアップロードされました:', uploadIconData);
        }
      } catch (err) {
        console.error(err);
        throw new Error('ファイルのアップロード処理中に問題が発生しました(icon)');
      }
    }

    if (favoriteFile) {
      try {
        const { data: uploadFavoriteData, error: uploadFavoriteError } = await supabase.storage
          .from('all_users') // ストレージバケット名が正しいか確認
          .upload(`/public/id_favorite/${id}_favorite.jpg`, favoriteFile, {
            cacheControl: '3600',
            upsert: false, // ファイルの上書きを避けたい場合は、falseに設定
          });
    
        if (uploadFavoriteError) {
          throw new Error('アイコンファイルのアップロード中にエラーが発生しました(favorite): ' + uploadFavoriteError.message);
        } else {
          console.log('ファイルが正常にアップロードされました:', uploadFavoriteData);
        }
      } catch (err) {
        console.error(err);
        throw new Error('ファイルのアップロード処理中に問題が発生しました(favorite)');
      }
    }

    router.push('/');
  };

  return (
    <div>
      <ThemeProvider theme={ theme }>
      <Header name = '編集' userID={userId}/>



      {user ? (
        <>
          <h1>{user.name}さんのカード編集</h1>
          <div>
            <label>名前:</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>年齢:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
            />
          </div>
          <div>
            <label>お気に入り:</label>
            <input value={favoriteName} onChange={(e) => setFavoriteName(e.target.value)} />
          </div>
          <div>
            <label>キャリア:</label>
            <input
              type="number"
              value={favoriteCarrer}
              onChange={(e) => setFavoriteCarrer(e.target.value ? parseInt(e.target.value) : '')}
            />
          </div>
          <div>
            <label>住所:</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <label>お気に入りのポイント:</label>
            <input value={favoritePoint} onChange={(e) => setFavoritePoint(e.target.value)} />
          </div>
          <div>
            <label>自由コメント:</label>
            <input value={freeComment} onChange={(e) => setFreeComment(e.target.value)} />
          </div>
          <div>
            <label>X ID:</label>
            <input value={xId} onChange={(e) => setXId(e.target.value)} />
          </div>
          <div>
            <label>Instagram ID:</label>
            <input value={instagramId} onChange={(e) => setInstagramId(e.target.value)} />
          </div>
          <div>
            <label>アイコン画像:</label>
            <input type="file" onChange={(e) => e.target.files && setIconFile(e.target.files[0])} />
            {user.icon_url && <img src={user.icon_url} alt="Icon" width={100} />}
          </div>
          <div>
            <label>お気に入り画像:</label>
            <input type="file" onChange={(e) => e.target.files && setFavoriteFile(e.target.files[0])} />
            {user.favorite_image_url && <img src={user.favorite_image_url} alt="Favorite" width={100} />}
          </div>
          <button onClick={handleSave}>保存</button>
        </>
      ) : (
        <Loading/>
      )}

      </ThemeProvider>
    </div>



  );
};

export default EditCard;
