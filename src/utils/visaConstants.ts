// Re-export constants from visa-form/constants to maintain compatibility with visa/ components
export { 
  NATIONALITIES,
  EXCLUDED_NATIONALITIES,
  OTHER_NATIONALITIES,
  GCC_NATIONALITIES,
  COUNTRY_CODES,
  SPAIN_APPOINTMENT_TYPES,
  SPAIN_LOCATIONS,
  VISA_CONFIGS,
  DEFAULT_VISA_CONFIG
} from "@/components/visa-form/constants";

// For backward compatibility, keep the original VISA_LOCATIONS definition
export const VISA_LOCATIONS = [
  {
    id: "riyadh",
    name: "Riyadh"
  },
  {
    id: "khobar",
    name: "Al Khobar"
  },
  {
    id: "jeddah",
    name: "Jeddah"
  }
];
