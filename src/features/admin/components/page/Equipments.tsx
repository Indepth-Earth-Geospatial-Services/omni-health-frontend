// "use client";

// import { useState } from "react";
// import {
//   ChevronUp,
//   ChevronDown,
//   Plus,
//   Activity,
//   HeartCrack,
//   Hospital,
//   AlertCircle,
//   Trash2,
//   Edit,
//   Building2,
// } from "lucide-react";
// // import Loader from "@/components/shared/Loader";
// import { Button } from "../ui/button";
// import EquipmentModal from "../feature/EquipmentModal";
// import InfrastructureModal from "../feature/InfrastructureModal";
// import EditEquipmentModal from "../feature/EditEquipmentModal";
// import EditInfrastructureModal from "../feature/EditInfrastructureModal";
// import DeleteConfirmationModal from "../feature/DeleteConfirmationModal";
// import { useFacilityInventory } from "@/hooks/useAdminStaff";
// import { useEquipmentHandlers } from "../util/useEquipmentHandlers";
// import { useInfrastructureHandlers } from "../util/useInfrastructureHandlers";

// interface EquipmentsPageProps {
//   facilityId: string;
// }

// export default function EquipmentsPage({ facilityId }: EquipmentsPageProps) {
//   const [isEquipmentOpen, setIsEquipmentOpen] = useState(true);
//   const [isFacilityOpen, setIsFacilityOpen] = useState(true);

//   // Check if facility ID is available
//   const hasFacilityId = Boolean(facilityId && facilityId.trim() !== "");

//   // Fetch inventory data (only if facilityId exists)
//   const {
//     data: inventoryData,
//     isLoading,
//     isError,
//     error,
//   } = useFacilityInventory(facilityId);

//   // Equipment handlers
//   const equipment = useEquipmentHandlers(facilityId);

//   // Infrastructure handlers
//   const infrastructure = useInfrastructureHandlers(facilityId);

//   // No facility ID state - show this first before any other states
//   if (!hasFacilityId) {
//     return (
//       <div className="flex h-96 w-full items-center justify-center">
//         <div className="flex max-w-md flex-col items-center gap-4 px-4 text-center">
//           <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
//             <Building2 className="h-10 w-10 text-amber-500" />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold text-slate-900">
//               No Facility Assigned
//             </h3>
//             <p className="mt-2 text-sm leading-relaxed text-slate-600">
//               Your account is not currently associated with any facility. Please
//               contact your administrator to get assigned to a facility before
//               you can manage equipment and infrastructure.
//             </p>
//           </div>
//           <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
//             <p className="text-xs text-amber-700">
//               Facility assignment is required to view and manage inventory
//               items.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex h-64 w-full items-center justify-center">
//         {/* <Loader size="lg" text="Loading inventory..." variant="default" /> */}
//       </div>
//     );
//   }

//   // Error state
//   if (isError) {
//     return (
//       <div className="flex h-64 w-full items-center justify-center">
//         <div className="flex flex-col items-center gap-3 text-center">
//           <AlertCircle className="h-12 w-12 text-red-500" />
//           <div>
//             <h3 className="text-lg font-semibold text-slate-900">
//               Failed to load inventory
//             </h3>
//             <p className="mt-1 text-sm text-slate-600">
//               {error?.message ||
//                 "An error occurred while fetching inventory data"}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Convert inventory object to array for rendering
//   const equipmentItems = Object.entries(
//     inventoryData?.inventory?.equipment || {},
//   ).map(([name, quantity]) => ({
//     name: name,
//     displayName: name
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase()),
//     quantity: quantity.toString(),
//   }));

//   const infrastructureItems = Object.entries(
//     inventoryData?.inventory?.infrastructure || {},
//   ).map(([name, quantity]) => ({
//     name: name,
//     displayName: name
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase()),
//     quantity: quantity.toString(),
//   }));

//   return (
//     <>
//       {/* Add Equipment Modal */}
//       <EquipmentModal
//         isOpen={equipment.isEquipmentModalOpen}
//         onClose={equipment.closeEquipmentModal}
//         onSubmit={equipment.handleAddEquipment}
//         isSubmitting={equipment.isAdding}
//       />

//       {/* Add Infrastructure Modal */}
//       <InfrastructureModal
//         isOpen={infrastructure.isInfrastructureModalOpen}
//         onClose={infrastructure.closeInfrastructureModal}
//         onSubmit={infrastructure.handleAddInfrastructure}
//         isSubmitting={infrastructure.isAdding}
//       />

//       {/* Edit Equipment Modal */}
//       <EditEquipmentModal
//         isOpen={equipment.isEditEquipmentModalOpen}
//         onClose={equipment.closeEditModal}
//         onSubmit={equipment.handleUpdateEquipment}
//         isSubmitting={equipment.isUpdating}
//         initialData={equipment.selectedEquipment}
//       />

//       {/* Edit Infrastructure Modal */}
//       <EditInfrastructureModal
//         isOpen={infrastructure.isEditInfrastructureModalOpen}
//         onClose={infrastructure.closeEditModal}
//         onSubmit={infrastructure.handleUpdateInfrastructure}
//         isSubmitting={infrastructure.isUpdating}
//         initialData={infrastructure.selectedInfrastructure}
//       />

//       {/* Delete Equipment Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={equipment.isDeleteModalOpen}
//         onClose={equipment.closeDeleteModal}
//         onConfirm={equipment.handleConfirmDelete}
//         isDeleting={equipment.isDeleting}
//         itemName={equipment.itemToDelete?.displayName || ""}
//         itemType="equipment"
//       />

