
import React from 'react';
import UploadSection from '@/components/UploadSection';
import MobileHeader from '@/components/MobileHeader';
import { useSubscription } from '@/hooks/useSubscription';
import AdBanner from '@/components/AdBanner';

const UploadPage = () => {
  const { subscribed, trial_active } = useSubscription();
  const showAds = !subscribed && !trial_active;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col overflow-hidden">
      <MobileHeader title="Upload Content" />
      <div className="flex-1 overflow-auto p-4">
        {showAds && (
          <div className="mb-4">
            <AdBanner slot="1111111111" className="text-center" />
          </div>
        )}
        <UploadSection />
      </div>
    </div>
  );
};

export default UploadPage;
