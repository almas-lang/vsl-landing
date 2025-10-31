import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-brand-purple rounded">
          <img 
            src="/logo.png" 
            alt="Xperience Wave" 
            className="h-12 md:h-16" 
          />
        </Link>
      </div>
    </header>
  );
};