
export const VISA_CONFIGS = {
  "British Visa": {
    basePrice: 550,
    formTitle: "British Visa for GCC Nationals",
    formDescription: "Provide your information to apply for a British Visa",
    requiresMothersName: true,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "USA Visa": {
    basePrice: 950, // Updated to 950 SAR as requested
    formTitle: "USA Visa Application",
    formDescription: "Provide your information to apply for a USA Visa",
    requiresMothersName: true,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: true,
    requiresSaudiIdIqama: true,
    usaVisaCities: ["Riyadh", "Jeddah", "Dhahran"]
  },
  "Spain Visa": {
    basePrice: 330,
    formTitle: "Spain Visa Application",
    formDescription: "Provide your information to apply for a Spain Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: true,
    requiresLocationSelection: true,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "France Visa": {
    basePrice: 450,
    formTitle: "France Visa Application",
    formDescription: "Provide your information to apply for a France Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Germany Visa": {
    basePrice: 450,
    formTitle: "Germany Visa Application",
    formDescription: "Provide your information to apply for a Germany Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Austria Visa": {
    basePrice: 450,
    formTitle: "Austria Visa Application",
    formDescription: "Provide your information to apply for an Austria Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Czech Republic Visa": {
    basePrice: 450,
    formTitle: "Czech Republic Visa Application",
    formDescription: "Provide your information to apply for a Czech Republic Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Greece Visa": {
    basePrice: 450,
    formTitle: "Greece Visa Application",
    formDescription: "Provide your information to apply for a Greece Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Italy Visa": {
    basePrice: 450,
    formTitle: "Italy Visa Application",
    formDescription: "Provide your information to apply for an Italy Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Ireland Visa": {
    basePrice: 450,
    formTitle: "Ireland Visa Application",
    formDescription: "Provide your information to apply for an Ireland Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Norway Visa": {
    basePrice: 450,
    formTitle: "Norway Visa Application",
    formDescription: "Provide your information to apply for a Norway Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Portugal Visa": {
    basePrice: 450,
    formTitle: "Portugal Visa Application",
    formDescription: "Provide your information to apply for a Portugal Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Poland Visa": {
    basePrice: 450,
    formTitle: "Poland Visa Application",
    formDescription: "Provide your information to apply for a Poland Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  },
  "Switzerland Visa": {
    basePrice: 450,
    formTitle: "Switzerland Visa Application",
    formDescription: "Provide your information to apply for a Switzerland Visa",
    requiresMothersName: false,
    requiresAppointmentTypeSelection: false,
    requiresLocationSelection: false,
    requiresVisaCitySelection: false,
    requiresSaudiIdIqama: false
  }
};

export const DEFAULT_VISA_CONFIG = {
  basePrice: 450,
  formTitle: "Visa Application",
  formDescription: "Provide your information to apply for a visa",
  requiresMothersName: false,
  requiresAppointmentTypeSelection: false,
  requiresLocationSelection: false,
  requiresVisaCitySelection: false,
  requiresSaudiIdIqama: false,
  usaVisaCities: ["Riyadh", "Jeddah", "Dhahran"]
};
