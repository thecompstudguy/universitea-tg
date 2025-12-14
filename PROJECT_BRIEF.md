# UniversiTEA — PROJECT_BRIEF

![UniversiTEA banner](https://assets.universitea.shop/banner-logo.png)

> **Purpose of this document:** Provide a single, comprehensive “source of truth” for what UniversiTEA is, what it is not, and the key technical + policy decisions that shape the codebase.

**Author:** The CompSTUD Guy (`the.compstud.guy@universitea.shop`)

---

## 1. One‑sentence summary

**UniversiTEA is a Telegram Mini App for student‑only, school‑scoped anonymous posting and discussion (“tea” / “confessions”) with strong safety, privacy-by-design, and scalable moderation.**

---

## 2. Vision

UniversiTEA aims to create a place where students can:
- speak candidly about campus life,
- share rumors, advice, warnings, and social updates,
- without the fear of real‑name consequences,
- while still keeping communities **student‑only** and meaningfully protected against abuse.

We want the product to feel:
- fast,
- familiar (freedom-wall / anonymous campus feed energy),
- lightweight (Telegram-native experience),
- and safe enough to use without normalizing harassment or doxxing.

---

## 3. Problem statement

Students frequently want to discuss sensitive or socially risky campus topics:
- interpersonal drama, relationships, “tea,”
- safety warnings (e.g., scams, harassment patterns),
- course/department info,
- anonymous feedback or venting.

Existing options often fail because they are:
- too public / searchable,
- tied to real identity,
- easy to infiltrate (outsiders, staff/faculty, bad actors),
- poorly moderated, leading to harassment and doxxing.

---


## 3.1 Why this is better than Facebook Groups or Reddit (for student “tea”)

UniversiTEA is not trying to “replace” broad social platforms; it’s designed for a **narrower, safer, campus‑bounded use case** that Facebook Groups and Reddit struggle with:

### 3.1.1 Exclusivity (student-only by design)
- **Facebook Groups / Reddit:** membership is typically based on self-assertion (“I’m a student”), moderator discretion, or weak signals (email verification is uncommon and inconsistent).
- **UniversiTEA:** can enforce **school-scoped access** using **optional verification**, including **AI-assisted document checks** (e.g., scanning a school ID and validating it against expected formats) and/or school email domain verification.
- Optional **age gating** can be supported (e.g., “18+ verified” tier) to reduce minors in adult-themed discussions, while keeping participation anonymous to other users.

### 3.1.2 Privacy & social safety for candid discussions
- **Facebook:** real-name culture + friend graphs create strong social consequences and discourage candid posting.
- **Reddit:** anonymity exists, but communities are generally **publicly discoverable** and often **search-indexed**, which makes sensitive campus content more likely to escape the intended audience.
- **UniversiTEA:** aims for **anonymous-to-peers** posting inside **non-public, school-bounded communities** with privacy-by-design defaults.

### 3.1.3 Moderation fit for a high-risk content category
- “Tea” content is more prone to harassment, rumor escalation, and doxxing attempts.
- **UniversiTEA** is built around:
  - reporting flows that assume higher risk,
  - automated scanning/quarantine for obvious PII patterns,
  - and purpose-built moderator tooling (queues, locks, shadow-removal) rather than generic community tools.

### 3.1.4 Product ergonomics for campus use
- Telegram Mini Apps allow a lightweight, mobile-first experience without requiring a new standalone app install flow.
- Invite-based onboarding supports campus rollout strategies while limiting random drive-by accounts.


## 4. Product principles

### 4.1 Student-first
- The platform exists for students, not institutions or advertisers.
- Expect a high volume of emotionally-charged, gossip-adjacent content; design to reduce harm.

### 4.2 Privacy by design
- Collect the minimum data needed.
- Separate identity/verification data from content data whenever possible.
- Prefer short retention and non-reversible transformations.

### 4.3 Pseudonymity, not “perfect anonymity”
- Users can be anonymous to each other.
- The system must still retain enough auditability to fight abuse, fraud, and illegal content.

### 4.4 Safety over virality
- Growth features must not incentivize doxxing, brigading, or targeted harassment.
- Strong reporting + rate limiting + abuse heuristics are first-class features.

### 4.5 Ship a useful MVP
- Prioritize the smallest set of features that creates a meaningful student experience:
  - read feed, post, comment, report, basic moderation.

### 4.6 Cost-aware scalability
- Design for bursty student traffic.
- Serverless-first; cache aggressively; minimize hot partitions.

---

## 5. Target users & environments

### 5.1 Primary users
- University/college students (18+ assumed; do not rely on this assumption for legal compliance).
- Students seeking anonymous discussion inside a school-scoped community.

### 5.2 Secondary users
- Volunteer moderators (students, trusted community members).
- Administrators (platform operators).

### 5.3 Platform
- Telegram Mini App (WebApp) embedded experience.
- Users access via Telegram, often on mobile.

### 5.4 Operating constraints (Telegram WebApp)
- Front-end runs as a web app inside Telegram.
- Telegram provides user context (e.g., Telegram user identifiers and session context), but web platform constraints apply.
- You cannot rely on screenshot blocking or screenshot detection in a standard web context.
- Do not rely on IP address being directly accessible in the client (treat it as backend-observable only, if at all).

---

## 6. In-scope features

### 6.1 Content & engagement
- **Anonymous posts** within a school
- **Threaded comments**
- Reactions (optional; can be introduced post-MVP)
- Sorting: latest / trending (simple scoring)
- Basic search (optional post-MVP)

### 6.2 Community boundaries
- School-based community partition (hard boundary).
- Optional sub-communities (e.g., groups, cohorts) implemented via tags or a tree/graph model.

### 6.3 Growth & access control
- Invite-based onboarding (referral codes or invite links).
- Optional verification (see Section 9).

### 6.4 Reporting & moderation
- User reporting workflows.
- Automated detection for:
  - doxxing patterns,
  - explicit sexual content imagery,
  - harassment / hate (policy-based).
- Moderator tooling:
  - queue view,
  - actions: remove, shadow-remove, lock, warn, suspend.

### 6.5 Safety mechanics
- Rate limits for posting/commenting/reporting.
- Anti-spam: similarity detection, rapid posting heuristics.
- Sybil resistance via invite limitations and trust scoring.

### 6.6 Observability & admin
- Event/audit logging for moderation actions.
- Metrics and alarms for traffic, latency, error rates, abuse spikes.

---

## 7. Out-of-scope / non-goals

- Real-name social networking.
- Public web indexing / SEO-first distribution.
- Guaranteed legal anonymity.
- DMs between users (high abuse risk; consider later).
- Marketplace / buy-sell.
- Campus politics activism tooling (not a goal; avoid becoming an organizing platform).
- Deep personalization algorithms (keep ranking transparent and simple).
- Heavy video-first experiences (cost + moderation complexity).

---

## 8. Terminology

- **School**: Top-level community boundary (e.g., University A).
- **Group / Node**: A sub-community within a school (optional).
- **Tea / confession**: Informal anonymous gossip/discussion content (terms used interchangeably).
- **Poster handle**: Ephemeral pseudonym shown to other users (not Telegram username).
- **Trust score**: Internal metric derived from account age, verification, behavior, and reports.
- **Shadow-remove**: Content appears removed to others but still visible to author (optional tactic).
- **Moderation queue**: Items awaiting review: reports, automated flags, appeal requests.

---

## 9. Identity & verification

### 9.1 Baseline identity
- The platform sees users as **Telegram accounts** (Telegram user id as the platform identifier).
- Do not display Telegram usernames to other users by default.

### 9.2 Verification goals
- Keep communities student-only.
- Increase trust for accounts posting sensitive content.
- Prevent staff/faculty/outsiders infiltration at scale.

### 9.3 Verification modes (recommended)
- **Optional verification** with clear UX:
  - Verified users can access more features (or higher rate limits), but unverified can still participate in basic ways.
- Verification sources (choose one or more):
  - **School ID scan** (OCR extraction) + consistency checks
  - **Email verification** (school email domain) if available
  - **Photo/selfie match** if and only if required for fraud prevention

### 9.4 Data minimization rules
- Avoid storing raw ID images long-term.
- Store:
  - verification result,
  - timestamp,
  - minimal extracted fields (if absolutely necessary),
  - non-reversible hashes of identifiers (e.g., student number hash) to prevent duplicate verification.
- Separate verification storage from content storage (blast radius reduction).

### 9.5 Trust tiers
Example:
- Tier 0: New / unverified
- Tier 1: Invite-only but unverified
- Tier 2: Verified student
- Tier 3: Trusted contributor (good history)

Each tier can map to rate limits and feature access.

---

## 10. Content policy overview (high-level)

> This is a product safety brief, not legal advice.

### 10.1 Not allowed
- Doxxing (names + identifying details, addresses, phone numbers, private IDs)
- Non-consensual sexual imagery
- Explicit threats and incitement to violence
- Targeted harassment (especially repeated)
- Hate speech (policy-based)
- Illicit content (jurisdiction-dependent; enforce at platform policy level)

### 10.2 Allowed with limits
- Sexual topics as discussion (not explicit imagery)
- Gossip and rumor (but not targeted harassment and not identifying private info)
- Criticism of institutions (avoid calls for harassment)

### 10.3 Enforcement philosophy
- Focus on **harm reduction**.
- Remove identifying personal info quickly.
- Prefer “cool down” tools (locks, slow mode) during spikes.

---

## 11. Threat model (practical)

### 11.1 Likely threats
- **Doxxing attempts** in posts/comments/images.
- **Brigading**: coordinated harassment or mass-reporting.
- **Sybil attacks**: many accounts via invites.
- **Infiltration**: outsiders/staff creating accounts.
- **Extortion/blackmail** attempts using anonymous content.
- **CSAM risk** (must have zero tolerance and clear escalation playbook).

### 11.2 Defensive strategies
- Rate limit + invite throttles.
- Reputation/trust scoring.
- Automated detection + quarantine for suspicious content.
- Logging + audit trails for moderation actions.
- Strict separation of identity and content data stores.

---

## 12. System architecture (reference)

### 12.1 High-level diagram (conceptual)

Telegram Mini App (Web)  
→ API Gateway  
→ Lambda (auth, feed, post, comment, report)  
→ DynamoDB (primary)  
→ Redis/ElastiCache (cache, hot feeds, rate-limits)  
→ S3 (media) + CDN (CloudFront)  
→ Async pipeline (SNS/SQS/EventBridge) for:
  - moderation scanning,
  - notification fanout,
  - analytics aggregation.

### 12.2 Rationale
- Serverless supports bursty usage.
- DynamoDB provides high scale with careful partitioning.
- Redis enables “instant” UX (precomputed or cached feeds).
- Async moderation reduces request latency.

### 12.3 Cloud portability
- The design should remain portable to alternatives (e.g., Alibaba Cloud equivalents) by isolating provider-specific adapters.

---

## 13. Data model (conceptual)

> Final schemas live in the implementation and in IaC definitions. This section sets shared vocabulary.

### 13.1 Core entities
- **User**
  - id (Telegram user id or internal UUID)
  - created_at
  - trust_tier
  - school_id (current)
  - flags (banned/suspended)
- **School**
  - id
  - name
  - verification_methods_enabled
- **Membership**
  - user_id, school_id
  - join_method (invite/verified)
  - status
- **Invite**
  - code
  - created_by_user_id
  - school_id
  - max_uses
  - uses
  - expires_at
- **Post**
  - post_id
  - school_id
  - node_id (optional)
  - author_id (internal, not shown publicly)
  - public_handle (ephemeral or per-thread)
  - body
  - media_refs
  - created_at
  - status (active/removed/locked/shadowed)
  - score fields (reactions, replies, reports)
- **Comment**
  - comment_id
  - post_id
  - parent_comment_id (optional)
  - author_id
  - public_handle
  - body
  - created_at
  - status
- **Report**
  - report_id
  - target_type (post/comment/media/user)
  - target_id
  - reporter_user_id
  - reason
  - created_at
  - status
- **ModerationAction**
  - action_id
  - moderator_id
  - target_type / target_id
  - action (remove, lock, warn, suspend)
  - reason
  - created_at
- **VerificationAttempt**
  - attempt_id
  - user_id
  - school_id
  - method (id_scan/email/etc.)
  - result
  - created_at
  - retention_policy metadata
- **AuditLog**
  - event_id
  - actor_id
  - event_type
  - payload (redacted)
  - created_at

### 13.2 Partitioning guidance (DynamoDB)
- Partition by `school_id` for feed queries and isolation.
- Avoid hot partitions by:
  - sharding for “global feed per school” (time-bucket keys),
  - caching feed pages in Redis.
- Posts and comments should support:
  - by-school feed,
  - by-post thread fetch,
  - by-user moderation view.

---

## 14. Feed ranking (initial)

### 14.1 MVP ranking
- “Latest” = reverse chronological by school_id (+ optional node_id)
- “Trending” (simple):
  - score = weighted(replies, reactions) − weighted(reports) with time decay
  - cap contribution from a single user to reduce manipulation

### 14.2 Anti-gaming
- Throttle rapid reactions from fresh accounts.
- Discount activity from low-trust accounts.
- Detect suspicious bursts and temporarily freeze ranking updates.

---

## 15. Moderation pipeline (recommended)

### 15.1 Inline checks (synchronous)
- Basic content length validation.
- Rate limits (per user, per school).
- Known-bad keyword checks (fast).
- Link stripping / preview removal (optional).

### 15.2 Async checks (preferred)
- Text scanning:
  - doxxing patterns (phone/address/email/student numbers)
  - harassment / hate classification (policy thresholds)
- Media scanning:
  - NSFW detection
  - nudity detection
  - (Policy-dependent) violence content
- Quarantine:
  - suspicious posts go into a “pending review” state for low-trust accounts.

### 15.3 Human moderation
- Queue prioritized by:
  - severity,
  - user trust tier,
  - engagement velocity.
- Actions include:
  - remove, lock, shadow-remove,
  - warn user,
  - temporary suspension,
  - permanent ban.

### 15.4 Appeals
- Provide minimal appeal mechanism for removals/suspensions.
- Appeals are reviewed by higher-tier moderators/admins.

---

## 16. Privacy, compliance, and retention

### 16.1 Data minimization
- Do not collect data “just in case.”
- Separate:
  - content data,
  - identity/verification data,
  - analytics data.

### 16.2 Retention (defaults; adjust to legal needs)
- Posts/comments: retained until user deletion or policy removal; consider expiry options later.
- Reports & mod actions: retained longer for safety auditing.
- Verification artifacts: minimal retention; raw images should be short-lived.
- Logs: store redacted logs; avoid storing raw message bodies in logs.

### 16.3 User rights (baseline)
- Provide:
  - account deletion (at least deactivate + detach identity),
  - content removal request flow (policy-based).

### 16.4 Security basics
- Encryption in transit (TLS) and at rest.
- Secrets in Secrets Manager or equivalent.
- Least-privilege IAM.
- Signed URLs for media.
- Avoid storing sensitive PII in DynamoDB items that are broadly readable by services.

---

## 17. Monetization (policy guidance)

Monetization should not compromise student trust.

Possible paths:
- Donations / tips (with transparency)
- Light ads (careful; avoid identity leakage)
- Subscriptions (optional premium, e.g., cosmetics or extra features)

Rules:
- Never sell personal data.
- Keep verification separate from monetization (avoid pay-to-verify).
- Publish a clear policy describing what donations fund.

---

## 18. Open source strategy (if applicable)

Recommend a hybrid approach:
- **Open source**:
  - front-end shell,
  - common UI components,
  - generic moderation tooling framework,
  - infrastructure templates (sanitized).
- **Keep private** (until safe):
  - payments,
  - verification internals,
  - abuse detection thresholds,
  - sensitive operational runbooks.

Include:
- LICENSE
- CODE_OF_CONDUCT.md
- SECURITY.md (vulnerability disclosure)

---

## 19. Repository conventions

### 19.1 Suggested structure

```
/apps
  /tma-web            # Telegram Mini App front-end
  /admin-web          # Moderator/admin console (optional)
/services
  /api                # Main API (Lambda handlers)
  /moderation-worker  # Async scanning workers
  /notifications      # Push/Telegram notify logic (if used)
/infra
  /cdk or /terraform  # Infrastructure as Code
/scripts
```

### 19.2 Documentation expectations
- Every service has a README:
  - purpose,
  - environment variables,
  - local dev steps,
  - deployment notes.
- Key decisions tracked via ADRs (architecture decision records) in the repo.

---

## 20. Quality attributes (what “good” looks like)

### 20.1 Performance
- Feed loads should feel instant on mobile.
- Target:
  - P95 API latency: < 300–600ms (region dependent)
  - P95 feed render: < 1.5s on mid-tier devices

### 20.2 Reliability
- Graceful degradation when moderation systems lag.
- Queue-based systems must have backpressure and DLQs.

### 20.3 Safety
- Doxxing response time is critical:
  - automated quarantine for suspicious patterns,
  - fast removal tooling for moderators.

### 20.4 Cost
- Caching should significantly reduce DynamoDB read costs.
- Async pipelines for heavy scanning.

---

## 21. MVP definition (P0)

### 21.1 Must-have
- Telegram Mini App UI
- Join school via invite
- View school feed (latest)
- Create post
- Comment on post
- Report post/comment
- Basic moderator queue + remove content
- Rate limits + spam throttles
- Basic audit logs

### 21.2 Should-have (still MVP if time allows)
- Trending feed
- Shadow-remove
- Quarantine state for low-trust accounts
- Media uploads (images) with scanning

### 21.3 Not MVP
- Full verification pipeline (can be introduced in alpha/beta)
- Complex group tree visibility rules
- DMs

---

## 22. Roadmap (illustrative)

### Phase 0 — Prototype
- Basic feed/post/comment in a single school
- No media uploads
- Simple mod actions

### Phase 1 — Private alpha (one campus)
- Invite-based onboarding
- Reporting + mod queue
- Improved caching + ranking

### Phase 2 — Campus beta
- Optional verification
- Media support + scanning
- Trust tiers + stronger anti-spam

### Phase 3 — Multi-campus rollout
- Tooling for onboarding new schools
- Cross-campus operations dashboard
- Stronger legal/compliance posture

---

## 23. Open questions / decisions to finalize

- Verification: which methods are acceptable for the first campus?
- Group model: tags vs tree vs graph; what visibility rules are safe and intuitive?
- Handle system: per-thread pseudonyms vs per-school rotating pseudonyms.
- Moderator governance: who becomes a mod; how to prevent mod abuse?
- Content expiry: should posts auto-expire to reduce long-term harm?
- Monetization: donations vs ads vs subscription; when to introduce without harming trust?

---

## 24. How to use this brief

When implementing or reviewing changes:
- Check whether the change aligns with the principles (Section 4).
- Add/update an ADR for non-trivial architectural decisions.
- If a feature impacts safety/privacy, update the moderation policy and relevant runbooks.

---

## 25. Contact & ownership

- Maintainer(s): The CompSTUD Guy (`the.compstud.guy@universitea.shop`)
- Security contact: The CompSTUD Guy (`the.compstud.guy@universitea.shop`)
- Incident response: follow the incident response runbook (to be created)

---

**End of PROJECT_BRIEF.md**
