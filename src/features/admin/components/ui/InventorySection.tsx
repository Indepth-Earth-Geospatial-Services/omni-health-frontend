"use client";

import React from "react";
import {
  ChevronUp,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  LucideIcon,
} from "lucide-react";
import { Button } from "./button";
import type { InventoryItem } from "@/features/admin/hooks/use-equipment-actions";

interface InventorySectionProps {
  title: string;
  items: InventoryItem[];
  isOpen: boolean;
  onToggle: () => void;
  onAdd: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  isAdding: boolean;
  addButtonLabel: string;
  icon: LucideIcon;
  itemIcon: LucideIcon;
  emptyMessage: string;
}

export function InventorySection({
  title,
  items,
  isOpen,
  onToggle,
  onAdd,
  onEdit,
  onDelete,
  isAdding,
  addButtonLabel,
  icon: Icon,
  itemIcon: ItemIcon,
  emptyMessage,
}: InventorySectionProps) {
  return (
    <div className="flex max-h-190 flex-col rounded-2xl border-2 border-slate-200 bg-white">
      {/* Header */}
      <div className="flex w-full shrink-0 items-center justify-between px-4 py-4 transition-colors hover:bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
            <Icon size={20} className="text-slate-600" />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-medium text-slate-700">{title}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{items.length} items</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          <Button
            size="xl"
            onClick={onAdd}
            className="text-lg"
            disabled={isAdding}
          >
            <Plus size={18} className="text-white" />
            {addButtonLabel}
          </Button>
          <button onClick={onToggle}>
            {isOpen ? (
              <ChevronUp size={20} className="text-slate-400" />
            ) : (
              <ChevronDown size={20} className="text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="flex-1 space-y-3 overflow-y-auto px-4 pt-2 pb-4">
          {items.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p>{emptyMessage}</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.name}
                className="group hover:border-primary relative flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-1 items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <ItemIcon size={18} className="text-slate-600" />
                  </div>
                  <div className="flex-1 px-4">
                    <p className="text-sm font-medium text-slate-900">
                      {item.displayName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-lg font-medium text-slate-600">
                    {item.quantity}
                  </p>

                  {/* Action Buttons - Show on hover */}
                  <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                      title={`Edit ${title.toLowerCase()}`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                      title={`Delete ${title.toLowerCase()}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
