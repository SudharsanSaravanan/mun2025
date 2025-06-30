import React from 'react';

interface FileDownloadButtonsProps {
  uploads: {
    paymentProof: string;
    collegeId?: string;
    aadharId?: string;
    delegateExperience?: string;
    delegationSheet?: string;
  };
}

const FileDownloadButtons: React.FC<FileDownloadButtonsProps> = ({ uploads }) => {
  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-2">
        <a
          href={uploads.paymentProof}
          download
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
        >
          Payment Proof
        </a>
        {uploads.collegeId && (
          <a
            href={uploads.collegeId}
            download
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
          >
            College ID
          </a>
        )}
        {uploads.aadharId && (
          <a
            href={uploads.aadharId}
            download
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
          >
            ID Proof
          </a>
        )}
        {uploads.delegateExperience && (
          <a
            href={uploads.delegateExperience}
            download
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
          >
            Experience Doc
          </a>
        )}
        {uploads.delegationSheet && (
          <a
            href={uploads.delegationSheet}
            download
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
          >
            Delegation Sheet
          </a>
        )}
      </div>
    </div>
  );
};

export default FileDownloadButtons;