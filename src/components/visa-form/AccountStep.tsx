import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepProps } from "./types";
import {
  COUNTRY_CODES,
  SPAIN_APPOINTMENT_TYPES,
  SPAIN_LOCATIONS,
} from "./constants";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language";
import { useAuthentication } from "../user-account/useAuthentication";

export const AccountStep = ({
  formData,
  setFormData,
  travellers,
  handlePrevStep,
  handleSubmit,
  selectedService,
  appointmentType,
  userLocation,
  basePrice,
  totalPrice,
}: StepProps) => {
  const { isLoggedIn } = useAuthentication();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const { t } = useLanguage();

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Make sure password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      toast.error(t("passwordsDontMatch"));
      return;
    }

    // Continue with the original handleSubmit function
    handleSubmit(e);
  };

  return (
    <div className="space-y-3 sm:space-y-4 animate-fadeIn form-inputs">
      {!isLoggedIn && (
        <>
          <h3 className="text-lg font-medium text-visa-dark">
            {t("createAccount")}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {t("createAccountDesc")}
          </p>

          <div>
            <label
              htmlFor="email"
              className="text-start block text-sm font-medium text-gray-700 mb-1"
            >
              {t("email")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
        </>
      )}

      <div>
        <label
          htmlFor="phoneNumber"
          className="text-start block text-sm font-medium text-gray-700 mb-1"
        >
          {t("phoneNumber")} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-1">
          <Select
            onValueChange={(value) => handleSelectChange("countryCode", value)}
            value={formData.countryCode}
          >
            <SelectTrigger className="w-full rounded border">
              <SelectValue placeholder="+966" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-white col-span-1">
              {COUNTRY_CODES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code} {country.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="flex-1 rounded col-span-2"
            placeholder="Phone number"
            required
          />
        </div>
        <p className="text-start text-xs text-gray-500 mt-1">
          {t("phoneNumberDesc")}
        </p>
      </div>

      {!isLoggedIn && (
        <>
          <div>
            <label
              htmlFor="password"
              className="text-start block text-sm font-medium text-gray-700 mb-1"
            >
              {t("password")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="text-start block text-sm font-medium text-gray-700 mb-1"
            >
              {t("confirmPassword")} <span className="text-red-500">*</span>
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
        </>
      )}

      {/* Add prominent note for Spain Visa */}
      {selectedService.title === "Spain Visa" && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-600 font-bold text-center text-xs sm:text-sm">
            {t("serviceIncludesAppointmentAndFilesOnly")}{" "}
          </p>
        </div>
      )}

      {/* Display processing time and updated price */}
      <div className="border p-3 sm:p-4 rounded-md bg-gray-50 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t("processingTime")}
            </label>
            <p className="text-xs sm:text-sm text-visa-dark">
              {selectedService.time}
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              {t("totalPrice")}
            </label>
            <div className="text-base sm:text-xl font-bold text-visa-gold">
              {totalPrice} ﷼
            </div>
          </div>
        </div>
      </div>

      {/* Display selected appointment type for Spain Visa */}
      {selectedService.title === "Spain Visa" && (
        <div className="border p-3 sm:p-4 rounded-lg bg-gray-50">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            {t("selectedService")}
          </label>
          <div className="text-xs sm:text-sm flex justify-between">
            <span className="font-medium">{t("appointmentType")}:</span>
            <span className="text-visa-dark">
              {
                SPAIN_APPOINTMENT_TYPES.find(
                  (type) => type.id === appointmentType
                )?.name
              }{" "}
              ({basePrice} ﷼ {t("perTraveller")})
            </span>
          </div>
          <div className="text-xs sm:text-sm flex justify-between mt-1">
            <span className="font-medium">{t("location")}:</span>
            <span className="text-visa-dark">
              {SPAIN_LOCATIONS.find((loc) => loc.id === userLocation)?.name}
            </span>
          </div>
        </div>
      )}

      {/* Simple traveller summary in final step */}
      <div className="border p-3 sm:p-4 rounded-md bg-gray-50">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          {t("travellerSummary")}
        </label>
        <div className="space-y-1 sm:space-y-2">
          {travellers.map((traveller, index) => (
            <div
              key={index}
              className="text-xs sm:text-sm flex justify-between"
            >
              <span className="font-medium">
                {t("traveller")} {index + 1}:
              </span>
              <span className="text-visa-dark">
                {traveller.firstName} {traveller.lastName}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 sm:pt-4 flex gap-2 sm:gap-3 form-buttons">
        <Button
          type="button"
          onClick={handlePrevStep}
          variant="outline"
          className="w-1/2"
        >
          {t("previous")}
        </Button>
        <Button
          type="submit"
          onClick={handleFinalSubmit}
          className="w-1/2 bg-visa-gold hover:bg-visa-gold/90 text-white"
        >
          {t("submitApplication")}
        </Button>
      </div>
    </div>
  );
};
