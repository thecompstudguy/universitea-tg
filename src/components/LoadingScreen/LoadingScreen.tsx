import { AppRoot, Spinner, Text } from '@telegram-apps/telegram-ui';
import { retrieveLaunchParams } from '@tma.js/sdk-react';
import { useMemo } from 'react';

import { BrandMark } from '@/components/BrandMark/BrandMark.tsx';

import './LoadingScreen.css';

export function LoadingScreen() {
  const platform = useMemo(() => {
    try {
      return retrieveLaunchParams().tgWebAppPlatform;
    } catch {
      return 'android';
    }
  }, []);

  return (
    <AppRoot
      className="app-root"
      appearance="dark"
      platform={['macos', 'ios'].includes(platform) ? 'ios' : 'base'}
    >
      <div className="loading-screen" role="status" aria-live="polite" aria-busy="true">
        <BrandMark height={72}/>
        <Spinner size="l"/>
        <Text className="loading-screen__text">Loading…</Text>
      </div>
    </AppRoot>
  );
}
