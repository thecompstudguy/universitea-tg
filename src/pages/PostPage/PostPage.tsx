import { Avatar, Badge, Cell, FixedLayout, IconButton, Input, List, Placeholder, Section, Text } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BrandMark } from '@/components/BrandMark/BrandMark.tsx';
import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import {
  getTeaComments,
  getTeaPost,
  getTeaUser,
  handleAcronym,
} from '@/data/tea.ts';
import { formatRelativeTime } from '@/helpers/time.ts';

import './PostPage.css';

function SendIcon() {
  return (
    <svg
      className="post-page__send"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 11.5 21 3l-8.5 18-2.5-7L3 11.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const PostPage: FC = () => {
  const { postId } = useParams();
  const post = useMemo(() => (postId ? getTeaPost(postId) : undefined), [postId]);
  const author = useMemo(() => (post ? getTeaUser(post.authorId) : undefined), [post]);

  const baseComments = useMemo(() => (post ? getTeaComments(post.id) : []), [post]);
  const [extraComments, setExtraComments] = useState<typeof baseComments>([]);
  const [draft, setDraft] = useState('');

  const comments = useMemo(() => [...baseComments, ...extraComments], [baseComments, extraComments]);

  if (!post || !author) {
    return (
      <Page>
        <Placeholder
          header="Post not found"
          description="This post may have been removed or the link is invalid."
        />
      </Page>
    );
  }

  const createdAt = formatRelativeTime(new Date(post.createdAt));
  const isVerified = author.trustTier === 'verified';

  return (
    <Page>
      <div className="post-page">
        <div className="post-page__header">
          <BrandMark/>
        </div>
        <List>
          <Section header="Post">
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
                <div className="post-page__after">
                  {isVerified && (
                    <span className="post-page__trust post-page__trust--verified">
                      VERIFIED
                    </span>
                  )}
                  <Badge type="number" className="post-page__badge">
                    {comments.length}
                  </Badge>
                </div>
              }
              multiline
            >
              {post.body}
            </Cell>
            <Link to={`/user/${author.id}`}>
              <Cell subtitle="View user details">About {author.handle}</Cell>
            </Link>
          </Section>
          <Section header="Comments">
            {comments.length === 0 ? (
              <Cell readOnly>
                <Text>No comments yet. Be the first.</Text>
              </Cell>
            ) : (
              comments.map((comment) => {
                const commentAuthor = getTeaUser(comment.authorId);
                const commentTime = formatRelativeTime(new Date(comment.createdAt));

                if (!commentAuthor) return null;

                return (
                  <Cell
                    key={comment.id}
                    before={
                      <Avatar
                        size={40}
                        acronym={handleAcronym(commentAuthor.handle)}
                        style={{ backgroundColor: commentAuthor.avatarColor }}
                      />
                    }
                    subtitle={`${commentAuthor.handle} • ${commentTime}`}
                    multiline
                    readOnly
                  >
                    {comment.body}
                  </Cell>
                );
              })
            )}
          </Section>
        </List>
        <FixedLayout vertical="bottom" className="post-page__composer">
          <Input
            header="Add a comment"
            placeholder="Keep it safe. No names, no doxxing."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            after={
              <IconButton
                size="m"
                mode="bezeled"
                disabled={!draft.trim()}
                aria-label="Send comment"
                onClick={() => {
                  const body = draft.trim();
                  if (!body) return;

                  setExtraComments((prev) => [
                    ...prev,
                    {
                      id: `local-${Date.now()}`,
                      postId: post.id,
                      authorId: 'u1',
                      createdAt: new Date().toISOString(),
                      body,
                    },
                  ]);
                  setDraft('');
                }}
              >
                <SendIcon/>
              </IconButton>
            }
          />
        </FixedLayout>
      </div>
    </Page>
  );
};
