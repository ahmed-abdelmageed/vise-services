
export interface TravellerData {
  fullName: string;
  saudiIdIqama: string;
}

export interface UploadedFile extends File {
  dataUrl?: string;
  preview?: string;
  isLocalPreview?: boolean;
}

export interface UploadedFiles {
  passports: Array<UploadedFile | null>;
  photos: Array<UploadedFile | null>;
}

export interface VisaFormData {
  nationality: string;
  mothersFullName: string;
  numberOfTravellers: number;
  email: string;
  password: string;
  confirmPassword: string;
  countryCode: string;
  phoneNumber: string;
  visaCity: string;
}

export interface StepProps {
  formData: VisaFormData;
  setFormData: React.Dispatch<React.SetStateAction<VisaFormData>>;
  travellers: TravellerData[];
  setTravellers?: React.Dispatch<React.SetStateAction<TravellerData[]>>;
  travelDate?: Date;
  setTravelDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  handleNextStep?: () => void;
  handlePrevStep: () => void;
  handleSubmit?: (e: React.FormEvent) => void;
  visaType?: 'gcc' | 'other' | null;
  selectedService: any;
  serviceType?: string;
  appointmentType: string;
  setAppointmentType?: React.Dispatch<React.SetStateAction<string>>;
  userLocation: string;
  setUserLocation?: React.Dispatch<React.SetStateAction<string>>;
  visaConfig?: any;
  basePrice: number;
  totalPrice: number;
  uploadedFiles?: UploadedFiles;
  setUploadedFiles?: React.Dispatch<React.SetStateAction<UploadedFiles>>;
  visaCity?: string;
  setVisaCity?: React.Dispatch<React.SetStateAction<string>>;
}

export interface ServiceFormProps {
  selectedService: any;
  onBack: () => void;
}
