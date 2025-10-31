import React from 'react';
import { content } from '../config/content';

export const TestimonialGrid: React.FC = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {content.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* LinkedIn Screenshot */}
              <div className="relative h-64 bg-gray-100">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} LinkedIn profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7677EA&color=fff&size=400`;
                  }}
                />
              </div>
              
              {/* Text Content */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {testimonial.name}
                </h3>
                <p className="text-gray-700 text-lg mb-1">
                  {testimonial.role}
                </p>
                <p className="text-brand-red font-semibold text-base">
                  {testimonial.duration}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          
            <a href="https://senja.io/p/expwave-experiencewave/7kRIxt1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-red hover:text-red-600 font-semibold text-xl inline-flex items-center gap-2">
            See all Senja testimonials &gt;
          </a>
        </div>
      </div>
    </section>
  );
};