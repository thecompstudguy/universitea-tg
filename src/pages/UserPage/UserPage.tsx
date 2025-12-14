import { Avatar, Cell, List, Placeholder, Section, Text, Title } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { BrandMark } from '@/components/BrandMark/BrandMark.tsx';
import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import {
  getTeaUser,
  handleAcronym,
  teaPosts,
} from '@/data/tea.ts';
import { formatRelativeTime } from '@/helpers/time.ts';

import './UserPage.css';

export const UserPage: FC = () => {
  const { userId } = useParams();
  const user = useMemo(() => (userId ? getTeaUser(userId) : undefined), [userId]);
  const userPosts = useMemo(() => (
    user
      ? teaPosts.filter((p) => p.authorId === user.id)
      : []
  ), [user]);

  if (!user) {
    return (
      <Page>
        <Placeholder
          header="User not found"
          description="This profile may have been removed or the link is invalid."
        />
      </Page>
    );
  }

  return (
    <Page>
      <div className="user-page">
        <div className="user-page__header">
          <BrandMark/>
        </div>
        <List>
          <Section header="User">
            <Cell
              before={
                <Avatar
                  size={48}
                  acronym={handleAcronym(user.handle)}
                  style={{ backgroundColor: user.avatarColor }}
                />
              }
              subtitle="Public handle"
              after={<span className={`user-page__tier user-page__tier--${user.trustTier}`}>{user.trustTier}</span>}
              readOnly
            >
              <Title level="3">{user.handle}</Title>
            </Cell>
          </Section>
          <Section header="About">
            <Cell subtitle="Bio" readOnly multiline>
              {user.bio}
            </Cell>
            <Cell subtitle="Joined" readOnly>
              {new Date(user.joinedAt).toLocaleDateString()}
            </Cell>
          </Section>
          <Section header="Posts">
            {userPosts.length === 0 ? (
              <Cell readOnly>
                <Text>No posts yet.</Text>
              </Cell>
            ) : (
              userPosts.map((post) => (
                <Link key={post.id} to={`/post/${post.id}`}>
                  <Cell
                    subtitle={`${formatRelativeTime(new Date(post.createdAt))} • ${post.school}`}
                    multiline
                  >
                    {post.body}
                  </Cell>
                </Link>
              ))
            )}
          </Section>
        </List>
      </div>
    </Page>
  );
};
