import React from 'react';
import { Link } from 'react-router-dom';
import { content } from '../config/content';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-900 font-medium">{content.footer.copyright}</p>
          <p className="text-gray-600 text-sm">{content.footer.address}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Link 
              to={content.footer.links.privacy}
              className="text-brand-purple hover:text-purple-700 underline"
            >
              Privacy policy
            </Link>
            <Link 
              to={content.footer.links.terms}
              className="text-brand-purple hover:text-purple-700 underline"
            >
              Terms of Use
            </Link>
            <Link 
              to={content.footer.links.refund}
              className="text-brand-purple hover:text-purple-700 underline"
            >
              Refund policy
            </Link>
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <p>
              Write to{' '}
              <a 
                href={`mailto:${content.footer.email}`}
                className="text-brand-purple hover:text-purple-700 underline"
              >
                {content.footer.email}
              </a>
            </p>
            <p>
              Call{' '}
              <a 
                href={`tel:${content.footer.phone.replace(/\s/g, '')}`}
                className="text-brand-purple hover:text-purple-700 underline"
              >
                {content.footer.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};