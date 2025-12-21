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
  media?: TeaMedia[];
};

export type TeaMedia = {
  id: string;
  type: 'image' | 'video';
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
};

export type TeaComment = {
  id: string;
  postId: string;
  authorId: string;
  createdAt: string;
  body: string;
};

const DEMO_POSTS_COUNT = 50;
const DEMO_ADDITIONAL_USERS_COUNT = 48;
const DEMO_VERIFIED_POST_RATE = 0.14;
const DEMO_COMMENTS_MIN = 45;
const DEMO_COMMENTS_MAX = 260;

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function randomInt(rng: () => number, minInclusive: number, maxInclusive: number): number {
  const min = Math.ceil(minInclusive);
  const max = Math.floor(maxInclusive);
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

function toIso(ms: number): string {
  return new Date(ms).toISOString();
}

function randomTrustTier(rng: () => number): TeaUser['trustTier'] {
  const r = rng();
  if (r < 0.12) return 'verified';
  if (r < 0.42) return 'trusted';
  return 'new';
}

const seedUsers: Record<string, TeaUser> = {
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

const additionalUsers = (() => {
  const rng = mulberry32(hashSeed('universitea:demo-users'));
  const animals = [
    'Badger', 'Bear', 'Bee', 'Bison', 'Cat', 'Chameleon', 'Cobra', 'Crow', 'Deer', 'Dolphin',
    'Dragonfly', 'Eagle', 'Falcon', 'Fennec', 'Fox', 'Frog', 'Gecko', 'Goose', 'Hawk', 'Heron',
    'Husky', 'Ibis', 'Jaguar', 'Koala', 'Koi', 'Lynx', 'Manta', 'Mole', 'Monkey', 'Narwhal',
    'Octopus', 'Osprey', 'Otter', 'Owl', 'Panda', 'Panther', 'Parrot', 'Penguin', 'Phoenix', 'Pika',
    'Quokka', 'Rabbit', 'Raccoon', 'Raven', 'Salamander', 'Seal', 'Shark', 'Sloth', 'Sparrow', 'Stag',
    'Tiger', 'Turtle', 'Wasp', 'Wolf', 'Wombat', 'Yak', 'Zebra',
  ] as const;
  const adjectives = [
    'Chaotic', 'Chill', 'Curious', 'Sleepy', 'Speedrun', 'Overthinker', 'Freshie', 'Graduating',
    'Library', 'Canteen', 'Late', 'CR', 'Thesis', 'Exam', 'Lab', 'Org', 'Dean', 'Registrar',
  ] as const;
  const bios = [
    'Lowkey just vibing and surviving.',
    'Here for memes, not for doxxing.',
    'Keep it anonymous. Keep it kind.',
    'If it’s unsafe, i-redact.',
    'Studying? optional. Chismis? mandatory.',
    'Campus life: 10% acads, 90% coping.',
  ] as const;
  const avatarColors = [
    '#FF9000', '#FFB020', '#FF6A00', '#FFD166', '#F77F00', '#FCA311',
    '#6CBD43', '#34D399', '#60A5FA', '#A78BFA', '#FB7185',
  ] as const;

  const result: Record<string, TeaUser> = {};
  const usedHandles = new Set(Object.values(seedUsers).map((u) => u.handle));
  const now = Date.now();

  for (let i = 0; i < DEMO_ADDITIONAL_USERS_COUNT; i += 1) {
    const id = `u${Object.keys(seedUsers).length + i + 1}`;

    const baseHandle = rng() < 0.6
      ? `Anon ${pick(rng, adjectives)} ${pick(rng, animals)}`
      : `Anon ${pick(rng, animals)}`;

    let handle = baseHandle;
    let suffix = 2;
    while (usedHandles.has(handle)) {
      handle = `${baseHandle} ${suffix}`;
      suffix += 1;
      if (suffix > 99) {
        handle = `${baseHandle} ${id}`;
        break;
      }
    }
    usedHandles.add(handle);

    const joinedAt = toIso(now - randomInt(rng, 10, 365) * 24 * 60 * 60 * 1000);

    result[id] = {
      id,
      handle,
      bio: pick(rng, bios),
      trustTier: randomTrustTier(rng),
      avatarColor: pick(rng, avatarColors),
      joinedAt,
    };
  }

  return result;
})();

export const teaUsersById: Record<string, TeaUser> = {
  ...seedUsers,
  ...additionalUsers,
};

const seedPosts: TeaPost[] = [
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

const seedComments: TeaComment[] = [
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

export const teaComments: TeaComment[] = seedComments;

const seedCommentsByPostId = (() => {
  const result: Record<string, TeaComment[]> = {};
  for (const comment of seedComments) {
    (result[comment.postId] ||= []).push(comment);
  }
  return result;
})();

const commentCountByPostId = new Map<string, number>();
const commentsCache = new Map<string, TeaComment[]>();

function createDemoPostBody(rng: () => number, kind: 'confession' | 'tea' | 'life'): string {
  const places = [
    'library', 'canteen', 'hallway', 'lab', 'gym', 'parking', 'field', 'registrar',
  ] as const;
  const timeRefs = [
    'today', 'kahapon', 'this morning', 'last night', 'during class', 'after class',
  ] as const;

  if (kind === 'confession') {
    const openers = [
      'Confession: nag “quick nap” ako',
      'Confession: naka “studying” status ako',
      'Confession: nag “on the way” ako',
      'Confession: nag-commit ako sa org task',
      'Confession: nag “diet” ako',
      'Confession: nag promise ako na “one episode lang”',
      'Confession: sinabi ko “5 minutes”',
      'Confession: nag-start ako ng assignment',
      'Confession: nag “I got this” ako',
      'Confession: nag “reply later” ako',
    ] as const;
    const twists = [
      'tapos naging full sleep.',
      'pero ang totoo nagsscroll lang ako.',
      'pero naghahanap pa rin ako ng damit.',
      'tapos nakalimutan ko until deadline.',
      'pero sa canteen pa rin ako bumabagsak.',
      'tapos naging 4 episodes.',
      'tapos naging 1 hour.',
      'tapos biglang may quiz pala.',
      'tapos nagpanic ako after.',
      'tapos na-ghost ko yung group chat.',
      `sa ${pick(rng, places)} pa ako na-stuck.`,
      `nung ${pick(rng, timeRefs)} pa pala yun.`,
    ] as const;
    const closers = [
      'Sorry na.',
      'Pls tell me I’m not alone.',
      'Bukas na lang talaga…',
      'Need ko ng reset button.',
      'Send tips.',
      'Huwag niyo ko ijudge.',
      'Sana pumasa pa rin.',
    ] as const;
    return `${pick(rng, openers)} ${pick(rng, twists)} ${pick(rng, closers)}`;
  }

  if (kind === 'tea') {
    const setUps = [
      'Tea: yung groupwork daw “collab”',
      'Tea: may nagre-reply lang kapag may kailangan',
      'Tea: yung “borrow lang”',
      'Tea: may nagpo-post ng notes',
      'Tea: may nag-cheat na halata',
      'Tea: may laging “busy” pero online',
      `Tea: sa ${pick(rng, places)} may nag-issue`,
      `Tea: nung ${pick(rng, timeRefs)} may nag-plot twist`,
    ] as const;
    const punches = [
      'pero isa lang talaga gumagawa.',
      'pag ikaw, seen lang.',
      'tapos never na binalik.',
      'pero may watermark na parang NFT.',
      'tapos siya pa may lakas mang-judge.',
      'tapos pag deadline, panic mode lahat.',
      'pero pag meeting, ghost town.',
      'tapos ang ending, ikaw pa mali.',
      'tapos biglang “sorry late reply” after 3 days.',
    ] as const;
    const closers = [
      'Campus classic.',
      'Hindi ko kinaya.',
      'Ang lala.',
      'Real talk.',
      'Protect your peace.',
      'Sana may accountability.',
    ] as const;
    return `${pick(rng, setUps)}… ${pick(rng, punches)} ${pick(rng, closers)}`;
  }

  const openers = [
    'Hot take:',
    'Reminder:',
    'PSA:',
    'Lowkey:',
    'Thought:',
  ] as const;
  const thoughts = [
    'mas nakakapagod yung paghahanap ng motivation kaysa sa actual na paggawa.',
    'pahinga is part of the work. Hindi ka robot.',
    'wag i-post yung identifiable stuff. Keep it safe.',
    'sana may “undo” button sa messages and submissions.',
    `sana may quiet room sa ${pick(rng, places)} area.`,
    'okay lang maging average minsan.',
    'kung pagod ka, slow down — not quit.',
    'set boundaries kahit groupwork pa yan.',
  ] as const;
  return `${pick(rng, openers)} ${pick(rng, thoughts)}`;
}

const postTemplates: ReadonlyArray<{
  kind: 'confession' | 'tea' | 'life';
  baseTags: readonly string[];
}> = [
  { kind: 'confession', baseTags: ['confession', 'relatable'] },
  { kind: 'tea', baseTags: ['tea', 'rant'] },
  { kind: 'life', baseTags: ['acads', 'life'] },
];

function createDemoCommentBody(rng: () => number, post: TeaPost): string {
  const openers = [
    'Same.',
    'Grabe.',
    'Real talk.',
    'Ngl.',
    'Tbh.',
    'Lol.',
    'Relate.',
    'Hindi ko kinaya.',
    'Ang saket pero tawa ako.',
    'Ok but why is this so accurate.',
    'Plot twist: ako rin yan.',
  ] as const;

  const mids = [
    'Campus classic.',
    'Lowkey true.',
    'Universal experience.',
    'Protect your peace.',
    'I’m screaming.',
    'This is a sign to log off.',
    'Hydrate + breathe.',
    'One day at a time.',
    'We listen and we don’t judge.',
    'Groupwork is a social experiment.',
    'Deadline era na naman.',
    'Sana all may energy.',
  ] as const;

  const safety = [
    'No names pls.',
    'Keep it anonymous.',
    'If unsafe, i-redact.',
    'Report harm, not vibes.',
  ] as const;

  const emoji = ['😭', '💀', '🫠', '😂'] as const;

  let body: string = pick(rng, openers);
  if (rng() < 0.8) body = `${body} ${pick(rng, mids)}`;
  if (rng() < 0.25) body = `${body} ${pick(rng, safety)}`;
  if (rng() < 0.35) body = `${body} ${pick(rng, emoji)}`;

  if (post.tags.includes('tea') && rng() < 0.2) body = `${body} (tea level: ${randomInt(rng, 7, 10)}/10)`;
  if (post.tags.includes('confession') && rng() < 0.2) body = `${body} (relate: ${randomInt(rng, 70, 99)}%)`;

  return body;
}

function createDemoPosts(): TeaPost[] {
  const rng = mulberry32(hashSeed('universitea:demo-posts'));
  const now = Date.now();
  let cursorTime = now - 60 * 60 * 1000;

  const allUserIds = Object.keys(teaUsersById);
  const verifiedUserIds = allUserIds.filter((id) => teaUsersById[id]?.trustTier === 'verified');

  const posts: TeaPost[] = [...seedPosts];

  const remaining = Math.max(0, DEMO_POSTS_COUNT - seedPosts.length);
  for (let i = 0; i < remaining; i += 1) {
    const template = pick(rng, postTemplates);
    const body = createDemoPostBody(rng, template.kind);
    const extraTags = [
      'campus', 'freshie', 'thesis', 'org', 'exam', 'library', 'canteen', 'deadline', 'chill',
    ] as const;
    const tags = rng() < 0.6
      ? [...template.baseTags, pick(rng, extraTags)]
      : [...template.baseTags];

    const shouldBeVerified = verifiedUserIds.length > 0 && rng() < DEMO_VERIFIED_POST_RATE;
    const authorId = shouldBeVerified
      ? pick(rng, verifiedUserIds)
      : pick(rng, allUserIds);

    cursorTime -= randomInt(rng, 2 * 60_000, 14 * 60_000);

    posts.push({
      id: `p${seedPosts.length + i + 1}`,
      authorId,
      school: 'Demo University',
      createdAt: toIso(cursorTime),
      body,
      tags,
      upvotes: Math.round(10 + 1800 * Math.pow(rng(), 0.55)),
    });
  }

  return posts;
}

export const teaPosts: TeaPost[] = createDemoPosts();

for (const post of teaPosts) {
  const seededCount = seedCommentsByPostId[post.id]?.length ?? 0;
  const rng = mulberry32(hashSeed(`universitea:demo-comments-count:${post.id}`));
  const skewHigh = Math.pow(rng(), 0.35);
  const generatedCount = Math.round(DEMO_COMMENTS_MIN + (DEMO_COMMENTS_MAX - DEMO_COMMENTS_MIN) * skewHigh);
  commentCountByPostId.set(post.id, Math.max(seededCount, generatedCount));
}

export function getTeaPost(postId: string): TeaPost | undefined {
  return teaPosts.find((p) => p.id === postId);
}

export function getTeaUser(userId: string): TeaUser | undefined {
  return teaUsersById[userId];
}

export function getTeaComments(postId: string): TeaComment[] {
  const cached = commentsCache.get(postId);
  if (cached) return cached;

  const post = getTeaPost(postId);
  if (!post) return [];

  const base = seedCommentsByPostId[postId] ?? [];
  const targetCount = commentCountByPostId.get(postId) ?? base.length;
  if (targetCount <= base.length) {
    commentsCache.set(postId, base);
    return base;
  }

  const rng = mulberry32(hashSeed(`universitea:demo-comments:${postId}`));
  const userIds = Object.keys(teaUsersById);
  const postTime = new Date(post.createdAt).getTime();
  const now = Date.now();
  const upper = now - 10_000;
  const lower = Math.min(postTime + 60_000, upper);

  const comments: TeaComment[] = [...base];
  const remaining = targetCount - base.length;
  const timestamps: number[] = [];

  for (let i = 0; i < remaining; i += 1) {
    timestamps.push(randomInt(rng, lower, upper));
  }
  timestamps.sort((a, b) => a - b);

  for (let i = 0; i < remaining; i += 1) {
    comments.push({
      id: `cg-${postId}-${i + 1}`,
      postId,
      authorId: pick(rng, userIds),
      createdAt: toIso(timestamps[i]!),
      body: createDemoCommentBody(rng, post),
    });
  }

  commentsCache.set(postId, comments);
  return comments;
}

export function countTeaComments(postId: string): number {
  return commentCountByPostId.get(postId) ?? 0;
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
