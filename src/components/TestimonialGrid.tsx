import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const TestimonialGrid: React.FC = () => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Top Row - WhatsApp Chats & Video */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-items-center">
          {/* Akash - WhatsApp Chat */}
          <div className="w-full max-w-sm">
            <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/testimonials/akash.png"
                alt="Akash Kale testimonial - Got 32% hike"
                className="w-full h-auto"
                style={{ aspectRatio: '9/16', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Maitreyee - WhatsApp Chat */}
          <div className="w-full max-w-sm">
            <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/testimonials/maitreyee.png"
                alt="Maitreyee testimonial - UI/UX Designer at Montran"
                className="w-full h-auto"
                style={{ aspectRatio: '9/16', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Pavi - Video */}
          <div className="w-full max-w-sm">
            <div className="bg-black rounded-2xl overflow-hidden shadow-lg relative" style={{ aspectRatio: '9/16' }}>
              <video
                src="/testimonials/pavi.MP4"
                controls={playingVideo === 'pavi'}
                className="w-full h-full object-cover"
                playsInline
                preload="metadata"
                onClick={(e) => {
                  if (playingVideo !== 'pavi') {
                    e.preventDefault();
                    setPlayingVideo('pavi');
                    (e.target as HTMLVideoElement).play();
                  }
                }}
              />
              {/* Play button overlay - only show when not playing */}
              {playingVideo !== 'pavi' && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setPlayingVideo('pavi');
                    const video = document.querySelector('video[src="/testimonials/pavi.MP4"]') as HTMLVideoElement;
                    if (video) video.play();
                  }}
                >
                  <button
                    className="w-16 h-16 md:w-20 md:h-20 bg-brand-red rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    aria-label="Play Pavi's testimonial video"
                  >
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row - LinkedIn Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {/* Sheetal */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48 md:h-64 bg-gray-100">
              <img
                src="/testimonials/sheetal.png"
                alt="Sheetal Pimparwar LinkedIn profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-6 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                Sheetal Pimparwar
              </h3>
              <p className="text-gray-700 text-base md:text-lg mb-1">
                Design lead at CX100
              </p>
              <p className="text-brand-red font-semibold text-sm md:text-base">
                in 2 months
              </p>
            </div>
          </div>

          {/* Kritika */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48 md:h-64 bg-gray-100">
              <img
                src="/testimonials/kritika.png"
                alt="Kritika Singh LinkedIn profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-6 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                Kritika Singh
              </h3>
              <p className="text-gray-700 text-base md:text-lg mb-1">
                Lead UX Designer at Synduct, Germany
              </p>
              <p className="text-brand-red font-semibold text-sm md:text-base">
                in 3 months
              </p>
            </div>
          </div>

          {/* Jerin */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48 md:h-64 bg-gray-100">
              <img
                src="/testimonials/jerin.png"
                alt="Jerin John LinkedIn profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 md:p-6 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                Jerin John
              </h3>
              <p className="text-gray-700 text-base md:text-lg mb-1">
                Sr. Product Designer at CGI
              </p>
              <p className="text-brand-red font-semibold text-sm md:text-base">
                in 1.5 months
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/success-stories"
            className="text-brand-red hover:text-red-600 font-semibold text-xl inline-flex items-center gap-2"
          >
            See all success stories &gt;
          </Link>
        </div>
      </div>
    </section>
  );
};
