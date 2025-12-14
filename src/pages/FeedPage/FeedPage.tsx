import { Avatar, Badge, Cell, List, Section, Text } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { BrandMark } from '@/components/BrandMark/BrandMark.tsx';
import { Link } from '@/components/Link/Link.tsx';
import { MainTabbar } from '@/components/MainTabbar/MainTabbar.tsx';
import { Page } from '@/components/Page.tsx';
import {
  countTeaComments,
  handleAcronym,
  teaPosts,
  teaUsersById,
} from '@/data/tea.ts';
import { formatRelativeTime } from '@/helpers/time.ts';

import './FeedPage.css';

export const FeedPage: FC = () => {
  return (
    <Page back={false}>
      <div className="feed-page">
        <header className="feed-page__header">
          <BrandMark/>
          <Link to="/me" aria-label="Open your profile">
            <Avatar
              size={40}
              acronym="ME"
              style={{ backgroundColor: '#1b1b1b' }}
            />
          </Link>
        </header>
        <div className="feed-page__tagline">
          <Text className="feed-page__tagline-text">
            Anonymous campus feed for tea / confessions. No names, no doxxing.
          </Text>
        </div>
        <List>
          <Section header="Feed">
            {teaPosts.map((post) => {
              const author = teaUsersById[post.authorId];
              const commentCount = countTeaComments(post.id);
              const createdAt = formatRelativeTime(new Date(post.createdAt));
              const showVerified = author.trustTier === 'verified';

              return (
                <Link key={post.id} to={`/post/${post.id}`}>
                  <Cell
                    before={
                      <Avatar
                        size={40}
                        acronym={handleAcronym(author.handle)}
                        style={{ backgroundColor: author.avatarColor }}
                      />
                    }
                    subtitle={`${author.handle} • ${createdAt} • ${post.school}`}
                    after={
                      <div className="feed-page__after">
                        {showVerified && (
                          <span className="feed-page__trust feed-page__trust--verified">
                            VERIFIED
                          </span>
                        )}
                        <Badge
                          type="number"
                          className="feed-page__badge"
                        >
                          {commentCount}
                        </Badge>
                      </div>
                    }
                    multiline
                  >
                    {post.body}
                  </Cell>
                </Link>
              );
            })}
          </Section>
        </List>
        <MainTabbar active="feed"/>
      </div>
    </Page>
  );
};
