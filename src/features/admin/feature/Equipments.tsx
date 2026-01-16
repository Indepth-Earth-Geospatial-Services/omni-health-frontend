"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Plus, Activity, HeartCrack, LucideIcon, Hospital, } from "lucide-react";
import { Button } from '../components/ui/button';
import EquipmentModal from "./EquipmentModal";
import InfrastructureModal from "./InfrastructureModal";


export default function EquipmentsPage() {
    const [isEquipment, setIsEquipmentOpen] = useState(true);
    const [isFacility, setIsFacility] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfrastructure, setIsInfrastructure] = useState(false)

    const [equipments, setEquipments] = useState<EquipmentProps[]>([
        { item: "X-Ray Machine", category: "Imaging", quantity: "3", icon: HeartCrack },
        { item: "CT Scanner", category: "Imaging", quantity: "3", icon: HeartCrack },
        { item: "Ventilator", category: "Life Support", quantity: "3", icon: HeartCrack },
        { item: "Oxygen Concentrator", category: "Life Support", quantity: "3", icon: HeartCrack },
        { item: "Patient Monitoring", category: "Monitoring", quantity: "3", icon: HeartCrack },
        { item: "Ultrasound Scanner", category: "Imaging", quantity: "3", icon: HeartCrack }
    ]);

    const [facilities, setFacilities] = useState<EquipmentProps[]>([
        { item: "Operating Theatres", quantity: "3", icon: Hospital },
        { item: "Emergency Bays", quantity: "3", icon: Hospital },
        { item: "Consultation Rooms", quantity: "3", icon: Hospital },
        { item: "ICU Beds", quantity: "3", icon: Hospital },
        { item: "Dispensary", quantity: "3", icon: Hospital },
        { item: "Laboratory", quantity: "3", icon: Hospital },
        { item: "Ambulance", quantity: "3", icon: Hospital }
    ])


    interface EquipmentProps {
        item: string;
        category?: string; // the category is optional to aid Facility infrastructure
        quantity: string;
        icon: LucideIcon;
    }

    interface InfraData {
        name: string;
        quantity: string;
    }

    // Function to handle new equipment submission
    const handleAddEquipment = (data: { name: string; category: string; quantity: string }) => {
        const newEquipment: EquipmentProps = {
            item: data.name,
            category: data.category,
            quantity: data.quantity,
            icon: HeartCrack // Default icon for all equipment
        };
        setEquipments(prev => [...prev, newEquipment]);
    };

    // Function to handle new infrastructure submission
    const handleAddInfrastructure = (data: InfraData) => {
        setFacilities(prev => [
            ...prev,
            {
                item: data.name,
                quantity: data.quantity,
                icon: Hospital
            }
        ]);
    };

    return (
        <>
            {/* Equipment Modal */}
            <EquipmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddEquipment}
            />

            {/* infrastructure Modal */}
            <InfrastructureModal
                isOpen={isInfrastructure}
                onClose={() => setIsInfrastructure(false)}
                onSubmit={handleAddInfrastructure}
            />

            <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* Medical Eqipments */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden h-fit">
                        {/* header */}
                        <div className="w-full px-4 py-4 flex items-center justify-between hover:bg:-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Activity size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-medium text-slate-700">Medical Equipments</h3>
                                </div>
                            </div>

                            <div className="flex items-center flex-row gap-4">
                                <Button size="xl" onClick={() => setIsModalOpen(true)} className="text-lg">
                                    <Plus size={18} className="text-white" />
                                    New Equipment
                                </Button>
                                <button
                                    onClick={() => setIsEquipmentOpen(!isEquipment)}
                                >
                                    {isEquipment ? (
                                        <ChevronUp size={20} className="text-slate-400" />
                                    ) : (
                                        <ChevronDown size={20} className="text-slate-400" />
                                    )}

                                </button>
                            </div>
                        </div>

                        {/*Medical Equipments Card Content */}
                        {isEquipment && (
                            <div className="px-4 pb-4 pt-2 space-y-4">

                                {/* Medical Equipment Items */}
                                {equipments.map(({ item, category, quantity, icon: Icon }) => (
                                    <div key={item} className="flex items-center justify-between py-4 px-4 bg-white rounded-2xl border-2 border-slate-200">
                                        <div className="flex items-center ">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <Icon size={18} className="text-slate-600" />
                                            </div>
                                            <div className="px-4">
                                                <p className="text-sm font-medium text-slate-900">{item}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{category}</p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-medium text-slate-600">{quantity}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Facility Infrastructure */}
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden h-fit">
                        {/* header */}
                        <div className="w-full px-4 py-4 flex items-center justify-between hover:bg:-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Activity size={20} className="text-slate-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-medium text-slate-700">Facility Infrastructure</h3>
                                </div>
                            </div>
                            <div className="flex items-center flex-row gap-4">
                                <Button size="xl" onClick={() => setIsInfrastructure(true)} className="text-lg">
                                    <Plus size={18} className="text-white" />
                                    New Infrastructure
                                </Button>

                                <button
                                    onClick={() => setIsFacility(!isFacility)}
                                >
                                    {isFacility ? (
                                        <ChevronUp size={20} className="text-slate-400" />
                                    ) : (
                                        <ChevronDown size={20} className="text-slate-400" />
                                    )}

                                </button>
                            </div>
                        </div>

                        {/*Facility Infrastructure Card Content */}
                        {isFacility && (
                            <div className="px-4 pb-4 pt-2 space-y-4">
                                {/* Facility Infrastructure Items */}

                                {facilities.map(({ item, category, quantity, icon: Icon }) => (
                                    <div key={item} className="flex items-center justify-between py-4 px-4 bg-white rounded-2xl border-2 border-slate-200">
                                        <div className="flex items-center ">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <Icon size={18} className="text-slate-600" />
                                            </div>
                                            <div className="px-4">
                                                <p className="text-sm font-medium text-slate-900">{item}</p>
                                                {category && (<p className="text-xs text-slate-500 mt-0.5">{category}</p>)}

                                            </div>
                                        </div>
                                        <p className="text-lg font-medium text-slate-600">{quantity}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}