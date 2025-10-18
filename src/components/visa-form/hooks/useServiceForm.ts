import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  supabase,
  SUPABASE_API_URL,
  SUPABASE_ANON_KEY,
} from "@/integrations/supabase/client";
import { Service } from "@/types/visa";
import { TravellerData, UploadedFiles, VisaFormData } from "../types";
import { VISA_CONFIGS, DEFAULT_VISA_CONFIG } from "@/config/visaConfig";
import { uploadDocuments } from "../utils/documentUtils";
import { useAuthentication } from "@/components/user-account/useAuthentication";
import {
  createVisaInvoice,
  createPendingVisaInvoice,
  updateInvoiceStatusToPaid,
} from "@/api/invoices";
import { getCurrentUserId } from "@/api/user";

export interface UseServiceFormProps {
  selectedService: Service;
  onBack: () => void;
}

export const useServiceForm = ({
  selectedService,
  onBack,
}: UseServiceFormProps) => {
  const { isLoggedIn } = useAuthentication();
  const visaConfig = selectedService
    ? VISA_CONFIGS[selectedService.title as keyof typeof VISA_CONFIGS] ||
      DEFAULT_VISA_CONFIG
    : DEFAULT_VISA_CONFIG;

  const requiresNationalitySelection =
    selectedService && selectedService.title === "British Visa";
  const isEuropeanVisa = [
    "Spain Visa",
    "France Visa",
    "Germany Visa",
    "Austria Visa",
    "Czech Republic Visa",
    "Greece Visa",
    "Italy Visa",
    "Ireland Visa",
    "Norway Visa",
    "Portugal Visa",
    "Poland Visa",
    "Switzerland Visa",
  ].includes(selectedService?.title || "");
  const isUSAVisa = selectedService?.title === "USA Visa";

  const serviceType = "prepare-file-only";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [visaType, setVisaType] = useState<"gcc" | "other" | null>(
    requiresNationalitySelection ? null : "other"
  );
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
    visaCity: "Riyadh",
  });

  const [travellers, setTravellers] = useState<TravellerData[]>([
    {
      firstName: "",
      lastName: "",
      saudiIdIqama: "",
    },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    passports: [],
    photos: [],
  });
  console.log("🚀 ~ useServiceForm ~ uploadedFiles:", uploadedFiles);

  // Calculate pricing
  // let basePrice = 100;
  let basePrice = selectedService.basePrice;
  // if (isUSAVisa) {
  //   basePrice = visaConfig.basePrice;
  // } else if (isEuropeanVisa) {
  //   if (
  //     selectedService?.title === "Spain Visa" &&
  //     visaConfig.requiresAppointmentTypeSelection
  //   ) {
  //     const selectedAppointmentType =
  //       appointmentType === "normal"
  //         ? 330
  //         : appointmentType === "prime"
  //         ? 610
  //         : 865;
  //     basePrice = selectedAppointmentType;
  //   } else {
  //     basePrice = visaConfig.basePrice;
  //   }
  // } else {
  //   basePrice = visaConfig.basePrice;
  // }

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
      visaCity: "Riyadh",
    });
    setTravelDate(undefined);
    setTravellers([
      {
        firstName: "",
        lastName: "",
        saudiIdIqama: "",
      },
    ]);
    setUploadedFiles({
      passports: [],
      photos: [],
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
          firstName: "",
          lastName: "",
          saudiIdIqama: "",
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
        firstName: travellers[0].firstName,
        lastName: travellers[0].lastName,
        country: selectedService?.title.split(" ")[0] || "",
        travelDate: travelDate?.toISOString() || new Date().toISOString(),
        totalPrice: totalPrice,
        serviceType:
          serviceType === "prepare-file-only"
            ? "Document Preparation"
            : serviceType,
        visaCity: visaCity || "Riyadh",
        numberOfTravellers: formData.numberOfTravellers,
        travellerDetails: travellers,
        mothersName: formData.mothersFullName || "",
        phone: `${formData.countryCode}${formData.phoneNumber}`,
        referenceId: applicationData.reference_id,
        applicationFiles: {
          passports: uploadedFiles.passports.map((file, index) => ({
            name: file.name,
            travelerIndex: index,
          })),
          photos: uploadedFiles.photos.map((file, index) => ({
            name: file.name,
            travelerIndex: index,
          })),
        },
      };

      console.log("Email data being sent:", emailData);

      // Make sure the session is valid and get the access token
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      // Send the confirmation email API request
      const response = await fetch(
        `${SUPABASE_API_URL}/functions/v1/send-visa-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(emailData),
        }
      );

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

  const sendTeamNotificationEmail = async (
    appId: string,
    applicationData: any
  ) => {
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
          country: selectedService?.title.split(" ")[0] || "",
          travelDate: travelDate?.toISOString(),
          travellers: travellers,
          serviceType:
            serviceType === "prepare-file-only"
              ? "Document Preparation"
              : serviceType,
          visaCity: visaCity,
          totalPrice: totalPrice,
        },
        uploadedFiles: {
          passports: uploadedFiles.passports
            .map((file) => {
              if (!file) return null;
              return {
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: file.dataUrl,
              };
            })
            .filter(Boolean),
          photos: uploadedFiles.photos
            .map((file) => {
              if (!file) return null;
              return {
                name: file.name,
                size: file.size,
                type: file.type,
                dataUrl: file.dataUrl,
              };
            })
            .filter(Boolean),
        },
      };

      console.log("Team notification data being sent:", teamNotificationData);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const response = await fetch(
        `${SUPABASE_API_URL}/functions/v1/send-team-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(teamNotificationData),
        }
      );

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

  const handleNextStep = async () => {
    if (formStep === 1) {
      const requiredFields = ["nationality"];

      if (!travelDate) {
        toast.error("Please select a travel date");
        return;
      }

      const incompleteTravellers = travellers.some(
        (traveller) => !traveller.firstName || !traveller.lastName
      );
      if (incompleteTravellers) {
        toast.error("Please fill in all traveller information");
        return;
      }

      if (isUSAVisa && visaConfig.requiresSaudiIdIqama) {
        const missingIdIqama = travellers.some(
          (traveller) => !traveller.saudiIdIqama
        );
        if (missingIdIqama) {
          toast.error(
            "Please fill in Saudi ID/Iqama Number for all travellers"
          );
          return;
        }
      }

      if (isUSAVisa && visaConfig.requiresVisaCitySelection && !visaCity) {
        toast.error("Please select a visa city");
        return;
      }

      if (
        (visaType === "gcc" && visaConfig.requiresMothersName) ||
        (isUSAVisa && visaConfig.requiresMothersName)
      ) {
        requiredFields.push("mothersFullName");
      }

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData]
      );
      if (missingFields.length > 0) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (formStep === 2) {
      // Document upload step - now optional, so no validation here
    } else if (formStep === 3) {
      // Account/Confirmation step - validate before proceeding to payment
      if (
        !isLoggedIn &&
        (!formData.email ||
          !formData.password ||
          !formData.confirmPassword ||
          !formData.phoneNumber)
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (!formData.phoneNumber) {
        toast.error("Please fill phone number");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      await createApplicationWithPendingInvoice();
    }

    setFormStep((prev) => prev + 1);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePrevStep = () => {
    setFormStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
      visaCity: "Riyadh",
    });
    setTravelDate(undefined);
    setTravellers([{ firstName: "", lastName: "", saudiIdIqama: "" }]);
    setUploadedFiles({ passports: [], photos: [] });
    setIsSubmitting(false);
    onBack();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If we're on step 3, create the application and pending invoice
    if (formStep === 3) {
      handleNextStep(); // Go to payment step
      return;
    }

    // For other steps, just proceed to next step
    if (formStep < 4) {
      handleNextStep();
      return;
    }

    // If we're on step 4 (payment), this shouldn't be called
    // Payment is handled by the PaymentStep component
  };

  const handlePaymentSuccess = async (paymentInfo: any) => {
    try {
      setPaymentData(paymentInfo);
      setPaymentCompleted(true);

      // Update invoice status to paid
      if (invoiceId) {
        await updateInvoiceStatusToPaid(invoiceId, {
          payment_id: paymentInfo.payment_id,
          transaction_id: paymentInfo.transaction_id,
        });

        // Update application status to paid
        if (applicationId) {
          const { error } = await supabase
            .from("visa_applications")
            .update({
              paid: true,
              payment_id: paymentInfo.payment_id,
              order_id: paymentInfo.order_id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", applicationId);

          if (error) {
            console.error("Error updating application payment status:", error);
            toast.error("Failed to update application status");
            return;
          }
        }

        toast.success(
          "Payment successful! Your visa application is now complete."
        );
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error("Error handling payment success:", error);
      toast.error(
        "Payment successful but failed to update records. Please contact support."
      );
    }
  };

  const handlePaymentFailed = (error: string) => {
    toast.error(`Payment failed: ${error}`);
    setPaymentCompleted(false);
    setPaymentData(null);
  };

  const submitVisaApplication = async () => {
    setIsSubmitting(true);

    let user_id = null;
    let email = null;

    if (isLoggedIn) {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      user_id = userData.id || null;
      email = userData.email || null;
    } else {
      // Handle authentication for non-logged-in users
      try {
        // First, try to sign in with the provided credentials
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

        if (signInError) {
          // If sign in fails, check if it's because the user doesn't exist or wrong password
          if (signInError.message.includes("Invalid login credentials")) {
            console.log(
              "🚀 ~ submitVisaApplication ~ signInError.message:",
              signInError.message
            );

            // Check if the email already exists by attempting to sign up
            const { data: signUpData, error: signUpError } =
              await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
              });

            if (signUpError) {
              // If signup fails with "User already registered", it means email exists but password was wrong
              if (
                signUpError.message.includes("User already registered") ||
                signUpError.message.includes("already been registered")
              ) {
                toast.error(
                  "Email already exists. Please check your password and try again, or use a different email."
                );
                setIsSubmitting(false);
                return;
              } else {
                toast.error(`Signup failed: ${signUpError.message}`);
                setIsSubmitting(false);
                return;
              }
            }

            if (signUpData.user) {
              user_id = signUpData.user.id;
              email = signUpData.user.email;
              toast.success("Account created successfully!");
            }
          } else {
            toast.error(
              "Invalid email or password. Please check your credentials and try again."
            );
            setIsSubmitting(false);
            return;
          }
        } else {
          // Sign in successful
          if (signInData.user) {
            user_id = signInData.user.id;
            email = signInData.user.email;
            toast.success("Logged in successfully!");
          }
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error(
          "An error occurred during authentication. Please try again."
        );
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const passport_files = uploadedFiles.passports.map(
        (file) => file.preview
      );
      const photo_files = uploadedFiles.photos.map((file) => file.preview);
      const applicationData: any = {
        first_name: travellers[0].firstName,
        last_name: travellers[0].lastName,
        email: formData.email || email,
        phone: `${formData.countryCode}${formData.phoneNumber}`,
        country: selectedService?.title.split(" ")[0] || "",
        adults: formData.numberOfTravellers,
        children: 0,
        travel_date: travelDate?.toISOString() || new Date().toISOString(),
        total_price: totalPrice,
        visa_type: visaType,
        service_type: serviceType,
        passport_files,
        photo_files,
        user_id,
        payment_id: paymentData?.payment_id,
        order_id: paymentData?.order_id,
        invoice_id: invoiceId,
        paid: false, // This will be updated to true after payment is confirmed
      };

      if (isUSAVisa) {
        applicationData.mothers_name = formData.mothersFullName;
        applicationData.visa_city = visaCity;
        applicationData.saudi_id_iqama = travellers.map((t) => ({
          traveller_name: t.firstName + " " + t.lastName,
          id_iqama: t.saudiIdIqama,
        }));
      }

      console.log("Submitting application data:", applicationData);

      const { data, error } = await supabase
        .from("visa_applications")
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
        setShowConfirmation(true);
        // await uploadDocuments(appId, uploadedFiles);
        await sendConfirmationEmail(appId, data[0]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "An error occurred while submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // New function to create application with pending invoice at step 3
  const createApplicationWithPendingInvoice = async () => {
    setIsSubmitting(true);

    try {
      let user_id = null;
      let email = null;

      if (isLoggedIn) {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        user_id = userData.id || null;
        email = userData.email || null;
      } else {
        // Handle authentication for non-logged-in users
        try {
          // First, try to sign in with the provided credentials
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
            });

          if (signInError) {
            // If sign in fails, check if it's because the user doesn't exist or wrong password
            if (signInError.message.includes("Invalid login credentials")) {
              // Check if the email already exists by attempting to sign up
              const { data: signUpData, error: signUpError } =
                await supabase.auth.signUp({
                  email: formData.email,
                  password: formData.password,
                });

              if (signUpError) {
                if (
                  signUpError.message.includes("User already registered") ||
                  signUpError.message.includes("already been registered")
                ) {
                  toast.error(
                    "Email already exists. Please check your password and try again, or use a different email."
                  );
                  setIsSubmitting(false);
                  return;
                } else {
                  toast.error(`Signup failed: ${signUpError.message}`);
                  setIsSubmitting(false);
                  return;
                }
              }

              if (signUpData.user) {
                user_id = signUpData.user.id;
                email = signUpData.user.email;
                toast.success("Account created successfully!");
              }
            } else {
              toast.error(
                "Invalid email or password. Please check your credentials and try again."
              );
              setIsSubmitting(false);
              return;
            }
          } else {
            // Sign in successful
            if (signInData.user) {
              user_id = signInData.user.id;
              email = signInData.user.email;
              toast.success("Logged in successfully!");
            }
          }
        } catch (error) {
          console.error("Authentication error:", error);
          toast.error(
            "An error occurred during authentication. Please try again."
          );
          setIsSubmitting(false);
          return;
        }
      }

      const passport_files = uploadedFiles.passports.map(
        (file) => file.preview
      );
      const photo_files = uploadedFiles.photos.map((file) => file.preview);

      const applicationData: any = {
        first_name: travellers[0].firstName,
        last_name: travellers[0].lastName,
        email: formData.email || email,
        phone: `${formData.countryCode}${formData.phoneNumber}`,
        country: selectedService?.title.split(" ")[0] || "",
        adults: formData.numberOfTravellers,
        children: 0,
        travel_date: travelDate?.toISOString() || new Date().toISOString(),
        total_price: totalPrice,
        visa_type: visaType,
        service_type: serviceType,
        passport_files,
        photo_files,
        user_id,
        paid: false,
      };

      if (isUSAVisa) {
        applicationData.mothers_name = formData.mothersFullName;
        applicationData.visa_city = visaCity;
        applicationData.saudi_id_iqama = travellers.map((t) => ({
          traveller_name: t.firstName + " " + t.lastName,
          id_iqama: t.saudiIdIqama,
        }));
      }

      console.log("Creating application with pending status:", applicationData);

      // Create the visa application
      const { data, error } = await supabase
        .from("visa_applications")
        .insert([applicationData])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const appId = data[0].id;
        setApplicationId(appId);

        // Create pending invoice using the application ID as client_id
        const invoiceData = await createPendingVisaInvoice({
          user_id: user_id,
          client_id: appId, // Use application ID as client_id
          service_description: `${selectedService?.title} - Visa Service for ${travellers[0]?.firstName} ${travellers[0]?.lastName}`,
          customer_email: formData.email,
          customer_name: `${travellers[0]?.firstName} ${travellers[0]?.lastName}`,
          amount: totalPrice,
          currency: "SAR",
          order_id: `APP${appId}`,
        });

        if (invoiceData) {
          setInvoiceId(invoiceData.id);

          // Update the application with the invoice_id
          const { error: updateError } = await supabase
            .from("visa_applications")
            .update({
              invoice_id: invoiceData.id,
            })
            .eq("id", appId);

          if (updateError) {
            console.error(
              "Error updating application with invoice ID:",
              updateError
            );
          }

          toast.success(
            "Application created! Please complete payment to finalize."
          );
        }

        console.log("Application and pending invoice created:", {
          appId,
          invoiceId: invoiceData?.id,
        });
      }
    } catch (error) {
      console.error("Error creating application with pending invoice:", error);
      toast.error(
        "An error occurred while creating your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayLater = () => {
    toast.success(
      "Application saved! You can complete payment later from your dashboard."
    );
    setShowConfirmation(true);
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
    isUSAVisa,
    // Payment-related exports
    paymentCompleted,
    paymentData,
    invoiceId,
    handlePaymentSuccess,
    handlePaymentFailed,
    submitVisaApplication,
    handlePayLater,
  };
};
