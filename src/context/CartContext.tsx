
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CartItem, Product, ShippingAddress } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress | null;
  paymentMethod: string;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  saveShippingAddress: (address: ShippingAddress) => void;
  savePaymentMethod: (method: string) => void;
  cartTotal: number;
  shippingPrice: number;
  taxAmount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SHIPPING_PRICE = 10;
const TAX_RATE = 0.15; // 15%

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const { toast } = useToast();

  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    const storedShippingAddress = localStorage.getItem('shippingAddress');
    const storedPaymentMethod = localStorage.getItem('paymentMethod');
    
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing cart data from localStorage', error);
        localStorage.removeItem('cartItems');
      }
    }
    
    if (storedShippingAddress) {
      try {
        setShippingAddress(JSON.parse(storedShippingAddress));
      } catch (error) {
        console.error('Error parsing shipping address from localStorage', error);
        localStorage.removeItem('shippingAddress');
      }
    }
    
    if (storedPaymentMethod) {
      setPaymentMethod(storedPaymentMethod);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const shippingPrice = cartItems.length > 0 ? SHIPPING_PRICE : 0;
  const taxAmount = cartTotal * TAX_RATE;
  const finalTotal = cartTotal + shippingPrice + taxAmount;

  const addToCart = (product: Product, qty: number) => {
    const existingItemIndex = cartItems.findIndex(item => item._id === product._id);
    
    if (existingItemIndex !== -1) {
      // Item already exists in cart, update quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].qty += qty;
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...product, qty }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${qty}) has been added to your cart`,
      duration: 3000,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item._id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
      duration: 3000,
    });
  };

  const updateCartItemQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item._id === productId ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const saveShippingAddress = (address: ShippingAddress) => {
    setShippingAddress(address);
    localStorage.setItem('shippingAddress', JSON.stringify(address));
  };

  const savePaymentMethod = (method: string) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', method);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        clearCart,
        saveShippingAddress,
        savePaymentMethod,
        cartTotal,
        shippingPrice,
        taxAmount,
        finalTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
