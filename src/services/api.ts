
import { Product, Review, User, Order } from '@/types';

// Mock product data
const products: Product[] = [
  {
    _id: "1",
    name: "Wireless Bluetooth Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500",
    description: "Experience premium sound quality with these comfortable over-ear headphones. Features active noise cancellation and 30-hour battery life.",
    brand: "AudioTech",
    category: "Electronics",
    price: 89.99,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
    reviews: [
      {
        _id: "r1",
        name: "John Doe",
        rating: 4,
        comment: "Great sound quality, very comfortable for long listening sessions.",
        user: "u1",
        createdAt: "2023-01-15T08:30:00Z"
      }
    ]
  },
  {
    _id: "2",
    name: "Premium Smartphone",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?q=80&w=500",
    description: "Latest model with high-resolution display, advanced camera system, and all-day battery life.",
    brand: "TechGiant",
    category: "Electronics",
    price: 799.99,
    countInStock: 7,
    rating: 4.8,
    numReviews: 8,
    reviews: []
  },
  {
    _id: "3",
    name: "Ergonomic Office Chair",
    image: "https://images.unsplash.com/photo-1596162954151-cdcb4c0f70a8?q=80&w=500",
    description: "Designed for comfort during long work sessions, with adjustable lumbar support and breathable mesh back.",
    brand: "ComfortPlus",
    category: "Furniture",
    price: 199.99,
    countInStock: 5,
    rating: 4.3,
    numReviews: 6,
    reviews: []
  },
  {
    _id: "4",
    name: "Professional Blender",
    image: "https://images.unsplash.com/photo-1570222094714-d942d004ae34?q=80&w=500",
    description: "High-performance 1200W blender with multiple speed settings perfect for smoothies, soups, and more.",
    brand: "KitchenPro",
    category: "Kitchen",
    price: 149.99,
    countInStock: 11,
    rating: 4.6,
    numReviews: 9,
    reviews: []
  },
  {
    _id: "5",
    name: "Fitness Smartwatch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500",
    description: "Track your health and fitness with heart rate monitoring, GPS, and 7-day battery life.",
    brand: "FitTech",
    category: "Wearables",
    price: 129.99,
    countInStock: 6,
    rating: 4.7,
    numReviews: 14,
    reviews: []
  },
  {
    _id: "6",
    name: "Portable External SSD",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=500",
    description: "Ultra-fast 1TB external SSD with USB-C connectivity for quick file transfers.",
    brand: "DataStore",
    category: "Electronics",
    price: 159.99,
    countInStock: 8,
    rating: 4.4,
    numReviews: 7,
    reviews: []
  }
];

// Mock orders
const orders: Order[] = [];

// Helper function to simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Product APIs
export const getProducts = async (keyword = ''): Promise<Product[]> => {
  await delay();
  if (keyword) {
    const filteredProducts = products.filter(
      p => p.name.toLowerCase().includes(keyword.toLowerCase()) || 
           p.description.toLowerCase().includes(keyword.toLowerCase())
    );
    return filteredProducts;
  }
  return [...products];
};

export const getProductById = async (id: string): Promise<Product> => {
  await delay();
  const product = products.find(p => p._id === id);
  if (!product) {
    throw new Error('Product not found');
  }
  return { ...product };
};

export const createProductReview = async (
  productId: string,
  review: { rating: number; comment: string },
  user: User
): Promise<void> => {
  await delay();
  const product = products.find(p => p._id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  const newReview: Review = {
    _id: `r${Date.now()}`,
    name: user.name,
    rating: review.rating,
    comment: review.comment,
    user: user.id,
    createdAt: new Date().toISOString()
  };
  
  if (!product.reviews) {
    product.reviews = [];
  }
  
  product.reviews.push(newReview);
  
  // Update product rating
  product.rating = product.reviews.reduce((sum, item) => sum + item.rating, 0) / product.reviews.length;
  product.numReviews = product.reviews.length;
};

// Order APIs
export const createOrder = async (orderData: Omit<Order, '_id' | 'createdAt'>): Promise<Order> => {
  await delay();
  
  // Update product stock (in a real app this would be an atomic transaction)
  orderData.orderItems.forEach(item => {
    const product = products.find(p => p._id === item._id);
    if (product) {
      product.countInStock -= item.qty;
    }
  });
  
  const newOrder: Order = {
    ...orderData,
    _id: `order${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  return newOrder;
};

export const getOrderById = async (id: string): Promise<Order> => {
  await delay();
  const order = orders.find(o => o._id === id);
  if (!order) {
    throw new Error('Order not found');
  }
  return { ...order };
};

export const updateOrderToPaid = async (id: string): Promise<Order> => {
  await delay();
  const order = orders.find(o => o._id === id);
  if (!order) {
    throw new Error('Order not found');
  }
  
  order.isPaid = true;
  order.paidAt = new Date().toISOString();
  
  return { ...order };
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  await delay();
  return orders.filter(o => o.user?.id === userId).map(order => ({ ...order }));
};

export const getAllOrders = async (): Promise<Order[]> => {
  await delay();
  return orders.map(order => ({ ...order }));
};

export const updateOrderToDelivered = async (id: string): Promise<Order> => {
  await delay();
  const order = orders.find(o => o._id === id);
  if (!order) {
    throw new Error('Order not found');
  }
  
  order.isDelivered = true;
  order.deliveredAt = new Date().toISOString();
  
  return { ...order };
};
