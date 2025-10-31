import React from 'react';
import { Button } from './ui/Button';

interface CTAProps {
  onClick: () => void;
  text?: string;
  variant?: 'primary' | 'secondary';
}

export const CTA: React.FC<CTAProps> = ({ 
  onClick, 
  text = "Get Started",
  variant = "primary" 
}) => {
  return (
    <div className="text-center">
      <Button
        onClick={onClick}
        variant={variant}
        size="lg"
        className="shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {text}
      </Button>
    </div>
  );
};