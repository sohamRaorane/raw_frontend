import React from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {children}
                </div>

            </div>
        </div>,
        document.body
    );
}
