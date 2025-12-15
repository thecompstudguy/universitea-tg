// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css';

import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@tma.js/sdk-react';

import { Root } from '@/components/Root.tsx';
import { EnvUnsupported } from '@/components/EnvUnsupported.tsx';
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen.tsx';
import { init } from '@/init.ts';

import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts';

const MIN_LOADING_SCREEN_MS = 500;

const root = ReactDOM.createRoot(document.getElementById('root')!);

const loadingScreenStartedAt = Date.now();
root.render(<LoadingScreen/>);

try {
  const launchParams = retrieveLaunchParams();
  const { tgWebAppPlatform: platform } = launchParams;
  const debug = (launchParams.tgWebAppStartParam || '').includes('debug')
    || import.meta.env.DEV;

  // Configure all application dependencies.
  await init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
    platform,
  });

  const remainingLoadingMs = MIN_LOADING_SCREEN_MS - (Date.now() - loadingScreenStartedAt);
  if (remainingLoadingMs > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, remainingLoadingMs));
  }

  root.render(
    <StrictMode>
      <Root/>
    </StrictMode>,
  );
} catch {
  const remainingLoadingMs = MIN_LOADING_SCREEN_MS - (Date.now() - loadingScreenStartedAt);
  if (remainingLoadingMs > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, remainingLoadingMs));
  }

  root.render(<EnvUnsupported/>);
}
