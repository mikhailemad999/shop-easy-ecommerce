
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CheckoutForm from '@/components/forms/CheckoutForm';
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
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/api';
import { ShieldCheck, CreditCard } from 'lucide-react';
import { ShippingAddress } from '@/types';
import { useToast } from '@/components/ui/use-toast';

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
  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="mb-6">You need to be signed in to complete your purchase.</p>
            <Button asChild className="bg-shop-primary hover:bg-shop-primary/90">
              <a href="/login?redirect=checkout">Sign In</a>
            </Button>
          </div>
        </div>
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
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter your address for delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <CheckoutForm 
                onSubmit={handleShippingSubmit}
                defaultValues={shippingAddress || undefined}
              />
            </CardContent>
          </Card>
        );
      
      case 'payment':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue={paymentMethod} className="space-y-4">
                <div className="flex items-center space-x-2 border p-4 rounded-md">
                  <RadioGroupItem 
                    value="PayPal" 
                    id="paypal"
                    onClick={() => handlePaymentMethodSelect('PayPal')}
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
                    onClick={() => handlePaymentMethodSelect('Stripe')}
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
                onClick={() => setCurrentStep('shipping')} 
                variant="outline" 
                className="mr-2"
              >
                Back
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 'review':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Order</CardTitle>
              <CardDescription>Please review your order before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shipping Information */}
              <div>
                <h3 className="font-medium text-lg mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {shippingAddress && (
                    <>
                      <p>{user.name}</p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Payment Method */}
              <div>
                <h3 className="font-medium text-lg mb-2">Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded-md flex items-center">
                  <CreditCard className="mr-2 text-shop-primary" />
                  {paymentMethod}
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="font-medium text-lg mb-2">Order Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <tr key={item._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img 
                                  className="h-10 w-10 rounded object-cover" 
                                  src={item.image} 
                                  alt={item.name} 
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                            {item.qty}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            ${(item.price * item.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <h3 className="font-medium text-lg mb-2">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex items-center text-sm text-gray-500">
                <ShieldCheck className="mr-2 text-shop-primary" />
                <span>Your personal data will be used to process your order and support your experience throughout this website.</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={() => setCurrentStep('payment')} 
                variant="outline"
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-shop-primary hover:bg-shop-primary/90"
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </CardFooter>
          </Card>
        );
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          {/* Checkout Steps */}
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
          
          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
