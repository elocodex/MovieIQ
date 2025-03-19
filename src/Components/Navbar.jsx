import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white/10 backdrop-blur-lg border border-white/10 shadow-lg sticky top-0 z-50 flex justify-between items-center px-6 md:px-20 py-3 md:py-4">
      <div className="py-1">
        <h1 className="text-2xl md:text-5xl font-bold tracking-tight cursor-pointer">
          <a href="/" className="text-gradient">MovieIQ</a>
          <span className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF] bg-clip-text text-transparent"></span>
        </h1>
      </div>
    </nav>
  );
};

export default Navbar;
