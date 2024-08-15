'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase/supabaseClient';
import { TextField, Button, Typography } from '@mui/material';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('all_users')
      .select('id, name')
      .eq('name', name)
      .eq('pass', pass)
      .single();

    if (error || !data) {
      setError('一致するユーザー情報が見つかりませんでした');
    } else {
      alert(`${data.name}さん　ようこそ`);
      router.push(`/?id=${data.id}`); // ログイン成功時にIDをクエリパラメータとして追加
    }
  };

  return (
    <div>
      <Typography variant="h4">ログイン</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="ユーザーネーム"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="パスワード"
        type="password" // ここでパスワード入力をマスク
        variant="outlined"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        ログイン
      </Button>
    </div>
  );
};

export default LoginPage;
