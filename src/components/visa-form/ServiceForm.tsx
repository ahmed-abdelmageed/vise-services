import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ServiceFormProps } from "./types";
import { NationalitySelection } from "./NationalitySelection";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { DocumentsStep } from "./DocumentsStep";
import { AccountStep } from "./AccountStep";
import { PaymentStep } from "./PaymentStep";
import { useServiceForm } from "./hooks/useServiceForm";
import { FormProgressSteps } from "./components/FormProgressSteps";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { SuccessConfirmation } from "./components/SuccessConfirmation";
import { useLanguage } from "@/contexts/LanguageContext";

export const ServiceForm = ({ selectedService, onBack }: ServiceFormProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const {
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
    // Payment-related
    paymentCompleted,
    paymentData,
    invoiceId,
    handlePaymentSuccess,
    handlePaymentFailed,
    submitVisaApplication
  } = useServiceForm({ selectedService, onBack });

  if (!selectedService) return null;

  const countryName = selectedService.title.split(" ")[0];
  const formTitle = isArabic
    ? selectedService.formTitle_ar
    : selectedService.formTitle;

  const formDescription = isArabic
    ? selectedService.formDescription_ar
    : selectedService.formDescription;

  const displayTitle =
    requiresNationalitySelection && visaType === "gcc"
      ? formTitle
      : requiresNationalitySelection && visaType === "other"
      ? `${countryName} Visa for Other Nationals`
      : formTitle;

  if (requiresNationalitySelection && visaType === null) {
    return (
      <NationalitySelection
        selectedService={selectedService}
        visaConfig={visaConfig}
        onBack={onBack}
        setVisaType={setVisaType}
        countryName={countryName}
      />
    );
  }

  return (
    <div className="py-6 sm:py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 form-container">
        <LoadingOverlay isVisible={isSubmitting} />

        <SuccessConfirmation
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          applicationId={applicationId}
          onClose={handleCloseConfirmation}
        />
        {/* <button
          onClick={
            requiresNationalitySelection && visaType !== null
              ? () => setVisaType(null)
              : onBack
          }
          className="mb-4 sm:mb-6 flex items-center text-visa-dark hover:text-visa-gold transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isArabic ? "العودة" : "Back"}
        </button> */}

        <Card className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm shadow-lg animate-fadeIn form-card">
          <CardHeader className="border-b border-gray-100 bg-visa-light sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-lg bg-white/50 flex items-center justify-center">
                <img
                  src={selectedService.flag}
                  alt={`${countryName} Flag`}
                  className="h-5 sm:h-6 w-7 sm:w-8 object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-base text-start sm:text-xl text-visa-dark">
                  {displayTitle}
                </CardTitle>
                {formDescription && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-0 sm:mt-1 text-start">
                    {formDescription}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-6 pt-4 sm:pt-6">
            <FormProgressSteps
              formStep={formStep}
              serviceTitle={selectedService.title}
            />

            <form onSubmit={handleSubmit}>
              {formStep === 1 && (
                <PersonalInfoStep
                  formData={formData}
                  setFormData={setFormData}
                  travellers={travellers}
                  setTravellers={setTravellers}
                  travelDate={travelDate}
                  setTravelDate={setTravelDate}
                  handleNextStep={handleNextStep}
                  handlePrevStep={handlePrevStep}
                  visaType={visaType}
                  selectedService={selectedService}
                  serviceType={serviceType}
                  appointmentType={appointmentType}
                  setAppointmentType={setAppointmentType}
                  userLocation={userLocation}
                  setUserLocation={setUserLocation}
                  visaConfig={visaConfig}
                  basePrice={basePrice}
                  totalPrice={totalPrice}
                  visaCity={visaCity}
                  setVisaCity={setVisaCity}
                />
              )}

              {formStep === 2 && (
                <DocumentsStep
                  formData={formData}
                  setFormData={setFormData}
                  travellers={travellers}
                  setTravellers={setTravellers}
                  travelDate={travelDate}
                  setTravelDate={setTravelDate}
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  handleNextStep={handleNextStep}
                  handlePrevStep={handlePrevStep}
                  visaType={visaType}
                  selectedService={selectedService}
                  serviceType={serviceType}
                  appointmentType={appointmentType}
                  setAppointmentType={setAppointmentType}
                  userLocation={userLocation}
                  setUserLocation={setUserLocation}
                  visaConfig={visaConfig}
                  basePrice={basePrice}
                  totalPrice={totalPrice}
                />
              )}

              {formStep === 3 && (
                <AccountStep
                  formData={formData}
                  setFormData={setFormData}
                  travellers={travellers}
                  setTravellers={setTravellers}
                  travelDate={travelDate}
                  setTravelDate={setTravelDate}
                  handleNextStep={handleNextStep}
                  handlePrevStep={handlePrevStep}
                  handleSubmit={handleSubmit}
                  visaType={visaType}
                  selectedService={selectedService}
                  serviceType={serviceType}
                  appointmentType={appointmentType}
                  setAppointmentType={setAppointmentType}
                  userLocation={userLocation}
                  setUserLocation={setUserLocation}
                  visaConfig={visaConfig}
                  basePrice={basePrice}
                  totalPrice={totalPrice}
                />
              )}

              {formStep === 4 && (
                <PaymentStep
                  totalPrice={totalPrice}
                  formData={formData}
                  travellers={travellers}
                  selectedService={selectedService}
                  applicationId={applicationId}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentFailed={handlePaymentFailed}
                  handlePrevStep={handlePrevStep}
                />
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceForm;
