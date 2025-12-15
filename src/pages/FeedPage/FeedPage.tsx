import { Avatar, Badge, Cell, IconButton, List, Section, Text } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useState } from 'react';

import { BrandMark } from '@/components/BrandMark/BrandMark.tsx';
import { CreatePostModal, type CreatePostPayload } from '@/components/CreatePostModal/CreatePostModal.tsx';
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

function PlusIcon() {
  return (
    <svg
      className="feed-page__create-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const FeedPage: FC = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [posts, setPosts] = useState(() => [...teaPosts]);

  function onCreatePost(payload: CreatePostPayload) {
    const body = payload.body || (payload.media.length > 0 ? 'May media.' : '');
    if (!body.trim() && payload.media.length === 0) return;

    teaPosts.unshift({
      id: `local-${Date.now()}`,
      authorId: 'u1',
      school: 'Demo University',
      createdAt: new Date().toISOString(),
      body,
      tags: ['tea'],
      upvotes: 0,
      media: payload.media.length ? payload.media : undefined,
    });

    setPosts([...teaPosts]);
  }

  return (
    <Page back={false}>
      <div className="feed-page">
        <header className="feed-page__header">
          <BrandMark/>
          <div className="feed-page__actions">
            <IconButton
              size="m"
              mode="bezeled"
              className="feed-page__create-btn"
              aria-label="Create post"
              onClick={() => setCreateOpen(true)}
            >
              <PlusIcon/>
            </IconButton>
            <Link to="/me" aria-label="Open your profile">
              <Avatar
                size={40}
                acronym="ME"
                style={{ backgroundColor: '#1b1b1b' }}
              />
            </Link>
          </div>
        </header>
        <div className="feed-page__tagline">
          <Text className="feed-page__tagline-text">
            Anonymous campus feed for tea / confessions. No names, no doxxing.
          </Text>
        </div>
        <List>
          <Section header="Feed">
            {posts.map((post) => {
              const author = teaUsersById[post.authorId];
              const commentCount = countTeaComments(post.id);
              const createdAt = formatRelativeTime(new Date(post.createdAt));
              const showVerified = author.trustTier === 'verified';

              return (
                <Link key={post.id} to={`/post/${post.id}`}>
                  <Cell
                    className="feed-page__cell"
                    before={
                      <Avatar
                        size={40}
                        acronym={handleAcronym(author.handle)}
                        style={{ backgroundColor: author.avatarColor }}
                      />
                    }
                    subtitle={(
                      <span className="feed-page__subtitle">
                        {author.handle} • {createdAt} • {post.school}
                      </span>
                    )}
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
                    <div className="feed-page__cell-content">
                      <div className="feed-page__body">{post.body}</div>
                      <div className="feed-page__meta-row feed-page__meta-row--mobile">
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
                    </div>
                  </Cell>
                </Link>
              );
            })}
          </Section>
        </List>
        <CreatePostModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreate={onCreatePost}
        />
        <MainTabbar active="feed"/>
      </div>
    </Page>
  );
};
