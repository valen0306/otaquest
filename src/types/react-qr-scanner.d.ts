declare module 'react-qr-scanner' {
    import React from 'react';
  
    interface QrScannerProps {
      onScan: (data: string | null) => void;
      onError: (err: any) => void;
      style?: React.CSSProperties;
    }
  
    const QrScanner: React.FC<QrScannerProps>;
  
    export default QrScanner;
  }
  