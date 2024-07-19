declare module "react-qr-scanner" {
  import React from "react";

  interface QrReaderProps {
    delay?: number;
    onError?: (error: any) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    facingMode?: "user" | "environment";
    legacyMode?: boolean;
    maxImageSize?: number;
    className?: string;
    showViewFinder?: boolean;
    constraints?: MediaTrackConstraints;
  }

  const QrReader: React.FC<QrReaderProps>;

  export default QrReader;
}
