
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook,
  Twitter,
  Instagram,
  CreditCard,
  Truck,
  PhoneCall,
  Mail
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-shop-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">EchoShop</h3>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for quality products at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-shop-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-shop-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-shop-accent transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-shop-accent transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-shop-accent transition-colors">Products</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-shop-accent transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-shop-accent transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-shop-accent transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/orders" className="text-gray-300 hover:text-shop-accent transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-shop-accent transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-shop-accent transition-colors">Shipping Policy</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-shop-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-shop-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <PhoneCall size={18} className="mr-2 text-shop-accent" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-shop-accent" />
                <span className="text-gray-300">support@echoshop.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="font-medium mb-2">We Accept</h4>
              <div className="flex space-x-2">
                <CreditCard size={24} className="text-gray-300" />
                <span className="text-gray-300">All major credit cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} EchoShop. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-400 text-sm">
                <Truck size={16} className="mr-2" />
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
