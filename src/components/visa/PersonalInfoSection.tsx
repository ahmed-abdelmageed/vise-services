// Update the import for Service
import { Service, VisaType } from "@/types/visa";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StepProps } from "@/components/visa-form/types";
import { GCC_NATIONALITIES, OTHER_NATIONALITIES, SPAIN_APPOINTMENT_TYPES, SPAIN_LOCATIONS } from "@/components/visa-form/constants";
import { useLanguage } from "@/contexts/language";

export const PersonalInfoStep = ({
  formData,
  setFormData,
  travellers,
  setTravellers,
  travelDate,
  setTravelDate,
  handleNextStep,
  visaType,
  selectedService,
  appointmentType,
  setAppointmentType,
  userLocation,
  setUserLocation,
  visaConfig,
  basePrice,
  totalPrice
}: StepProps) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const { t } = useLanguage();

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTravellerChange = (index: number, field: 'fullName', value: string) => {
    const newTravellers = [...travellers];
    newTravellers[index] = {
      ...newTravellers[index],
      [field]: value
    };
    setTravellers(newTravellers);
  };

  const incrementTravellers = () => {
    setFormData(prev => ({
      ...prev,
      numberOfTravellers: prev.numberOfTravellers + 1
    }));
  };

  const decrementTravellers = () => {
    if (formData.numberOfTravellers > 1) {
      setFormData(prev => ({
        ...prev,
        numberOfTravellers: prev.numberOfTravellers - 1
      }));
    }
  };

  // Check if this is one of the European visas that need to show location selection
  const isEuropeanVisaWithLocationSelection = 
    ["Spain Visa", "France Visa", "Germany Visa", "Austria Visa", "Czech Republic Visa", 
     "Greece Visa", "Italy Visa", "Ireland Visa", "Norway Visa", "Portugal Visa", 
     "Poland Visa", "Switzerland Visa"].includes(selectedService.title) &&
    visaConfig.requiresLocationSelection;

  // Only Spain has appointment type selection
  const showAppointmentTypeSelection = selectedService.title === "Spain Visa" && 
    visaConfig.requiresAppointmentTypeSelection;

  return (
    <div className="space-y-4 animate-fadeIn">
      <h3 className="text-lg font-medium text-visa-dark">Personal Information</h3>
      
      {/* Spain Visa - New appointment type selection */}
      {showAppointmentTypeSelection && (
        <div className="mt-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Select Your Appointment Type <span className="text-red-500">*</span>
          </label>
          <RadioGroup 
            value={appointmentType} 
            onValueChange={setAppointmentType}
            className="flex justify-center space-x-8"
          >
            {SPAIN_APPOINTMENT_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id} id={`appointment-${type.id}`} />
                <Label htmlFor={`appointment-${type.id}`} className="cursor-pointer">
                  {type.name} ({type.price} SAR)
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      
      {/* Location selection for European visas */}
      {isEuropeanVisaWithLocationSelection && (
        <div className="mt-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Your Location <span className="text-red-500">*</span>
          </label>
          <RadioGroup 
            value={userLocation} 
            onValueChange={setUserLocation}
            className="flex justify-center space-x-8"
          >
            {SPAIN_LOCATIONS.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <RadioGroupItem value={location.id} id={`location-${location.id}`} />
                <Label htmlFor={`location-${location.id}`} className="cursor-pointer">
                  {location.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      
      {/* Nationality Field - Show for Other Nationals */}
      {visaType === 'other' && (
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            Select Nationality <span className="text-red-500">*</span>
          </label>
          <Select 
            onValueChange={value => handleSelectChange("nationality", value)} 
            value={formData.nationality}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {/* Add Saudi at the top of the list */}
              <SelectItem value="Saudi">Saudi Arabia</SelectItem>
              {OTHER_NATIONALITIES.filter(nat => nat !== "Saudi").map(nationality => 
                <SelectItem key={nationality} value={nationality}>
                  {nationality}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* GCC Nationals form */}
      {visaType === 'gcc' && (
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            Nationality <span className="text-red-500">*</span>
          </label>
          <Select 
            onValueChange={value => handleSelectChange("nationality", value)} 
            value={formData.nationality}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {GCC_NATIONALITIES.map(nationality => (
                <SelectItem key={nationality.value} value={nationality.value}>
                  {nationality.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Travel Date - Fixed Calendar (Always Visible and Centered) */}
      <div className="flex flex-col items-center">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
          Travel Date <span className="text-red-500">*</span>
        </label>
        <div className="border rounded-md p-1 bg-white w-full max-w-md mx-auto">
          <div className="flex justify-center">
            <Calendar 
              mode="single" 
              selected={travelDate} 
              onSelect={setTravelDate} 
              disabled={date => date < new Date()} 
              className="mx-auto" 
            />
          </div>
          {travelDate && (
            <div className="px-4 py-2 text-sm text-gray-600 border-t text-center">
              Selected: <span className="font-medium">{format(travelDate, 'PPP')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Mother's Full Name - only shown for GCC nationals and visa types that require it */}
      {visaType === 'gcc' && visaConfig.requiresMothersName && (
        <div>
          <label htmlFor="mothersFullName" className="block text-sm font-medium text-gray-700 mb-1">
            Mother's Full Name <span className="text-red-500">*</span>
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

      {/* No. of Travellers with centered +/- buttons */}
      <div>
        <label htmlFor="numberOfTravellers" className="block text-sm font-medium text-gray-700 mb-1">
          No. of Travellers <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center justify-center space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className={`rounded-full h-8 w-8 ${formData.numberOfTravellers <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`} 
            onClick={decrementTravellers} 
            disabled={formData.numberOfTravellers <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium w-8 text-center">{formData.numberOfTravellers}</span>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8" 
            onClick={incrementTravellers}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dynamic Traveller Fields - only includes full name */}
      {travellers.map((traveller, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <h4 className="font-medium">Traveller {index + 1}</h4>
          
          <div>
            <label htmlFor={`fullName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Full Name (as on passport) <span className="text-red-500">*</span>
            </label>
            <Input 
              id={`fullName-${index}`} 
              value={traveller.fullName} 
              onChange={e => handleTravellerChange(index, 'fullName', e.target.value)} 
              className="w-full" 
              required 
            />
          </div>
        </div>
      ))}

      {/* Add prominent note for European visas */}
      {isEuropeanVisaWithLocationSelection && (
        <div className="mt-4 p-3 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-600 font-bold text-center">
{t("serviceIncludesAppointmentAndFilesOnly")}          </p>
        </div>
      )}

      {/* Price display for service with dynamic pricing */}
      <div className="border p-4 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center">
          {showAppointmentTypeSelection ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("appointmentType")}
              </label>
              <div className="text-lg font-medium text-visa-dark">
                {SPAIN_APPOINTMENT_TYPES.find(type => type.id === appointmentType)?.name}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Traveller
              </label>
              <div className="text-lg font-medium text-visa-dark">{basePrice} SAR</div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Price
            </label>
            <div className="text-xl font-bold text-visa-gold">{totalPrice} SAR</div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Based on {formData.numberOfTravellers} traveller(s) × {basePrice} SAR
        </p>
      </div>
      
      <div className="pt-4">
        <Button 
          type="button" 
          onClick={handleNextStep} 
          className="w-full bg-visa-gold hover:bg-visa-gold/90 text-white"
        >
          Next: Upload Documents
        </Button>
      </div>
    </div>
  );
};
