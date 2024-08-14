"use client"; // クライアントコンポーネントとしてマーク

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase/supabaseClient';
import Loading from '../../components/Loading'; // Loadingコンポーネントをインポート

interface User {
  id: number;
  age: number;
  name: string;
  favorite_name: string;
  favorite_carrer: number;
  address: string;
  favorite_point: string;
  free_comment: string;
  x_id: string;
  instagram_id: string;
}

const SignUp = () => {
  const [age, setAge] = useState<number | ''>('');
  const [name, setName] = useState('');
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // ユーザー情報を Supabase の all_users テーブルに挿入
      const { data: userData, error: userError } = await supabase
        .from('all_users')
        .insert({
          age,
          name,
          favorite_name: favoriteName,
          favorite_carrer: favoriteCarrer,
          address,
          favorite_point: favoritePoint,
          free_comment: freeComment,
          x_id: xId,
          instagram_id: instagramId,
        })
        .select('id')
        .single();

      if (userError) {
        throw new Error('ユーザー情報の登録中にエラーが発生しました: ' + userError.message);
      }

      if (userData) {
        // 登録されたユーザーの ID を取得
        const userId = userData.id;

        // id_friends テーブルを作成
        // const { error: friendsError } = await supabase
        //   .from('all_users')
        //   .insert({ id: userId }, { table: `${userId}_friends` });

        // if (friendsError) {
        //   throw new Error('`id_friends` テーブルへの登録中にエラーが発生しました: ' + friendsError.message);
        // }

        // アイコンファイルとお気に入り画像ファイルをアップロード
        if (iconFile) {
          const { error: uploadIconError } = await supabase
            .storage
            .from('all_users')
            .upload(`${userId}_icon/${userId}_icon.jpg`, iconFile);

          if (uploadIconError) {
            throw new Error('アイコンファイルのアップロード中にエラーが発生しました: ' + uploadIconError.message);
          }
        }

        if (favoriteFile) {
          const { error: uploadFavoriteError } = await supabase
            .storage
            .from('all_users')
            .upload(`${userId}_favorite/${userId}_favorite.jpg`, favoriteFile);

          if (uploadFavoriteError) {
            throw new Error('お気に入り画像ファイルのアップロード中にエラーが発生しました: ' + uploadFavoriteError.message);
          }
        }

        // アップロード完了のポップアップ表示
        alert('アップロードが完了しました');

        // ロード中フラグをオフにし、リダイレクト
        setLoading(false);
        router.push('/app/page'); // リダイレクト先のパスに合わせて変更してください
      } else {
        throw new Error('ユーザー情報の取得に失敗しました');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('未知のエラーが発生しました');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>サインアップ</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            年齢:
            <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} required />
          </label>
        </div>
        <div>
          <label>
            名前:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            お気に入りの名前:
            <input type="text" value={favoriteName} onChange={(e) => setFavoriteName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            お気に入りのキャリア:
            <input type="number" value={favoriteCarrer} onChange={(e) => setFavoriteCarrer(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            住所:
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            お気に入りのポイント:
            <input type="text" value={favoritePoint} onChange={(e) => setFavoritePoint(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            自由コメント:
            <textarea value={freeComment} onChange={(e) => setFreeComment(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            X ID:
            <input type="text" value={xId} onChange={(e) => setXId(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Instagram ID:
            <input type="text" value={instagramId} onChange={(e) => setInstagramId(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            アイコン画像:
            <input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <div>
          <label>
            お気に入り画像:
            <input type="file" accept="image/*" onChange={(e) => setFavoriteFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '処理中...' : '登録する'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
