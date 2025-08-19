
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, SUPABASE_API_URL, SUPABASE_ANON_KEY } from "@/integrations/supabase/client";
import { Service } from "@/types/visa";
import { TravellerData, UploadedFiles, VisaFormData } from "../types";
import { VISA_CONFIGS, DEFAULT_VISA_CONFIG } from "@/config/visaConfig";
import { uploadDocuments } from "../utils/documentUtils";

export interface UseServiceFormProps {
  selectedService: Service;
  onBack: () => void;
}

export const useServiceForm = ({ selectedService, onBack }: UseServiceFormProps) => {
  const visaConfig = selectedService 
    ? VISA_CONFIGS[selectedService.title as keyof typeof VISA_CONFIGS] || DEFAULT_VISA_CONFIG 
    : DEFAULT_VISA_CONFIG;
  
  const requiresNationalitySelection = selectedService && selectedService.title === "British Visa";
  const isEuropeanVisa = [
    "Spain Visa", "France Visa", "Germany Visa", "Austria Visa", 
    "Czech Republic Visa", "Greece Visa", "Italy Visa", "Ireland Visa", 
    "Norway Visa", "Portugal Visa", "Poland Visa", "Switzerland Visa"
  ].includes(selectedService?.title || "");
  const isUSAVisa = selectedService?.title === "USA Visa";
  
  const serviceType = 'prepare-file-only';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [visaType, setVisaType] = useState<'gcc' | 'other' | null>(requiresNationalitySelection ? null : 'other');
  const [formStep, setFormStep] = useState(1);
  const [travelDate, setTravelDate] = useState<Date | undefined>(undefined);
  const [appointmentType, setAppointmentType] = useState("normal");
  const [userLocation, setUserLocation] = useState("riyadh");
  const [visaCity, setVisaCity] = useState("Riyadh");
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [formData, setFormData] = useState<VisaFormData>({
    nationality: "Saudi",
    mothersFullName: "",
    numberOfTravellers: 1,
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: "+966",
    phoneNumber: "",
    visaCity: "Riyadh"
  });

  const [travellers, setTravellers] = useState<TravellerData[]>([{
    fullName: "",
    saudiIdIqama: ""
  }]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    passports: [],
    photos: []
  });

  // Calculate pricing
  let basePrice = 100;
  if (isUSAVisa) {
    basePrice = visaConfig.basePrice;
  } else if (isEuropeanVisa) {
    if (selectedService?.title === "Spain Visa" && visaConfig.requiresAppointmentTypeSelection) {
      const selectedAppointmentType = appointmentType === "normal" ? 330 : 
                                      appointmentType === "prime" ? 610 : 865;
      basePrice = selectedAppointmentType;
    } else {
      basePrice = visaConfig.basePrice;
    }
  } else {
    basePrice = visaConfig.basePrice;
  }
  
  const totalPrice = formData.numberOfTravellers * basePrice;

  // Reset form when visa type changes
  useEffect(() => {
    setFormStep(1);
    setFormData({
      nationality: "Saudi",
      mothersFullName: "",
      numberOfTravellers: 1,
      email: "",
      password: "",
      confirmPassword: "",
      countryCode: "+966",
      phoneNumber: "",
      visaCity: "Riyadh"
    });
    setTravelDate(undefined);
    setTravellers([{
      fullName: "",
      saudiIdIqama: ""
    }]);
    setUploadedFiles({
      passports: [],
      photos: []
    });
    setAppointmentType("normal");
    setUserLocation("riyadh");
    setVisaCity("Riyadh");
    setApplicationId(null);
  }, [visaType, serviceType]);

  // Update travellers when number changes
  useEffect(() => {
    if (formData.numberOfTravellers > travellers.length) {
      const newTravellers = [...travellers];
      for (let i = travellers.length; i < formData.numberOfTravellers; i++) {
        newTravellers.push({
          fullName: "",
          saudiIdIqama: ""
        });
      }
      setTravellers(newTravellers);
    } else if (formData.numberOfTravellers < travellers.length) {
      setTravellers(travellers.slice(0, formData.numberOfTravellers));
    }
  }, [formData.numberOfTravellers]);

  const sendConfirmationEmail = async (appId: string, applicationData: any) => {
    try {
      console.log("Sending confirmation email for application:", appId);
  
      // Include the uploaded files in the request body
      const emailData = {
        applicationId: appId,
        email: formData.email,
        firstName: travellers[0].fullName.split(' ')[0],
        lastName: travellers[0].fullName.split(' ').slice(1).join(' '),
        country: selectedService?.title.split(' ')[0] || '',
        travelDate: travelDate?.toISOString() || new Date().toISOString(),
        totalPrice: totalPrice,
        serviceType: serviceType === 'prepare-file-only' ? 'Document Preparation' : serviceType,
        visaCity: visaCity || 'Riyadh',
        numberOfTravellers: formData.numberOfTravellers,
        travellerDetails: travellers,
        mothersName: formData.mothersFullName || '',
        phone: `${formData.countryCode}${formData.phoneNumber}`,
        referenceId: applicationData.reference_id,
        applicationFiles: {
          passports: uploadedFiles.passports.map((file, index) => ({
            name: file.name,
            travelerIndex: index
          })),
          photos: uploadedFiles.photos.map((file, index) => ({
            name: file.name,
            travelerIndex: index
          }))
        }
      };
  
      console.log("Email data being sent:", emailData);
  
      // Make sure the session is valid and get the access token
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
  
      // Send the confirmation email API request
      const response = await fetch(`${SUPABASE_API_URL}/functions/v1/send-visa-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify(emailData),
      });
  
      console.log("Email API response status:", response.status);
      const responseData = await response.json();
      console.log("Email API response data:", responseData);
  
      if (!response.ok) {
        console.error("Failed to send confirmation email:", responseData);
        setShowConfirmation(true);
      } else if (responseData.emailStatus === "pending_verification") {
        setShowConfirmation(true);
      } else {
        console.log("Confirmation email sent successfully!");
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  };
  

  const sendTeamNotificationEmail = async (appId: string, applicationData: any) => {
    try {
      console.log("Sending team notification email for application:", appId);
      
      const teamNotificationData = {
        applicationId: appId,
        referenceId: applicationData.reference_id,
        formData: {
          email: formData.email,
          countryCode: formData.countryCode,
          phoneNumber: formData.phoneNumber,
          nationality: formData.nationality,
          mothersFullName: formData.mothersFullName,
          numberOfTravellers: formData.numberOfTravellers,
          country: selectedService?.title.split(' ')[0] || '',
          travelDate: travelDate?.toISOString(),
          travellers: travellers,
          serviceType: serviceType === 'prepare-file-only' ? 'Document Preparation' : serviceType,
          visaCity: visaCity,
          totalPrice: totalPrice
        },
        uploadedFiles: {
          passports: uploadedFiles.passports.map(file => {
            if (!file) return null;
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: file.dataUrl
            };
          }).filter(Boolean),
          photos: uploadedFiles.photos.map(file => {
            if (!file) return null;
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: file.dataUrl
            };
          }).filter(Boolean)
        }
      };

      console.log("Team notification data being sent:", teamNotificationData);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(`${SUPABASE_API_URL}/functions/v1/send-team-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify(teamNotificationData),
      });

      console.log("Team notification API response status:", response.status);
      const responseData = await response.json();
      console.log("Team notification API response data:", responseData);

      if (!response.ok) {
        console.error("Failed to send team notification email:", responseData);
      }
    } catch (error) {
      console.error("Error sending team notification email:", error);
    }
  };

  const handleNextStep = () => {
    if (formStep === 1) {
      const requiredFields = ['nationality'];

      if (!travelDate) {
        toast.error("Please select a travel date");
        return;
      }

      const incompleteTravellers = travellers.some(traveller => !traveller.fullName);
      if (incompleteTravellers) {
        toast.error("Please fill in all traveller information");
        return;
      }
      
      if (isUSAVisa && visaConfig.requiresSaudiIdIqama) {
        const missingIdIqama = travellers.some(traveller => !traveller.saudiIdIqama);
        if (missingIdIqama) {
          toast.error("Please fill in Saudi ID/Iqama Number for all travellers");
          return;
        }
      }

      if (isUSAVisa && visaConfig.requiresVisaCitySelection && !visaCity) {
        toast.error("Please select a visa city");
        return;
      }

      if ((visaType === 'gcc' && visaConfig.requiresMothersName) || 
          (isUSAVisa && visaConfig.requiresMothersName)) {
        requiredFields.push('mothersFullName');
      }
      
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      if (missingFields.length > 0) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (formStep === 2) {
      // Document upload step - now optional, so no validation here
    }
    
    setFormStep(prev => prev + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handlePrevStep = () => {
    setFormStep(prev => Math.max(1, prev - 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setFormStep(1);
    setFormData({
      nationality: "Saudi",
      mothersFullName: "",
      numberOfTravellers: 1,
      email: "",
      password: "",
      confirmPassword: "",
      countryCode: "+966",
      phoneNumber: "",
      visaCity: "Riyadh"
    });
    setTravelDate(undefined);
    setTravellers([{ fullName: "", saudiIdIqama: "" }]);
    setUploadedFiles({ passports: [], photos: [] });
    setIsSubmitting(false);
    onBack();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const passport_files = uploadedFiles.passports.map(file => file.name);
const photo_files = uploadedFiles.photos.map(file => file.name);
      const applicationData: any = {
        first_name: travellers[0].fullName.split(' ')[0],
        last_name: travellers[0].fullName.split(' ').slice(1).join(' '),
        email: formData.email,
        phone: `${formData.countryCode}${formData.phoneNumber}`,
        country: selectedService?.title.split(' ')[0] || '',
        adults: formData.numberOfTravellers,
        children: 0,
        travel_date: travelDate?.toISOString() || new Date().toISOString(),
        total_price: totalPrice,
        visa_type: visaType,
        service_type: serviceType,
        passport_files,
        photo_files

      };
      
      if (isUSAVisa) {
        applicationData.mothers_name = formData.mothersFullName;
        applicationData.visa_city = visaCity;
        applicationData.saudi_id_iqama = travellers.map(t => ({
          traveller_name: t.fullName,
          id_iqama: t.saudiIdIqama
        }));
      }

      console.log("Submitting application data:", applicationData);

      const { data, error } = await supabase
        .from('visa_applications')
        .insert([applicationData])
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log("Form submitted:", formData);
      console.log("Travellers:", travellers);
      console.log("Travel date:", travelDate);
      console.log("Uploaded files:", uploadedFiles);
      console.log("Total Price:", totalPrice);
      console.log("Visa type:", visaType);
      console.log("Service type:", serviceType);
      console.log("Appointment type:", appointmentType);
      console.log("Location:", userLocation);
      console.log("Supabase response:", data);
      
      if (data && data.length > 0) {
        const appId = data[0].id;
        setApplicationId(appId);
        await uploadDocuments(appId, uploadedFiles);
        await sendConfirmationEmail(appId, data[0]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting your application. Please try again.");
      setIsSubmitting(false);
    }
  };

  return {
    visaType,
    setVisaType,
    formStep,
    formData,
    setFormData,
    travellers,
    setTravellers,
    travelDate,
    setTravelDate,
    uploadedFiles,
    setUploadedFiles,
    appointmentType,
    setAppointmentType,
    userLocation,
    setUserLocation,
    visaCity,
    setVisaCity,
    isSubmitting,
    setIsSubmitting,
    applicationId,
    showConfirmation, 
    setShowConfirmation,
    basePrice,
    totalPrice,
    serviceType,
    handleNextStep,
    handlePrevStep,
    handleSubmit,
    handleCloseConfirmation,
    visaConfig,
    requiresNationalitySelection,
    isEuropeanVisa,
    isUSAVisa
  };
};
