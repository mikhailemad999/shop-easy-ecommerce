
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  LogOut,
  Package,
  Users,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/search/${searchTerm}`;
    }
  };
  
  return (
    <header className="bg-shop-primary text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-heading">
          EchoShop
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 rounded-full bg-white/10 border-none text-white placeholder:text-white/70 focus-visible:ring-white/30 pr-10"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <Search size={18} />
            </button>
          </form>
          
          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link to="/products" className="hover:text-shop-accent transition-colors">
              Products
            </Link>
            <Link to="/cart" className="relative hover:text-shop-accent transition-colors">
              <ShoppingCart />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-shop-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="hover:bg-white/10 hover:text-white text-white p-0 h-8 w-8 rounded-full"
                  >
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="w-full cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/products" className="w-full cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Products
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/orders" className="w-full cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users" className="w-full cursor-pointer">
                          <Users className="mr-2 h-4 w-4" />
                          Users
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-white/10 hover:text-white text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link to="/cart" className="relative mr-4 text-white">
            <ShoppingCart />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-shop-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <h2 className="text-2xl font-bold mb-6">Menu</h2>
                
                <form onSubmit={handleSearch} className="mb-6">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full mb-2"
                  />
                  <Button type="submit" className="w-full">Search</Button>
                </form>
                
                <nav className="space-y-4">
                  <Link to="/" className="block py-2 hover:text-shop-primary">Home</Link>
                  <Link to="/products" className="block py-2 hover:text-shop-primary">Products</Link>
                  <Link to="/cart" className="block py-2 hover:text-shop-primary">Cart</Link>
                  
                  {user ? (
                    <>
                      <div className="pt-4 border-t">
                        <p className="font-medium mb-2">My Account</p>
                        <Link to="/profile" className="block py-2 pl-4 hover:text-shop-primary">Profile</Link>
                        <Link to="/orders" className="block py-2 pl-4 hover:text-shop-primary">My Orders</Link>
                      </div>
                      
                      {user.isAdmin && (
                        <div className="pt-4 border-t">
                          <p className="font-medium mb-2">Admin</p>
                          <Link to="/admin/products" className="block py-2 pl-4 hover:text-shop-primary">Products</Link>
                          <Link to="/admin/orders" className="block py-2 pl-4 hover:text-shop-primary">Orders</Link>
                          <Link to="/admin/users" className="block py-2 pl-4 hover:text-shop-primary">Users</Link>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t">
                        <Button 
                          variant="outline" 
                          onClick={logout} 
                          className="w-full justify-start"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="pt-4 border-t">
                      <Link to="/login">
                        <Button className="w-full">Sign In</Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
