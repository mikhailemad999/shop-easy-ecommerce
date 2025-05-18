
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateCartItemQty,
    cartTotal,
    shippingPrice,
    taxAmount,
    finalTotal
  } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <ShoppingBag size={64} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild className="bg-shop-primary hover:bg-shop-primary/90">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex py-4 items-center">
                        <div className="w-20 h-20 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        
                        <div className="ml-4 flex-grow">
                          <Link 
                            to={`/product/${item._id}`}
                            className="font-medium hover:text-shop-primary"
                          >
                            {item.name}
                          </Link>
                          <div className="text-shop-primary font-bold mt-1">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Select 
                            value={item.qty.toString()}
                            onValueChange={(val) => updateCartItemQty(item._id, Number(val))}
                          >
                            <SelectTrigger className="w-16">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(Math.min(item.countInStock, 10))].map((_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-shop-primary hover:bg-shop-primary/90 flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
