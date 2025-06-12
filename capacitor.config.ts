
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fa5aa9de3c7341469e069adc7d53b0ae',
  appName: 'mind-spark-deck',
  webDir: 'dist',
  server: {
    url: 'https://fa5aa9de-3c73-4146-9e06-9adc7d53b0ae.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;
