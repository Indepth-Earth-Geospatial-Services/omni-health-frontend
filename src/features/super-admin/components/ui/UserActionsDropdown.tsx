"use client";

import {
  Eye,
  ShieldOff,
  ShieldCheck,
  ArrowLeftRight,
  MoreVertical,
  MapPin,
  MapPinOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "../../services/super-admin.service";

interface UserActionsDropdownProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onViewProfile: () => void;
  onSuspend: () => void;
  onUnsuspend: () => void;
  onChangeRole: () => void;
  onDeactivate: () => void;
  onAssignLga: () => void;
  onUnassignLga: () => void;
}

export function UserActionsDropdown({
  user,
  isOpen,
  onOpenChange,
  onViewProfile,
  onSuspend,
  onUnsuspend,
  onChangeRole,
  onAssignLga,
  onUnassignLga,
}: UserActionsDropdownProps) {
  return (
    // Radix portals DropdownMenuContent to document.body, so it always
    // renders in full instead of being clipped by the table's
    // overflow-x-auto scroll wrapper (previously required scrolling the
    // table sideways just to see the rest of the menu).
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="hover:text-primary rounded-lg p-2 text-slate-400 transition-all hover:bg-teal-50"
        >
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={onViewProfile}
          className="cursor-pointer text-slate-700"
        >
          <Eye size={16} className="text-slate-400" />
          View Profile
        </DropdownMenuItem>

        {!user.is_active ? (
          <DropdownMenuItem
            onClick={onUnsuspend}
            className="cursor-pointer text-green-700 focus:bg-green-50 focus:text-green-700"
          >
            <ShieldCheck size={16} className="text-green-500" />
            Unsuspend Account
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={onSuspend}
            className="cursor-pointer text-amber-700 focus:bg-amber-50 focus:text-amber-700"
          >
            <ShieldOff size={16} className="text-amber-500" />
            Suspend Account
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={onAssignLga}
          className="cursor-pointer text-teal-700 focus:bg-teal-50 focus:text-teal-700"
        >
          <MapPin size={16} className="text-teal-500" />
          Assign LGA
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onUnassignLga}
          variant="destructive"
          className="cursor-pointer"
        >
          <MapPinOff size={16} />
          Unassign LGA
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onChangeRole}
          className="cursor-pointer text-slate-700"
        >
          <ArrowLeftRight size={16} className="text-slate-400" />
          Change Role
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
