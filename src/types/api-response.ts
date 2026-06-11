export interface Equipment {
  bed_pan?: number;
  screens?: number;
  camp_gas?: number;
  gallipot?: number;
  autoclave?: number;
  baby_cots?: number;
  fetoscope?: number;
  ice_packs?: number;
  waste_bin?: number;
  cold_boxes?: number;
  drip_stand?: number;
  water_bath?: number;
  forceps_jar?: number;
  stadiometer?: number;
  delivery_bed?: number;
  swivel_stool?: number;
  tape_measure?: number;
  dressing_tray?: number;
  dry_heat_oven?: number;
  mayo_scissors?: number;
  sims_speculum?: number;
  uterine_sound?: number;
  diagnostic_set?: number;
  kerosene_stove?: number;
  pulse_oximeter?: number;
  test_tube_rack?: number;
  cuscos_speculum?: number;
  kochers_forceps?: number;
  cord_clamps_pack?: number;
  delivery_forceps?: number;
  malaria_rdt_kits?: number;
  sphygmomanometer?: number;
  table_top_cooker?: number;
  vacuum_extractor?: number;
  dressing_scissors?: number;
  fire_extinguisher?: number;
  kidney_dish_large?: number;
  parograph_booklet?: number;
  anti_shock_garment?: number;
  dissecting_forceps?: number;
  baby_weighing_scale?: number;
  episiotomy_scissors?: number;
  stethoscope_littman?: number;
  adult_weighing_scale?: number;
  binocular_microscope?: number;
  centrifuge_with_tube?: number;
  injection_safety_box?: number;
  newborn_bag_and_mask?: number;
  rush_vaccine_carrier?: number;
  artery_forceps_medium?: number;
  bed_sheets_and_pillows?: number;
  microscope_cover_slide?: number;
  needle_holding_forceps?: number;
  sponge_holding_forceps?: number;
  stool_specimen_bottles?: number;
  manual_vacuum_aspirator?: number;
  refrigerator_medium_60l?: number;
  fetal_doppler_ultrasound?: number;
  geostyle_vaccine_carrier?: number;
  veronica_bucket_with_tap?: number;
  length_measure_for_babies?: number;
  stainless_instrument_tray?: number;
  trolley_patient_stretcher?: number;
  aluminium_pot_and_utensils?: number;
  haematocrit_reader_for_pcv?: number;
  portable_incubator_for_lab?: number;
  sterilizing_drums_set_of_3?: number;
  sunction_machine_apparatus?: number;
  clinical_thermometer_rectal?: number;
  inpatient_beds_with_mattress?: number;
  medicine_cabinet_and_shelves?: number;
  light_source_angle_poised_lamp?: number;
  refrigerator_100_120l_capacity?: number;
  bowls_stainless_steel_with_stand?: number;
  clinical_thermometer_rectal_oral?: number;
  kidney_dish_large_stainless_steel?: number;
  insertion_and_removal_kits_for_iud?: number;
  small_size_cooking_cylinder_12_5kg?: number;
  solar_direct_drive_sdd_refrigerator?: number;
  mid_upper_arm_circumference_tape_muac?: number;
  stainless_covered_bowl_for_cotton_wool?: number;
  insertion_and_removal_kits_for_implants?: number;
  ventilated_improved_pit_latrine_structure_outside?: number;
  work_surface_for_resuscitation_of_newborn_paediatric_resuscitation_bed_with_radiant_warmer?: number;

  [key: string]: number | undefined;
}

export interface Inventory {
  equipment: Equipment;
  infrastructure: Record<string, number>;
}

export interface WorkingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  // Accommodating the typo in  API response
  wedsnesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  emergency?: string;
  [key: string]: string | undefined;
}

export interface Facility {
  facility_id: string;
  hfr_id: string;
  facility_name: string;
  facility_category: string;
  facility_lga: string;
  town: string;
  address: string;
  lat: number;
  lon: number;
  avg_daily_patients: number;
  doctor_patient_ratio: number;

  inventory: Inventory;
  services_list: string[];
  specialists: string[];
  image_urls: string[];
  working_hours: WorkingHours;

  contact_info: {
    email: string;
    phone: string;
  };

  average_rating: number;
  total_reviews: number;
  last_updated: string;

  road_distance_meters?: number;
  travel_time_minutes?: number;
  route_geometry?: {
    coordinates?: Array<Record<string, string>>;
  };
}

export interface FacilityArray {
  facilities: Array<Facility>;
  message: string;
  pagination: {
    total_records: number;
    current_page: number;
    total_pages: number;
    limit: number;
  };
}
export interface OneFacility {
  message: string;
  facility: Facility;
}
export type GetLGAFacilities = FacilityArray;
export type SearchFacilities = FacilityArray;
export type GetAllFacilities = FacilityArray;
export type GetFacility = OneFacility;
export type GetNearestFacility = OneFacility;