//       {/* Delete Infrastructure Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={infrastructure.isDeleteModalOpen}
//         onClose={infrastructure.closeDeleteModal}
//         onConfirm={infrastructure.handleConfirmDelete}
//         isDeleting={infrastructure.isDeleting}
//         itemName={infrastructure.itemToDelete?.displayName || ""}
//         itemType="infrastructure"
//       />

//       <div className="w-full">
//         <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
//           {/* Medical Equipment */}
//           <div className="flex max-h-125 flex-col rounded-2xl border-2 border-slate-200 bg-white">
//             {/* Header */}
//             <div className="flex w-full shrink-0 items-center justify-between px-4 py-4 transition-colors hover:bg-slate-50">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
//                   <Activity size={20} className="text-slate-600" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="text-2xl font-medium text-slate-700">
//                     Medical Equipment
//                   </h3>
//                   <p className="mt-0.5 text-sm text-slate-500">
//                     {equipmentItems.length} items
//                   </p>
//                 </div>
//               </div>

//               <div className="flex flex-row items-center gap-4">
//                 <Button
//                   onClick={() => equipment.setIsEquipmentModalOpen(true)}
//                   className="h-10 px-4 text-sm lg:h-14 lg:px-8 lg:text-lg"
//                   disabled={equipment.isAdding}
//                 >
//                   <Plus size={18} className="text-white" />
//                   New Equipment
//                 </Button>
//                 <button onClick={() => setIsEquipmentOpen(!isEquipmentOpen)}>
//                   {isEquipmentOpen ? (
//                     <ChevronUp size={20} className="text-slate-400" />
//                   ) : (
//                     <ChevronDown size={20} className="text-slate-400" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Equipment Content */}
//             {isEquipmentOpen && (
//               <div className="flex-1 space-y-3 overflow-y-auto px-4 pt-2 pb-4">
//                 {equipmentItems.length === 0 ? (
//                   <div className="py-8 text-center text-slate-500">
//                     <p>No equipment found. Add your first equipment item.</p>
//                   </div>
//                 ) : (
//                   equipmentItems.map((item) => (
//                     <div
//                       key={item.name}
//                       className="group hover:border-primary relative flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 transition-all duration-200 hover:shadow-md"
//                     >
//                       <div className="flex flex-1 items-center">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
//                           <HeartCrack size={18} className="text-slate-600" />
//                         </div>
//                         <div className="flex-1 px-4">
//                           <p className="text-sm font-medium text-slate-900">
//                             {item.displayName}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <p className="text-lg font-medium text-slate-600">
//                           {item.quantity}
//                         </p>

//                         {/* Action Buttons - Show on hover */}
//                         <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
//                           <button
//                             onClick={() => equipment.handleEditEquipment(item)}
//                             className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
//                             title="Edit equipment"
//                           >
//                             <Edit size={18} />
//                           </button>
//                           <button
//                             onClick={() => equipment.handleDeleteClick(item)}
//                             className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
//                             title="Delete equipment"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Facility Infrastructure */}
//           <div className="flex max-h-125 flex-col rounded-2xl border-2 border-slate-200 bg-white">
//             {/* Header */}
//             <div className="flex w-full shrink-0 items-center justify-between px-4 py-4 transition-colors hover:bg-slate-50">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100">
//                   <Activity size={20} className="text-slate-600" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="text-2xl font-medium text-slate-700">
//                     Facility Infrastructure
//                   </h3>
//                   <p className="mt-0.5 text-sm text-slate-500">
//                     {infrastructureItems.length} items
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-row items-center gap-4">
//                 <Button
//                   onClick={() =>
//                     infrastructure.setIsInfrastructureModalOpen(true)
//                   }
//                   className="h-10 px-4 text-sm lg:h-14 lg:px-8 lg:text-lg"
//                   disabled={infrastructure.isAdding}
//                 >
//                   <Plus size={18} className="text-white" />
//                   New Infrastructure
//                 </Button>

//                 <button onClick={() => setIsFacilityOpen(!isFacilityOpen)}>
//                   {isFacilityOpen ? (
//                     <ChevronUp size={20} className="text-slate-400" />
//                   ) : (
//                     <ChevronDown size={20} className="text-slate-400" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Infrastructure Content */}
//             {isFacilityOpen && (
//               <div className="flex-1 space-y-3 overflow-y-auto px-4 pt-2 pb-4">
//                 {infrastructureItems.length === 0 ? (
//                   <div className="py-8 text-center text-slate-500">
//                     <p>
//                       No infrastructure found. Add your first infrastructure
//                       item.
//                     </p>
//                   </div>
//                 ) : (
//                   infrastructureItems.map((item) => (
//                     <div
//                       key={item.name}
//                       className="group hover:border-primary relative flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 transition-all duration-200 hover:shadow-md"
//                     >
//                       <div className="flex flex-1 items-center">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
//                           <Hospital size={18} className="text-slate-600" />
//                         </div>
//                         <div className="flex-1 px-4">
//                           <p className="text-sm font-medium text-slate-900">
//                             {item.displayName}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-3">
//                         <p className="text-lg font-medium text-slate-600">
//                           {item.quantity}
//                         </p>

//                         {/* Action Buttons - Show on hover */}
//                         <div className="flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
//                           <button
//                             onClick={() =>
//                               infrastructure.handleEditInfrastructure(item)
//                             }
//                             className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
//                             title="Edit infrastructure"
//                           >
//                             <Edit size={18} />
//                           </button>
//                           <button
//                             onClick={() =>
//                               infrastructure.handleDeleteClick(item)
//                             }
//                             className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
//                             title="Delete infrastructure"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
