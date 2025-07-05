import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
  const [fileLinks, setFileLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLinks = async () => {
      const getSignedUrl = async (path: string | undefined) => {
        if (!path) return '';
        const { data, error } = await supabase
          .storage
          .from("registration-files")
          .createSignedUrl(path, 3600);
        return data?.signedUrl || '';
      };

      const [paymentProof, collegeId, aadharId, delegateExperience, delegationSheet] = await Promise.all([
        getSignedUrl(uploads.paymentProof),
        getSignedUrl(uploads.collegeId),
        getSignedUrl(uploads.aadharId),
        getSignedUrl(uploads.delegateExperience),
        getSignedUrl(uploads.delegationSheet),
      ]);

      setFileLinks({
        paymentProof,
        collegeId,
        aadharId,
        delegateExperience,
        delegationSheet,
      });
    };

    fetchLinks();
  }, [uploads]);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-2">
        <a
          href={fileLinks.paymentProof}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
        >
          Payment Proof
        </a>
        {uploads.collegeId && (
          <a
            href={fileLinks.collegeId}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
          >
            College ID
          </a>
        )}
        {uploads.aadharId && (
          <a
            href={fileLinks.aadharId}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
          >
            ID Proof
          </a>
        )}
        {uploads.delegateExperience && (
          <a
            href={fileLinks.delegateExperience}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
          >
            Delegate Experience
          </a>
        )}
        {uploads.delegationSheet && (
          <a
            href={fileLinks.delegationSheet}
            target="_blank"
            rel="noopener noreferrer"
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