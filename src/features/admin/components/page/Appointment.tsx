"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  CalendarCheck,
  CalendarX2,
} from "lucide-react";
import { Button } from "../ui/button";
import AppointmentHeader from "../layout/AppointmentHeader";
import AddAppointmentModal from "../modals/AddAppointmentModal";
import AppointmentSuccessModal from "../modals/AppointmentSuccessModal";

interface AppointmentData {
  id: string;
  patientName: string;
  specialty: string;
  date: string;
  time: string;
  status: "Medium" | "High" | "Low";
  email: string;
  phone: string;
  specialistType: string;
  notes: string;
}

export default function Appointment() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentData[]>([
    {
      id: "1",
      patientName: "Mr Chukwudi Okafor",
      specialty: "Cardiology",
      date: "2025-12-16",
      time: "09:00am",
      status: "High",
      email: "chukwudi.okafor@gmail.com",
      phone: "+2348134567890",
      specialistType: "Cardiology Consultation",
      notes: "Previous heart surgery patient, follow-up needed",
    },
    {
      id: "2",
      patientName: "Mrs. Ngozi Adebayo",
      specialty: "Physiotherapy",
      date: "2025-12-17",
      time: "10:30am",
      status: "Medium",
      email: "ngozi.adebayo@gmail.com",
      phone: "+2348098765432",
      specialistType: "Physiotherapy",
      notes: "Post-operative rehabilitation for knee injury",
    },
    {
      id: "3",
      patientName: "Mr Tunde Akinola",
      specialty: "Orthopedics",
      date: "2025-12-18",
      time: "11:00am",
      status: "Low",
      email: "tunde.akinola@yahoo.com",
      phone: "+2347065432109",
      specialistType: "Orthopedic Consultation",
      notes: "Routine check-up for previous fracture",
    },
    {
      id: "4",
      patientName: "Miss Amina Yusuf",
      specialty: "Pediatrics",
      date: "2025-12-19",
      time: "02:00pm",
      status: "High",
      email: "amina.yusuf@gmail.com",
      phone: "+2348123456789",
      specialistType: "Pediatric Consultation",
      notes: "Child vaccination and routine checkup",
    },
    {
      id: "5",
      patientName: "Mr Ibrahim Hassan",
      specialty: "Neurology",
      date: "2025-12-20",
      time: "09:30am",
      status: "Medium",
      email: "ibrahim.hassan@outlook.com",
      phone: "+2349087654321",
      specialistType: "Neurology Consultation",
      notes: "Migraine assessment and treatment plan",
    },
    {
      id: "6",
      patientName: "Mrs. Blessing Nwosu",
      specialty: "Obstetrics & Gynecology",
      date: "2025-12-21",
      time: "03:30pm",
      status: "Low",
      email: "blessing.nwosu@gmail.com",
      phone: "+2348056789012",
      specialistType: "Prenatal Checkup",
      notes: "Routine prenatal care, second trimester",
    },
    {
      id: "7",
      patientName: "Mr Emeka Eze",
      specialty: "Dermatology",
      date: "2025-12-22",
      time: "01:00pm",
      status: "Medium",
      email: "emeka.eze@gmail.com",
      phone: "+2347089012345",
      specialistType: "Dermatology Consultation",
      notes: "Skin condition evaluation and treatment",
    },
    {
      id: "8",
      patientName: "Dr. Funke Adeyemi",
      specialty: "Ophthalmology",
      date: "2025-12-23",
      time: "10:00am",
      status: "Low",
      email: "funke.adeyemi@gmail.com",
      phone: "+2348145678901",
      specialistType: "Eye Examination",
      notes: "Annual eye checkup and prescription update",
    },
  ]);

  interface AppointmentFormData {
    fullName: string;
    mobileNumber: string;
    emailAddress: string;
    reasonForAppointment: string;
    urgencyLevel: string;
    dateForAppointment: string;
    additionalNotes: string;
  }

  const handleNewAppointment = (appointmentData: AppointmentFormData) => {
    const newAppointment: AppointmentData = {
      id: String(appointments.length + 1),
      patientName: appointmentData.fullName,
      specialty: appointmentData.reasonForAppointment,
      date: appointmentData.dateForAppointment,
      time: "09:00am",
      status: appointmentData.urgencyLevel as "Medium" | "High" | "Low",
      email: appointmentData.emailAddress,
      phone: appointmentData.mobileNumber,
      specialistType: appointmentData.reasonForAppointment,
      notes: appointmentData.additionalNotes || "No additional notes",
    };
    setAppointments([...appointments, newAppointment]);
  };

  const handleAcceptAppointment = () => {
    setIsSuccessModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <AppointmentHeader onNewAppointment={() => setIsModalOpen(true)} />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Appointment List */}
        <div className="space-y-4 lg:col-span-2">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => setSelectedAppointment(appointment)}
              className={`cursor-pointer rounded-2xl border-2 bg-white p-4 transition-all hover:shadow-sm ${
                selectedAppointment?.id === appointment.id
                  ? "border-primary shadow-md"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Side - Profile and Info */}
                <div className="flex flex-1 items-start gap-3">
                  {/* Profile Image */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                    {getInitials(appointment.patientName)}
                  </div>

                  {/* Patient Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-0.5 text-base font-semibold text-slate-900">
                      {appointment.patientName}
                    </h3>
                    <p className="mb-3 text-sm text-slate-500">
                      {appointment.specialty}
                    </p>

                    {/* Date and Time Row */}
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-400" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Status Badge */}
                <div>
                  <span
                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${getStatusColor(
                      appointment.status,
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Appointment Details */}
        <div className="lg:col-span-1">
          <div className="border-primary sticky top-6 rounded-2xl border-2 bg-white p-6">
            {selectedAppointment ? (
              <>
                {/* Header */}
                <h2 className="mb-6 text-xl font-bold text-slate-900">
                  Appointment Details
                </h2>

                {/* Patient Info */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-base font-bold text-white">
                    {getInitials(selectedAppointment.patientName)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {selectedAppointment.patientName}
                    </h3>
                    <span
                      className={`mt-1 inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${getStatusColor(
                        selectedAppointment.status,
                      )}`}
                    >
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-6 space-y-3 border-b border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span>{selectedAppointment.email}</span>
                  </div>
                  <div className="mb-2 flex items-center gap-3 text-sm text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span>{selectedAppointment.phone}</span>
                  </div>
                </div>

                {/* Specialist Type */}
                <div className="mb-6">
                  <p className="mb-1 text-xs text-slate-500">Specialist Type</p>
                  <p className="font-semibold text-slate-900">
                    {selectedAppointment.specialistType}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="mb-6">
                  <p className="mb-1 text-xs text-slate-500">Date & Time</p>
                  <p className="font-semibold text-slate-900">
                    {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>

                {/* Notes */}
                <div className="mb-8 border-b border-gray-100">
                  <p className="mb-1 text-xs text-slate-500">Notes</p>
                  <p className="mb-2 text-sm text-slate-700">
                    {selectedAppointment.notes}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="default"
                    size="default"
                    className="w-full"
                    onClick={handleAcceptAppointment}
                  >
                    <CalendarCheck size={18} />
                    Accept Appointment
                  </Button>
                  <Button variant="outline" size="default" className="w-full">
                    <CalendarX2 size={18} />
                    Reschedule Appointment
                  </Button>
                  <button className="w-full rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                    Decline
                  </button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">
                  Select an appointment to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewAppointment}
      />

      <AppointmentSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        patientName={selectedAppointment?.patientName}
        bookingId={`REQ-${selectedAppointment?.id?.padStart(8, "0")}`}
      />
    </>
  );
}
