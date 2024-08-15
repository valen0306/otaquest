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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '35px', textAlign: 'center', marginTop: '60px', color: "#333132" }}>OtaQuest</h1>
      <img src={"/assets/image.png"} style={{ width: '250px', textAlign: 'center', margin: '0 auto', marginTop: '0px' }} />



      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Username"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        style={{ marginTop: '20px', width: '300px'}}
      />
      <TextField
        label="Password"
        type="password" // ここでパスワード入力をマスク
        variant="outlined"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        margin="normal"
        style={{width: '300px'}}
      />
      <Button
        variant="contained"
        onClick={handleLogin}
        style={{ marginTop: '40px', width: '300px', height: '60px', backgroundColor: "#ffd9da", color: "#333132" }}
      >
        SIGN IN
      </Button>
    </div>
  );
};

export default LoginPage;
