
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { CreditCard } from 'lucide-react';

interface PaymentStepProps {
  onSelectPaymentMethod: (method: string) => void;
  onBack: () => void;
  defaultPaymentMethod: string;
}

const PaymentStep = ({ 
  onSelectPaymentMethod,
  onBack,
  defaultPaymentMethod
}: PaymentStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Select your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue={defaultPaymentMethod} className="space-y-4">
          <div className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem 
              value="PayPal" 
              id="paypal"
              onClick={() => onSelectPaymentMethod('PayPal')}
            />
            <label htmlFor="paypal" className="flex items-center cursor-pointer flex-grow">
              <CreditCard className="mr-2" />
              <div>
                <div className="font-medium">PayPal or Credit Card</div>
                <div className="text-sm text-gray-500">Pay using PayPal or credit/debit card</div>
              </div>
            </label>
          </div>
          
          <div className="flex items-center space-x-2 border p-4 rounded-md">
            <RadioGroupItem 
              value="Stripe" 
              id="stripe"
              onClick={() => onSelectPaymentMethod('Stripe')}
            />
            <label htmlFor="stripe" className="flex items-center cursor-pointer flex-grow">
              <CreditCard className="mr-2" />
              <div>
                <div className="font-medium">Stripe</div>
                <div className="text-sm text-gray-500">Pay directly with your credit/debit card</div>
              </div>
            </label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="mr-2"
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentStep;
