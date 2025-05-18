
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/api';
import { ShippingAddress } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Import refactored components
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import ShippingStep from '@/components/checkout/ShippingStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import ReviewStep from '@/components/checkout/ReviewStep';
import SignInMessage from '@/components/checkout/SignInMessage';

type CheckoutStep = 'shipping' | 'payment' | 'review';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { 
    cartItems, 
    shippingAddress, 
    saveShippingAddress,
    paymentMethod,
    savePaymentMethod,
    cartTotal,
    shippingPrice,
    taxAmount,
    finalTotal,
    clearCart
  } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  if (!user) {
    return (
      <Layout>
        <SignInMessage />
      </Layout>
    );
  }
  
  const handleShippingSubmit = (data: ShippingAddress) => {
    saveShippingAddress(data);
    setCurrentStep('payment');
  };
  
  const handlePaymentMethodSelect = (method: string) => {
    savePaymentMethod(method);
    setCurrentStep('review');
  };
  
  const handlePlaceOrder = async () => {
    if (!shippingAddress || !user) return;
    
    try {
      setIsSubmitting(true);
      
      const order = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        taxPrice: taxAmount,
        shippingPrice,
        totalPrice: finalTotal,
        isPaid: false,
        isDelivered: false,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
      
      clearCart();
      setIsSubmitting(false);
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order._id} has been placed.`,
        duration: 5000,
      });
      
      navigate(`/order/${order._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      setIsSubmitting(false);
      
      toast({
        title: "Error placing order",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 'shipping':
        return (
          <ShippingStep 
            onSubmit={handleShippingSubmit}
            defaultValues={shippingAddress || undefined}
          />
        );
      
      case 'payment':
        return (
          <PaymentStep 
            onSelectPaymentMethod={handlePaymentMethodSelect}
            onBack={() => setCurrentStep('shipping')}
            defaultPaymentMethod={paymentMethod}
          />
        );
      
      case 'review':
        return (
          <ReviewStep
            user={user}
            shippingAddress={shippingAddress!}
            paymentMethod={paymentMethod}
            cartItems={cartItems}
            cartTotal={cartTotal}
            shippingPrice={shippingPrice}
            taxAmount={taxAmount}
            finalTotal={finalTotal}
            onBack={() => setCurrentStep('payment')}
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
          />
        );
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          {/* Checkout Steps */}
          <CheckoutStepper currentStep={currentStep} />
          
          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
