import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StepProps } from "./types";
import {
  GCC_NATIONALITIES,
  OTHER_NATIONALITIES,
  SPAIN_APPOINTMENT_TYPES,
  SPAIN_LOCATIONS,
} from "./constants";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/contexts/language";

export const PersonalInfoStep = ({
  formData,
  setFormData,
  travellers,
  setTravellers,
  travelDate,
  setTravelDate,
  handleNextStep,
  handlePrevStep,
  visaType,
  selectedService,
  appointmentType,
  setAppointmentType,
  userLocation,
  setUserLocation,
  visaConfig,
  basePrice,
  totalPrice,
  visaCity,
  setVisaCity,
}: StepProps) => {
  const { t, language } = useLanguage();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTravellerChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newTravellers = [...travellers];
    newTravellers[index] = {
      ...newTravellers[index],
      [field]: value,
    };
    setTravellers(newTravellers);
  };

  const incrementTravellers = () => {
    setFormData((prev) => ({
      ...prev,
      numberOfTravellers: prev.numberOfTravellers + 1,
    }));
  };

  const decrementTravellers = () => {
    if (formData.numberOfTravellers > 1) {
      setFormData((prev) => ({
        ...prev,
        numberOfTravellers: prev.numberOfTravellers - 1,
      }));
    }
  };

  // Check if this is one of the European visas that need to show location selection
  const isEuropeanVisaWithLocationSelection =
    [
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
    ].includes(selectedService.title) && visaConfig.requiresLocationSelection;

  // Only Spain has appointment type selection
  const showAppointmentTypeSelection =
    selectedService.title === "Spain Visa" &&
    visaConfig.requiresAppointmentTypeSelection;

  // Check if this is USA Visa specifically
  const isUSAVisa = selectedService.title === "USA Visa";

  return (
    <div className="space-y-3 sm:space-y-4 animate-fadeIn form-inputs">
      <h3 className="text-lg font-medium text-visa-dark">{t("personal")}</h3>

      {/* Spain Visa - New appointment type selection */}
      {/* {showAppointmentTypeSelection && (
        <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
            {t("select_appointment_type")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <RadioGroup
            value={appointmentType}
            onValueChange={setAppointmentType}
            className="flex flex-wrap justify-center gap-4 sm:gap-8"
          >
            {SPAIN_APPOINTMENT_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={`appointment-${type.id}`} />
                <Label
                  htmlFor={`appointment-${type.id}`}
                  className="cursor-pointer text-sm"
                >
                  {type.name} ({type.price} SAR)
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )} */}

      {/* Location selection for European visas */}
      {isEuropeanVisaWithLocationSelection && (
        <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
            {t("your_location")} <span className="text-red-500">*</span>
          </label>
          <RadioGroup
            value={userLocation}
            onValueChange={setUserLocation}
            className="flex flex-wrap justify-center gap-4 sm:gap-8"
          >
            {SPAIN_LOCATIONS.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={location.id}
                  id={`location-${location.id}`}
                />
                <Label
                  htmlFor={`location-${location.id}`}
                  className="cursor-pointer text-sm"
                >
                  {location.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* USA Visa City Selection */}
      {isUSAVisa && visaConfig.requiresVisaCitySelection && setVisaCity && (
        <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
            {t("select_visa_city")} <span className="text-red-500">*</span>
          </label>
          <RadioGroup
            value={visaCity || "Riyadh"}
            onValueChange={setVisaCity}
            className="flex flex-wrap justify-center gap-4 sm:gap-8"
          >
            {visaConfig.usaVisaCities.map((city: string) => (
              <div key={city} className="flex items-center space-x-2">
                <RadioGroupItem value={city} id={`city-${city}`} />
                <Label
                  htmlFor={`city-${city}`}
                  className="cursor-pointer text-sm"
                >
                  {city}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Nationality Field - Show for Other Nationals */}
      {visaType === "other" && (
        <div className="text-start">
          <label
            htmlFor="nationality"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("select_nationality")} <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => handleSelectChange("nationality", value)}
            value={formData.nationality}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white">
              {/* Add Saudi at the top of the list */}
              <SelectItem value="Saudi">Saudi Arabia</SelectItem>
              {OTHER_NATIONALITIES.filter((nat) => nat !== "Saudi").map(
                (nationality) => (
                  <SelectItem key={nationality} value={nationality}>
                    {nationality}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* GCC Nationals form */}
      {visaType === "gcc" && (
        <div className="text-start">
          <label
            htmlFor="nationality"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("nationality")} <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => handleSelectChange("nationality", value)}
            value={formData.nationality}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {GCC_NATIONALITIES.map((nationality) => (
                <SelectItem key={nationality.value} value={nationality.value}>
                  {language === "ar"
                    ? nationality.label
                    : nationality.englishLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Mother's Full Name field - shown based on visa requirements */}
      {((visaType === "gcc" && visaConfig.requiresMothersName) ||
        (isUSAVisa && visaConfig.requiresMothersName)) && (
        <div className="text-start">
          <label
            htmlFor="mothersFullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("mothers_name")} <span className="text-red-500">*</span>
          </label>
          <Input
            id="mothersFullName"
            name="mothersFullName"
            value={formData.mothersFullName}
            onChange={handleChange}
            className="w-full"
            required={visaConfig.requiresMothersName}
          />
        </div>
      )}

      {/* Travel Date - Dropdown Calendar for USA Visa, Fixed Calendar for others */}
      <div className="flex flex-col w-full text-start">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-start">
          {t("travel_date")} <span className="text-red-500">*</span>
        </label>

        {isUSAVisa ? (
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {travelDate ? (
                    format(travelDate, "PPP")
                  ) : (
                    <span>Select your travel date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white z-40"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={travelDate}
                  onSelect={setTravelDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="border rounded-md p-1 bg-white w-full">
            <div className="flex justify-center w-full">
              <Calendar
                mode="single"
                selected={travelDate}
                onSelect={setTravelDate}
                disabled={(date) => date < new Date()}
                className="mx-auto"
              />
            </div>
            {travelDate && (
              <div className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 border-t text-center">
                Selected:{" "}
                <span className="font-medium">{format(travelDate, "PPP")}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* No. of Travellers with centered +/- buttons */}
      <div>
        <label
          htmlFor="numberOfTravellers"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("no_of_travellers")} <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center justify-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`rounded-full h-7 w-7 sm:h-8 sm:w-8 ${
              formData.numberOfTravellers <= 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={decrementTravellers}
            disabled={formData.numberOfTravellers <= 1}
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="text-base sm:text-lg font-medium w-6 sm:w-8 text-center">
            {formData.numberOfTravellers}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full h-7 w-7 sm:h-8 sm:w-8"
            onClick={incrementTravellers}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      {/* Dynamic Traveller Fields - only includes full name and Saudi ID for USA Visa */}
      {travellers.map((traveller, index) => (
        <div
          key={index}
          className="border rounded-md p-3 sm:p-4 space-y-2 sm:space-y-3"
        >
          <h4 className="font-medium text-sm sm:text-base">
            {t("traveller")} {index + 1}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="text-start">
              <label
                htmlFor={`firstName-${index}`}
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                {t("firstName")} <span className="text-red-500">*</span>
              </label>
              <Input
                id={`firstName-${index}`}
                value={traveller.firstName}
                onChange={(e) =>
                  handleTravellerChange(index, "firstName", e.target.value)
                }
                className="w-full"
                required
              />
            </div>

            <div className="text-start">
              <label
                htmlFor={`lastName-${index}`}
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                {t("lastName")} <span className="text-red-500">*</span>
              </label>
              <Input
                id={`lastName-${index}`}
                value={traveller.lastName}
                onChange={(e) =>
                  handleTravellerChange(index, "lastName", e.target.value)
                }
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Saudi ID/Iqama field - only for USA Visa */}
          {isUSAVisa && visaConfig.requiresSaudiIdIqama && (
            <div className="text-start">
              <label
                htmlFor={`saudiIdIqama-${index}`}
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                {t("saudiIqamaNumber")} <span className="text-red-500">*</span>
              </label>
              <Input
                id={`saudiIdIqama-${index}`}
                value={traveller.saudiIdIqama || ""}
                onChange={(e) =>
                  handleTravellerChange(index, "saudiIdIqama", e.target.value)
                }
                className="w-full"
                required
              />
            </div>
          )}
        </div>
      ))}

      {/* Add prominent note for European visas */}
      {isEuropeanVisaWithLocationSelection && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-600 font-bold text-center text-xs sm:text-sm">
            {t("serviceIncludesAppointmentAndFilesOnly")}{" "}
          </p>
        </div>
      )}

      {/* Price display for service with dynamic pricing */}
      <div className="border p-3 sm:p-4 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center">
          {showAppointmentTypeSelection ? (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {t("appointmentType")}
              </label>
              <div className="text-sm sm:text-lg font-medium text-visa-dark">
                {
                  SPAIN_APPOINTMENT_TYPES.find(
                    (type) => type.id === appointmentType
                  )?.name
                }
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {t("pricePerTraveller")}
              </label>
              <div className="text-sm sm:text-lg font-medium text-visa-dark">
                {basePrice} SAR
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t("totalPrice")}
            </label>
            <div className="text-base sm:text-xl font-bold text-visa-gold">
              {totalPrice} SAR
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 sm:mt-2">
          {t("basedOn")} {formData.numberOfTravellers}{" "}
          {t(formData.numberOfTravellers === 1 ? "traveller" : "travellers")} ×{" "}
          {basePrice} SAR
        </p>
      </div>

      <div className="pt-3 sm:pt-4">
        <Button
          type="button"
          onClick={handleNextStep}
          className="w-full bg-visa-gold hover:bg-visa-gold/90 text-white"
        >
          {t("nextUploadDocuments")}
        </Button>
      </div>
    </div>
  );
};
