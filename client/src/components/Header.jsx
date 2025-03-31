import React, { useState } from 'react';
import CartIcon from './CartIcon';
import { Link } from 'react-router-dom';

const Header = () => {
  // Used to hide the icons on the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-50 shadow-md z-50">
      <div className="container mx-auto px-3 flex items-center justify-between">
        {/* Hamburger Menu Icon - Visible on lg and smaller */}
        <button
          className="lg:hidden text-gray-700 text-3xl focus:outline-none ml-6"
          onClick={toggleMenu}
        >
          ☰
        </button>

        {/* Navigation Links - Collapsible */}
        <nav
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } lg:flex space-x-10 absolute lg:static top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none p-4 lg:p-0`}
        >
          <Link to={'/'}>
            <button className="text-gray-700 text-lg font-semibold hover:text-blue-600 transition duration-300 relative group cursor-pointer">
              Home
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </Link>
          <Link to={'/products'}>
            <button className="text-gray-700 text-lg font-semibold hover:text-blue-600 transition duration-300 relative group  cursor-pointer">
              Product List
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </Link>
          <Link to={'/contact-us'}>
            <button className="text-gray-700 text-lg font-semibold hover:text-blue-600 transition duration-300 relative group cursor-pointer">
              Contact Us
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </Link>
        </nav>

        {/* Website Name - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-gray-900">
          SWIFT <span className="text-blue-600">MART</span>
        </div>

        {/* Cart Icon - Right */}
        <div className="relative">
          <CartIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
