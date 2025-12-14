export type TeaUser = {
  id: string;
  handle: string;
  bio: string;
  trustTier: 'new' | 'trusted' | 'verified';
  avatarColor: string;
  joinedAt: string;
};

export type TeaPost = {
  id: string;
  authorId: string;
  school: string;
  createdAt: string;
  body: string;
  tags: string[];
  upvotes: number;
};

export type TeaComment = {
  id: string;
  postId: string;
  authorId: string;
  createdAt: string;
  body: string;
};

export const teaUsersById: Record<string, TeaUser> = {
  u1: {
    id: 'u1',
    handle: 'Anon Tiger',
    bio: 'Here for the campus tea. Hindi for doxxing.',
    trustTier: 'trusted',
    avatarColor: '#FF9000',
    joinedAt: '2025-10-02T10:12:00.000Z',
  },
  u2: {
    id: 'u2',
    handle: 'Anon Owl',
    bio: 'I read receipts… and minsan syllabus.',
    trustTier: 'new',
    avatarColor: '#FFB020',
    joinedAt: '2025-11-15T03:40:00.000Z',
  },
  u3: {
    id: 'u3',
    handle: 'Anon Fox',
    bio: 'Post responsibly. Report harm, hindi vibes.',
    trustTier: 'verified',
    avatarColor: '#FF6A00',
    joinedAt: '2025-08-19T17:55:00.000Z',
  },
  u4: {
    id: 'u4',
    handle: 'Anon Koala',
    bio: 'Sleep-deprived, pero laban.',
    trustTier: 'trusted',
    avatarColor: '#FF9000',
    joinedAt: '2025-12-01T12:00:00.000Z',
  },
};

export const teaPosts: TeaPost[] = [
  {
    id: 'p1',
    authorId: 'u2',
    school: 'Demo University',
    createdAt: '2025-12-14T08:45:00.000Z',
    body: 'Confession: lagi akong “on the way” pero nasa bahay pa rin ako. Sorry na, traffic daw (kahit hindi).',
    tags: ['confession', 'relatable'],
    upvotes: 128,
  },
  {
    id: 'p2',
    authorId: 'u1',
    school: 'Demo University',
    createdAt: '2025-12-14T10:10:00.000Z',
    body: 'Tea: yung “group work” daw… pero isa lang talaga gumagawa. Yung iba, seenzone lang. 😭',
    tags: ['tea', 'rant'],
    upvotes: 231,
  },
  {
    id: 'p3',
    authorId: 'u3',
    school: 'Demo University',
    createdAt: '2025-12-14T12:30:00.000Z',
    body: 'Reminder: you can spill tea without naming full names. If identifiable, i-redact. Keep it safe, keep it fun.',
    tags: ['safety', 'mod-note'],
    upvotes: 412,
  },
  {
    id: 'p4',
    authorId: 'u4',
    school: 'Demo University',
    createdAt: '2025-12-14T14:05:00.000Z',
    body: 'Confession: nag “short nap” ako tapos naging 3 hours. Pag gising ko, may 47 missed notifs. 💀',
    tags: ['confession', 'relatable'],
    upvotes: 87,
  },
];

export const teaComments: TeaComment[] = [
  {
    id: 'c1',
    postId: 'p1',
    authorId: 'u1',
    createdAt: '2025-12-14T09:10:00.000Z',
    body: 'Grabe yung “traffic” excuse, universal talaga.',
  },
  {
    id: 'c2',
    postId: 'p1',
    authorId: 'u4',
    createdAt: '2025-12-14T09:32:00.000Z',
    body: 'Same energy: “malapit na” pero di pa naliligo.',
  },
  {
    id: 'c3',
    postId: 'p2',
    authorId: 'u2',
    createdAt: '2025-12-14T10:40:00.000Z',
    body: 'Ito yung reason bakit gusto ko na lang solo lahat.',
  },
  {
    id: 'c4',
    postId: 'p2',
    authorId: 'u3',
    createdAt: '2025-12-14T11:05:00.000Z',
    body: 'If nagiging targeting/doxxing, report agad. Keep it general please.',
  },
  {
    id: 'c5',
    postId: 'p3',
    authorId: 'u2',
    createdAt: '2025-12-14T12:44:00.000Z',
    body: 'Thanks sa reminder. Anonymous ≠ reckless.',
  },
  {
    id: 'c6',
    postId: 'p4',
    authorId: 'u1',
    createdAt: '2025-12-14T14:21:00.000Z',
    body: '3 hours nap is not “short” beh.',
  },
];

export function getTeaPost(postId: string): TeaPost | undefined {
  return teaPosts.find((p) => p.id === postId);
}

export function getTeaUser(userId: string): TeaUser | undefined {
  return teaUsersById[userId];
}

export function getTeaComments(postId: string): TeaComment[] {
  return teaComments.filter((c) => c.postId === postId);
}

export function countTeaComments(postId: string): number {
  return teaComments.reduce((acc, c) => acc + (c.postId === postId ? 1 : 0), 0);
}

export function handleAcronym(handle: string): string {
  const parts = handle
    .split(' ')
    .map((p) => p.trim())
    .filter(Boolean);

  const acronym = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .join('');

  return acronym || 'A';
}
