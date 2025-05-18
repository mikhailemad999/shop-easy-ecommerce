
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <Link to={`/product/${product._id}`} className="overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="mb-2 flex items-center">
          <div className="flex text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.numReviews})</span>
        </div>
        
        <Link to={`/product/${product._id}`} className="mb-2 hover:text-shop-primary transition-colors">
          <h3 className="font-medium line-clamp-2 h-12">{product.name}</h3>
        </Link>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-shop-primary text-lg">${product.price.toFixed(2)}</span>
            <span className={`text-xs px-2 py-1 rounded ${product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className="w-full bg-shop-primary hover:bg-shop-primary/90 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
