"use client";

import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface DeleteStaffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    staffName: string;
    isDeleting?: boolean;
}

const DeleteStaffModal: React.FC<DeleteStaffModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    staffName,
    isDeleting = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-red-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <AlertTriangle size={22} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
                            <p className="text-sm text-red-100 mt-0.5">This action cannot be undone</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-sm text-slate-700">
                            Are you sure you want to delete{' '}
                            <p className="font-semibold text-red-600">{staffName} ?</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            All associated records and data will be permanently removed from the system.
                        </p>
                    </div>

                    {/* Staff Info Card */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {staffName
                                        ?.split(' ')
                                        .map(n => n[0])
                                        .join('')
                                        .substring(0, 2)
                                        .toUpperCase() || '?'}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{staffName}</p>
                                <p className="text-xs text-slate-500">Staff Member</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 border-slate-300 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={16} />
                                    Delete Staff
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteStaffModal;