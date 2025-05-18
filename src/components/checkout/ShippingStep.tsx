
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import CheckoutForm from '@/components/forms/CheckoutForm';
import { ShippingAddress } from '@/types';

interface ShippingStepProps {
  onSubmit: (data: ShippingAddress) => void;
  defaultValues?: ShippingAddress;
}

const ShippingStep = ({ onSubmit, defaultValues }: ShippingStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
        <CardDescription>Enter your address for delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <CheckoutForm 
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        />
      </CardContent>
    </Card>
  );
};

export default ShippingStep;
