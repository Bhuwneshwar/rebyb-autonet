// src/QRCodeScanner.tsx
import { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";

interface IQRCodeScanner {
  scannedDataUpdater: (data: string) => void;
  title?: string;
  style?: React.CSSProperties;
}

const QRCodeScanner: React.FC<IQRCodeScanner> = ({
  scannedDataUpdater,
  style,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  useEffect(() => {
    let qrScanner: QrScanner | null = null;
    let timer: NodeJS.Timeout | null = null;

    if (isScanning && videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        (result) => setScannedData(result.data),
        {
          onDecodeError: (error) => {
            console.error(error);
          },
        }
      );

      qrScanner.start();

      timer = setTimeout(() => {
        qrScanner?.stop();
        setIsScanning(false);
      }, 120000); // 2 minutes
    }

    return () => {
      qrScanner?.stop();
      if (timer) clearTimeout(timer);
    };
  }, [isScanning]);

  useEffect(() => {
    if (scannedData) {
      scannedDataUpdater(scannedData);
    }
  }, [scannedData, scannedDataUpdater]);

  const handleRetry = () => {
    // setScannedData("No result");
    setIsScanning(true);
  };

  return (
    <div
      style={{ maxWidth: style?.maxWidth, textAlign: "center" }}
      className="qr-code-scanner"
    >
      <h3 style={{ textAlign: "center" }}>
        {title ? title : "QR Code Scanner"}
      </h3>
      <video
        autoPlay
        ref={videoRef}
        style={style ? style : { width: "100%" }}
      />
      <p>{scannedData}</p>
      {!isScanning && <button onClick={handleRetry}>Retry</button>}
    </div>
  );
};

export default QRCodeScanner;

// import React, { useState } from "react";
// import QrReader from "react-qr-scanner";

// interface IQRCodeScanner {
//   scannedDataUpdater: (data: string) => void;
//   title?: string;
//   style?: React.CSSProperties;
// }

// const QRCodeScanner: React.FC<IQRCodeScanner> = ({
//   scannedDataUpdater,
//   title = "QR Code Scanner",
//   style = { width: "100%" },
// }) => {
//   const [scannedData, setScannedData] = useState<string | null>(null);
//   const [isScanning, setIsScanning] = useState<boolean>(true);

//   const handleScan = (data: string | null) => {
//     if (data) {
//       setScannedData(data);
//       scannedDataUpdater(data);
//       setIsScanning(false);
//     }
//   };

//   const handleError = (error: any) => {
//     console.error(error);
//     setIsScanning(false);
//   };

//   const handleRetry = () => {
//     setScannedData(null);
//     setIsScanning(true);
//   };

//   const previewStyle = {
//     height: 240,
//     width: 320,
//     ...style,
//   };

//   return (
//     <div
//       style={{ maxWidth: style?.maxWidth, textAlign: "center" }}
//       className="qr-code-scanner"
//     >
//       <h6 style={{ textAlign: "center" }}>{title}</h6>
//       {isScanning ? (
//         <QrReader
//           delay={300}
//           style={previewStyle}
//           onError={handleError}
//           onScan={handleScan}
//         />
//       ) : (
//         <div>
//           <p>{scannedData}</p>
//           <button onClick={handleRetry}>Retry</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRCodeScanner;
