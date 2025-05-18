
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error?: string;
}

const ProductList = ({ products, loading, error }: ProductListProps) => {
  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="product-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600 mb-4">No products found</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
