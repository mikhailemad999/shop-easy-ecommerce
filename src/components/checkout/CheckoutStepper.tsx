
import React from 'react';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

const CheckoutStepper = ({ currentStep }: CheckoutStepperProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div className={`flex flex-col items-center ${currentStep === 'shipping' ? 'text-shop-primary font-semibold' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'shipping' ? 'bg-shop-primary text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="text-xs">Shipping</span>
        </div>
        
        <div className={`flex-grow border-t mx-2 ${currentStep !== 'shipping' ? 'border-shop-primary' : 'border-gray-200'}`}></div>
        
        <div className={`flex flex-col items-center ${currentStep === 'payment' ? 'text-shop-primary font-semibold' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'payment' ? 'bg-shop-primary text-white' : currentStep === 'review' ? 'bg-shop-primary text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="text-xs">Payment</span>
        </div>
        
        <div className={`flex-grow border-t mx-2 ${currentStep === 'review' ? 'border-shop-primary' : 'border-gray-200'}`}></div>
        
        <div className={`flex flex-col items-center ${currentStep === 'review' ? 'text-shop-primary font-semibold' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${currentStep === 'review' ? 'bg-shop-primary text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="text-xs">Review</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper;
