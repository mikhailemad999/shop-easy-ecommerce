import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductList from '@/components/products/ProductList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts } from '@/services/api';
import { Product } from '@/types';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        setFeaturedProducts(products.slice(0, 6));
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-shop-primary to-shop-dark text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Quality Products for Every Need
            </h1>
            <p className="text-lg mb-8 text-white/80 max-w-lg">
              Discover a wide range of premium products at competitive prices. Shop now and enjoy fast shipping and exceptional customer service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-shop-accent hover:bg-shop-accent/90 text-white">
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-shop-primary">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000" 
              alt="Shopping" 
              className="rounded-lg shadow-2xl max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-shop-light p-6 rounded-lg text-center">
              <div className="bg-shop-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-shop-primary w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50. Get your products delivered right to your doorstep.</p>
            </div>
            
            <div className="bg-shop-light p-6 rounded-lg text-center">
              <div className="bg-shop-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-shop-primary w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure payment methods. We ensure your data is protected.</p>
            </div>
            
            <div className="bg-shop-light p-6 rounded-lg text-center">
              <div className="bg-shop-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="text-shop-primary w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Quality Products</h3>
              <p className="text-gray-600">All products are carefully selected to ensure the highest quality.</p>
            </div>
            
            <div className="bg-shop-light p-6 rounded-lg text-center">
              <div className="bg-shop-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="text-shop-primary w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2">Easy Returns</h3>
              <p className="text-gray-600">Not satisfied? Return within 30 days for a full refund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-shop-primary hover:text-shop-primary/80 flex items-center">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <ProductList products={featuredProducts} loading={loading} error={error} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-shop-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter to receive updates on new products, special offers, and promotions.
          </p>
          
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <Input 
              type="email" 
              placeholder="Your email address"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button className="bg-shop-accent hover:bg-shop-accent/90">Subscribe</Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
