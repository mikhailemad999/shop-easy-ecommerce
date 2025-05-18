
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Rating from '@/components/products/Rating';
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getProductById, createProductReview } from '@/services/api';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Truck, ShieldCheck, RotateCcw, AlertCircle, Check } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | undefined>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
  };
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user) return;
    
    if (rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    
    try {
      setReviewSubmitting(true);
      await createProductReview(id, { rating, comment }, user);
      
      // Refresh product to show the new review
      const updatedProduct = await getProductById(id);
      setProduct(updatedProduct);
      
      // Reset form
      setRating(0);
      setComment('');
      
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
        duration: 3000,
      });
      
      setReviewSubmitting(false);
      setReviewError(undefined);
    } catch (err) {
      setReviewError('Failed to submit review');
      setReviewSubmitting(false);
      console.error('Error submitting review:', err);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 animate-pulse">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse mt-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full animate-pulse mt-6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="mr-2" />
            {error || 'Product not found'}
          </div>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-shop-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-shop-primary">Products</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="flex items-center">
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-shop-primary">
                ${product.price.toFixed(2)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                product.countInStock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="border-t border-b py-4">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {product.countInStock > 0 && (
              <div className="flex items-center">
                <label htmlFor="qty" className="mr-3">Quantity:</label>
                <Select value={qty.toString()} onValueChange={(val) => setQty(Number(val))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(Math.min(product.countInStock, 10))].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              onClick={handleAddToCart} 
              disabled={product.countInStock === 0} 
              className="w-full bg-shop-primary hover:bg-shop-primary/90 h-12 text-lg"
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            
            {/* Shipping and Returns */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center">
                <Truck className="mr-2 text-shop-primary" size={16} />
                <span className="text-sm">Free shipping over $50</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="mr-2 text-shop-primary" size={16} />
                <span className="text-sm">30-day returns</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="mr-2 text-shop-primary" size={16} />
                <span className="text-sm">Secure checkout</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 text-shop-primary" size={16} />
                <span className="text-sm">Quality guaranteed</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.numReviews})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="p-6 bg-white border rounded-b-lg">
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="p-6 bg-white border rounded-b-lg">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Brand</td>
                  <td className="py-2">{product.brand}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Category</td>
                  <td className="py-2">{product.category}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Stock</td>
                  <td className="py-2">{product.countInStock}</td>
                </tr>
              </tbody>
            </table>
          </TabsContent>
          
          <TabsContent value="reviews" className="p-6 bg-white border rounded-b-lg">
            <div className="space-y-8">
              <h3 className="text-xl font-bold">Customer Reviews</h3>
              
              {product.reviews && product.reviews.length === 0 ? (
                <div className="bg-shop-light p-4 rounded">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews?.map((review) => (
                    <Card key={review._id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{review.name}</CardTitle>
                            <CardDescription>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Rating value={review.rating} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Review Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <form onSubmit={handleReviewSubmit}>
                      {reviewError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                          {reviewError}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <label className="block mb-2">Rating</label>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <Button
                              key={r}
                              type="button"
                              variant={rating === r ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setRating(r)}
                            >
                              {r}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block mb-2" htmlFor="comment">Comment</label>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Write your review here..."
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={reviewSubmitting}
                        className="bg-shop-primary hover:bg-shop-primary/90"
                      >
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </form>
                  ) : (
                    <div className="bg-shop-light p-4 rounded">
                      <p>
                        Please <Link to="/login" className="text-shop-primary hover:underline">sign in</Link> to write a review.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
