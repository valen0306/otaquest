"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabase/supabaseClient';
import { useParams } from 'next/navigation';

interface User {
  name: string;
  age: number;
  favorite_name: string;
}

const EditCard = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [favoriteName, setFavoriteName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('name, age, favorite_name')
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
      }
    };

    fetchUser();
  }, [id]);

  const handleSave = async () => {
    const { error } = await supabase
      .from('users')
      .update({ name, age, favorite_name: favoriteName })
      .eq('id', id);

    if (error) {
      alert('正常に保存できませんでした。home画面に戻ります');
      router.push('/');
    } else {
      router.push('/');
    }
  };

  return (
    <div>
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
          <button onClick={handleSave}>保存</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditCard;
