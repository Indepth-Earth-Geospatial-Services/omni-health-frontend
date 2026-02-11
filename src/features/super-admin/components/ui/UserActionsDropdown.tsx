"use client";

import React from "react";
import { Eye, Trash2, ArrowLeftRight, Ban, Pen } from "lucide-react";
import type { User } from "../../services/super-admin.service";

interface UserActionsDropdownProps {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onViewProfile: () => void;
  onSuspend: () => void;
  onUnsuspend: () => void;
  onChangeRole: () => void;
  onDeactivate: () => void;
}

export function UserActionsDropdown({
  user,
  isOpen,
  onToggle,
  onViewProfile,
  onSuspend,
  onUnsuspend,
  onChangeRole,
  onDeactivate,
}: UserActionsDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="hover:text-primary rounded-lg p-2 text-slate-400 transition-all hover:bg-teal-50"
      >
        <Pen size={18} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 z-50 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Eye size={16} className="text-slate-400" />
            View Profile
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSuspend();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Trash2 size={16} className="text-amber-400" />
            Suspend Account
          </button>

          {user.is_suspended && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUnsuspend();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Trash2 size={16} className="text-green-500" />
              Unsuspend Account
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onChangeRole();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeftRight size={16} className="text-slate-400" />
            Change Role
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeactivate();
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Ban size={16} className="text-slate-400" />
            Deactivate
          </button>
        </div>
      )}
    </div>
  );
}
