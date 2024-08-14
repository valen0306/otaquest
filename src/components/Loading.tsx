import React from 'react';
//import '../app/globals.css'; // 必要に応じてスタイルを追加
import CircularProgress from '@mui/material/CircularProgress';
const Loading = () => {
  return (
    <div className="loading h-screen w-screen item-center">
        <div className='h-1/2'></div>
        <div className='h-1/2 text-center'><CircularProgress/></div>
    </div>
  );
};
export default Loading;