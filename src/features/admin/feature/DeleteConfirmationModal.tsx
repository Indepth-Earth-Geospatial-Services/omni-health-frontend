"use client";

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { Button } from "../components/ui/button";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    itemName: string;
    itemType: "equipment" | "infrastructure";
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isDeleting,
    itemName,
    itemType,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={!isDeleting ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle size={20} className="text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Confirm Delete
                            </h2>
                        </div>
                        {!isDeleting && (
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-slate-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-slate-700 mb-2">
                        Are you sure you want to delete this {itemType}?
                    </p>
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="font-semibold text-slate-900">{itemName}</p>
                    </div>
                    <p className="text-sm text-red-600 mt-4">
                        ⚠️ This action cannot be undone.
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        size="lg"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>Delete {itemType}</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;