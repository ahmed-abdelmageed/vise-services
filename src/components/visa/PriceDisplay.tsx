import React from "react";

export interface PriceDisplayProps {
  basePrice: number;
  totalPrice: number;
  numberOfTravellers: number;
  appointmentType?: string;
  isSpainVisa?: boolean;
  selectedService?: any;
  appointmentTypes?: any[];
  visaConfig?: any;
}

export const PriceDisplay = ({
  basePrice,
  totalPrice,
  numberOfTravellers,
  appointmentType,
  isSpainVisa,
  appointmentTypes,
  selectedService,
  visaConfig
}: PriceDisplayProps) => {
  return (
    <div>
      {isSpainVisa ? (
        <div>
          {/* Display appointment type and price if it's Spain Visa */}
          <p>Appointment Type: {appointmentType}</p>
          <p>Price: {basePrice}</p>
        </div>
      ) : (
        <div>
          {/* Display base price and total price for other visas */}
          <p>Base Price: {basePrice}</p>
          <p>Total Price: {totalPrice}</p>
        </div>
      )}
      <p>Number of Travellers: {numberOfTravellers}</p>
    </div>
  );
};
