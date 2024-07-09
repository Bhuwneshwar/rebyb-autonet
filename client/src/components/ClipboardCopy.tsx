import React, { useState } from "react";
import useClipboard from "react-use-clipboard";

interface ClipboardCopyProps {
  code: string;
}

const ClipboardCopy: React.FC<ClipboardCopyProps> = ({ code }) => {
  const [isCopied, setCopied] = useClipboard(code);
  const [copyText, setCopyText] = useState<string>("Copy");

  const copy = () => {
    console.log(isCopied);

    setCopied();
    setCopyText("Copied!");

    // Reset copyText to "Copy" after 2 seconds
    setTimeout(() => setCopyText("Copy"), 2000);
  };

  return <div onClick={copy}>{copyText}</div>;
};

export default ClipboardCopy;
