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
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-white text-blue-800  text-lg rounded-xl shadow-2xl p-6 w-[25rem] border border-blue-800">
        <p className="mb-5 text-base font-bold">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-white text-blue-700 font-semibold rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-900"
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
