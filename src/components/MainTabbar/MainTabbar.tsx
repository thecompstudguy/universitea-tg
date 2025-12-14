import { Tabbar } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

import { bem } from '@/css/bem.ts';

import './MainTabbar.css';

type MainTab = 'feed' | 'me';

const [b, e] = bem('main-tabbar');

function FeedIcon({ selected }: { selected: boolean }) {
  return (
    <svg
      className={e('icon', { selected })}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 7h10M7 12h10M7 17h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon({ selected }: { selected: boolean }) {
  return (
    <svg
      className={e('icon', { selected })}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const MainTabbar: FC<{ active: MainTab }> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <Tabbar className={b()}>
      <Tabbar.Item
        selected={active === 'feed'}
        text="Feed"
        onClick={() => navigate('/')}
        aria-label="Feed"
      >
        <FeedIcon selected={active === 'feed'}/>
      </Tabbar.Item>
      <Tabbar.Item
        selected={active === 'me'}
        text="Me"
        onClick={() => navigate('/me')}
        aria-label="Me"
      >
        <UserIcon selected={active === 'me'}/>
      </Tabbar.Item>
    </Tabbar>
  );
};

