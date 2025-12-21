import { Avatar, Cell, List, Placeholder, Section, Text, Title } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useMemo } from 'react';
import { initData, useSignal } from '@tma.js/sdk-react';

import { BrandMark } from '@/components/BrandMark/BrandMark.tsx';
import { Link } from '@/components/Link/Link.tsx';
import { MainTabbar } from '@/components/MainTabbar/MainTabbar.tsx';
import { Page } from '@/components/Page.tsx';
import { teaPosts } from '@/data/tea.ts';

import './ProfilePage.css';

function anonHandleFromTelegramId(id: number | undefined): string {
  if (!id) return 'Anon';
  const suffix = String(id % 10_000).padStart(4, '0');
  return `Anon-${suffix}`;
}

export const ProfilePage: FC = () => {
  const initDataState = useSignal(initData.state);

  const telegramUser = initDataState?.user;
  const anonHandle = useMemo(() => anonHandleFromTelegramId(telegramUser?.id), [telegramUser?.id]);
  const meAvatarProps = telegramUser?.photo_url
    ? { src: telegramUser.photo_url, alt: telegramUser.first_name || 'Me' }
    : { acronym: 'ME', style: { backgroundColor: '#1b1b1b' } };

  const postCount = teaPosts.length;

  if (!initDataState) {
    return (
      <Page back={false}>
        <Placeholder
          header="Profile"
          description="Open this Mini App inside Telegram to see your account details."
        />
      </Page>
    );
  }

  return (
    <Page back={false}>
      <div className="profile-page">
        <header className="profile-page__header">
          <BrandMark/>
          <Avatar
            size={40}
            {...meAvatarProps}
            className="profile-page__me-avatar"
          />
        </header>
        <List>
          <Section header="Your identity (inside UniversiTEA)">
            <Cell
              before={(
                <Avatar
                  size={48}
                  {...meAvatarProps}
                  style={meAvatarProps.src ? undefined : { backgroundColor: '#FF9000' }}
                />
              )}
              subtitle="Pseudonymous handle"
              readOnly
            >
              <Title level="3">{anonHandle}</Title>
            </Cell>
            <Cell subtitle="School" readOnly>
              Demo University
            </Cell>
            <Cell subtitle="Posts (demo)" readOnly>
              {postCount}
            </Cell>
          </Section>
          <Section header="Telegram account (visible to you)" footer="These details come from Telegram init data.">
            {!telegramUser ? (
              <Cell readOnly>
                <Text>No Telegram user object provided.</Text>
              </Cell>
            ) : (
              <>
                <Cell subtitle="Name" readOnly>
                  {[telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ')}
                </Cell>
                <Cell subtitle="Username" readOnly>
                  {telegramUser.username ? `@${telegramUser.username}` : '—'}
                </Cell>
                <Cell subtitle="Telegram user id" readOnly>
                  {telegramUser.id}
                </Cell>
              </>
            )}
          </Section>
          <Section header="Developer">
            <Link to="/dev">
              <Cell subtitle="Template/debug pages">Dev menu</Cell>
            </Link>
          </Section>
        </List>
        <MainTabbar active="me"/>
      </div>
    </Page>
  );
};
