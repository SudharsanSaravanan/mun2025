import React from 'react';

interface FileDownloadButtonsProps {
  uploads: { paymentProof: string };
}

const FileDownloadButtons: React.FC<FileDownloadButtonsProps> = ({ uploads }) => {
  return (
    <div className="mt-2">
      <a
        href={uploads.paymentProof}
        download
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Payment Proof
      </a>
    </div>
  );
};

export default FileDownloadButtons;