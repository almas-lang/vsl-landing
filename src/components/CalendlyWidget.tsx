import React, { useEffect } from 'react';

interface CalendlyWidgetProps {
  url: string;
  mode?: 'inline' | 'popup';
  onScheduled?: () => void;
}

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  url,
  mode = 'inline',
  onScheduled
}) => {
  useEffect(() => {
    console.log('📅 Loading Calendly widget...');
    
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log('✅ Calendly script loaded');
    };

    // Listen for Calendly events
    const handleCalendlyEvent = (e: MessageEvent) => {
      console.log('📨 Message received:', e.data);
      
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        console.log('🎯 Calendly event:', e.data.event);
        
        if (e.data.event === 'calendly.event_scheduled') {
          console.log('✅ BOOKING CONFIRMED!');
          onScheduled?.();
        }
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, [onScheduled]);

  if (mode === 'inline') {
    return (
      <div 
        className="calendly-inline-widget" 
        data-url={url}
        style={{ minWidth: '320px', height: '700px' }}
      />
    );
  }

  return null;
};

// Helper function to open Calendly popup
export const openCalendlyPopup = (url: string, onScheduled?: () => void) => {
  if (typeof window !== 'undefined' && (window as any).Calendly) {
    (window as any).Calendly.initPopupWidget({ url });
    
    // Listen for scheduling event
    const handleMessage = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        onScheduled?.();
        window.removeEventListener('message', handleMessage);
      }
    };
    
    window.addEventListener('message', handleMessage);
  }
};