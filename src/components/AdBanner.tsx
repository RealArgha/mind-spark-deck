
import React, { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  className?: string;
}

const AdBanner = ({ slot, className = '' }: AdBannerProps) => {
  useEffect(() => {
    try {
      // Load Google AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
      
      // Push ad after script loads
      setTimeout(() => {
        if (window.adsbygoogle) {
          (window.adsbygoogle as any[]).push({});
        }
      }, 100);
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Extend window type for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdBanner;
