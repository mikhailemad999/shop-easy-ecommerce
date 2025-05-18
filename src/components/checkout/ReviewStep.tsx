
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
import { ShieldCheck, CreditCard } from 'lucide-react';
import { CartItem, ShippingAddress, User } from '@/types';

interface ReviewStepProps {
  user: User;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  cartItems: CartItem[];
  cartTotal: number;
  shippingPrice: number;
  taxAmount: number;
  finalTotal: number;
  onBack: () => void;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

const ReviewStep = ({ 
  user,
  shippingAddress,
  paymentMethod,
  cartItems,
  cartTotal,
  shippingPrice,
  taxAmount,
  finalTotal,
  onBack,
  onPlaceOrder,
  isSubmitting
}: ReviewStepProps) => {
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
            <p>{user.name}</p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
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
          onClick={onBack} 
          variant="outline"
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button 
          onClick={onPlaceOrder}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-shop-primary hover:bg-shop-primary/90"
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewStep;
