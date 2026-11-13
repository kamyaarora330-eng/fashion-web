import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ShieldAlert, 
  LogOut, 
  Package, 
  MapPin, 
  LayoutDashboard 
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar({ onOpenSearch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  
  const { items, toggleCart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'MEN', path: '/shop/men' },
    { label: 'WOMEN', path: '/shop/women' },
    { label: 'NEW ARRIVALS', path: '/shop/new-arrivals' },
    { label: 'COLLECTIONS', path: '/shop/collections' },
    { label: 'SALE', path: '/shop/sale', highlight: true },
  ];

  const handleLogout = () => {
    logout();
    setIsAccountDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#EAE6DF] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#141416] hover:text-[#C5A880] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Luxury Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#141416] group-hover:text-[#A58256] transition-colors">
                MODÉRA
              </span>
              <span className="block text-[8px] font-sans tracking-[0.4em] uppercase text-[#A58256] text-center -mt-1">
                HAUTE COUTURE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-[12px] font-medium tracking-[0.2em] transition-all duration-200 relative py-1 ${
                    link.highlight 
                      ? 'text-[#A58256] font-semibold hover:text-[#8A6332]' 
                      : isActive 
                        ? 'text-[#141416] font-bold' 
                        : 'text-[#4A4A4F] hover:text-[#141416]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A880]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons (Search, Account, Wishlist, Bag) */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#141416] hover:text-[#C5A880] transition-colors relative"
              title="Search Collections"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Icon / Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="p-2 text-[#141416] hover:text-[#C5A880] transition-colors flex items-center gap-1.5"
                  title="My Account"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden xl:inline text-xs font-medium tracking-wider max-w-[80px] truncate">
                    {user?.firstName}
                  </span>
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="p-2 text-[#141416] hover:text-[#C5A880] transition-colors"
                  title="Sign In / Register"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Account Dropdown */}
              {isAccountDropdownOpen && isAuthenticated && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-[#FAF9F5] border border-[#EAE6DF] shadow-xl rounded-none py-2 z-50 text-xs tracking-wider"
                  onMouseLeave={() => setIsAccountDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#EAE6DF] bg-[#F2EFE9]/50">
                    <p className="font-medium text-[#141416]">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-[#A58256] font-semibold hover:bg-[#EFECE6] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      ADMIN CONSOLE
                    </Link>
                  )}

                  <Link
                    to="/account"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[#38383E] hover:bg-[#EFECE6] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  
                  <Link
                    to="/account/orders"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[#38383E] hover:bg-[#EFECE6] transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    My Orders
                  </Link>

                  <Link
                    to="/track-order"
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-[#38383E] hover:bg-[#EFECE6] transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Track Shipment
                  </Link>

                  <div className="border-t border-[#EAE6DF] mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-700 hover:bg-red-50 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-[#141416] hover:text-[#C5A880] transition-colors relative"
              title="Curated Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#141416] text-[#C5A880] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <button
              onClick={() => toggleCart(true)}
              className="p-2 text-[#141416] hover:text-[#C5A880] transition-colors relative"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C5A880] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE6DF] bg-[#FAF9F5] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm tracking-[0.2em] font-medium py-1.5 ${
                  link.highlight ? 'text-[#A58256] font-bold' : 'text-[#141416]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-[#EAE6DF] pt-4 flex flex-col space-y-2">
              <Link
                to="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs tracking-widest text-[#71717A] py-1"
              >
                TRACK YOUR ORDER
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs tracking-widest text-[#A58256] font-bold py-1"
                >
                  ADMIN DASHBOARD
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

