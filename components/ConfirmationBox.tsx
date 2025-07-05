'use client';

import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white">
      <div className="bg-white text-gray-800 text-lg rounded-xl shadow-2xl p-6 w-[25rem] border">
        <p className="mb-5 text-base font-bold">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-white text-gray-700 font-semibold rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-900 text-white font-semibold rounded hover:cursor-pointer"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
