import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cravon.driver',
  appName: 'Cravon Driver',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
