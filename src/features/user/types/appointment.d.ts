import {
  AppointmentStep1Data,
  AppointmentStep2Data,
  AppointmentStep3Data,
  AppointmentStep4Data,
} from "../schemas/appointment.schema";

export interface AppointmentData {
  step1?: AppointmentStep1Data;
  step2?: AppointmentStep2Data;
  step3?: AppointmentStep3Data;
  step4?: AppointmentStep4Data;
}

export type AppointmentStepData = AppointmentData[keyof AppointmentData];
