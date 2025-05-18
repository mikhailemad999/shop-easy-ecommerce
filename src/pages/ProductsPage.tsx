import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductList from '@/components/products/ProductList';
import { getProducts } from '@/services/api';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState(keyword);
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  // Extract unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts(keyword);
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [keyword]);
  
  useEffect(() => {
    // Apply filters and sorting
    let result = [...products];
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply price filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sort
    if (sortOption) {
      switch (sortOption) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
    }
    
    setFilteredProducts(result);
  }, [products, sortOption, priceRange, categoryFilter]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ keyword: searchTerm });
    } else {
      setSearchParams({});
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-bold mb-4">Search</h2>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit">Search</Button>
              </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-bold mb-4">Sort By</h2>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-bold mb-4">Price Range</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Min</label>
                  <Input
                    type="number"
                    min="0"
                    value={priceRange[0]}
                    onChange={(e) => 
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Max</label>
                  <Input
                    type="number"
                    min="0"
                    value={priceRange[1]}
                    onChange={(e) => 
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-bold mb-4">Categories</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all"
                    name="category"
                    checked={categoryFilter === ''}
                    onChange={() => setCategoryFilter('')}
                    className="mr-2"
                  />
                  <label htmlFor="all">All Categories</label>
                </div>
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      checked={categoryFilter === category}
                      onChange={() => setCategoryFilter(category)}
                      className="mr-2"
                    />
                    <label htmlFor={category}>{category}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} products
                  {categoryFilter && ` in ${categoryFilter}`}
                  {keyword && ` for "${keyword}"`}
                </p>
              </div>
            </div>
          
            <ProductList products={filteredProducts} loading={loading} error={error} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
