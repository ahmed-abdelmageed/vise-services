export interface Service {
  title: string;
  description: string;
  flag: string;
  time: string;
  // Add the missing properties from VisaConfig for compatibility
  basePrice?: number;
  formTitle?: string;
  formDescription?: string;
  requiresMothersName?: boolean;
  id?: string;
  active?: boolean;
  displayOrder?: number;
  // Arabic translations
  title_ar?: string;
  description_ar?: string;
  time_ar?: string;
  // Add missing translation fields that are causing TypeScript errors
  formDescription_ar?: string;
  formTitle_ar?: string;
  processingTime?: string;
  processingTime_ar?: string;
  requiresNationalitySelection?: boolean;
  requiresServiceSelection?: boolean;
  requiresAppointmentTypeSelection?: boolean;
  requiresLocationSelection?: boolean;
  requiresVisaCitySelection?: boolean;
  requiresSaudiIdIqama?: boolean;
  idFilesRequired?: boolean;
  salaryProofRequired?: boolean;
  photoFilesRequired?: boolean;
  passportFilesRequired?: boolean;
  requiresnationalityselection?: boolean;
  requiresserviceselection?: boolean;
  requiresappointmenttypeselection?: boolean;
  requireslocationselection?: boolean;
  requiresvisacityselection?: boolean;
  requiressaudiidiqama?: boolean;
  id_files_required?: boolean;
  salary_proof_required?: boolean;
  photo_files_required?: boolean;
  passport_files_required?: boolean;
}

export interface VisaServiceDetails {
  title: string;
  basePrice: number;
  description: string;
  subDescription?: string;
}

export interface VisaConfig {
  id?: string;
  title: string;
  basePrice: number;
  formTitle: string;
  formDescription: string;
  requiresMothersName: boolean;
  requiresNationalitySelection?: boolean;
  requiresServiceSelection?: boolean;
  requiresAppointmentTypeSelection?: boolean;
  requiresLocationSelection?: boolean;
  requiresVisaCitySelection?: boolean;
  requiresSaudiIdIqama?: boolean;
  idFilesRequired?: boolean;
  salaryProofRequired?: boolean;
  photoFilesRequired?: boolean;
  passportFilesRequired?: boolean;
  usaVisaCities?: string[] | any; // Explicitly accept any type to handle JSON from database
  flag?: string;
  processingTime?: string;
  active?: boolean;
  displayOrder?: number;
  services?: Record<string, VisaServiceDetails>;
  // Arabic translations
  title_ar?: string;
  formTitle_ar?: string;
  formDescription_ar?: string;
  processingTime_ar?: string;
  // Add the missing properties from Service for compatibility
  description?: string;
  time?: string;
  description_ar?: string;
  time_ar?: string;
}

// Adding types used by the visa/ components
export interface TravellerData {
  fullName: string;
  saudiIdIqama?: string;
}

export interface UploadedFiles {
  passports: File[];
  photos: File[];
}

export type VisaType = "gcc" | "other" | null;
