import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neonbeat.game',
  appName: 'Neon Beat',
  webDir: '.',
  server: {
    androidScheme: 'https'
  }
};

export default config;
