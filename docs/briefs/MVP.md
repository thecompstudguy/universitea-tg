# UniversiTEA — MVP

![UniversiTEA banner](https://assets.universitea.shop/banner-logo.png)

# UniversiTEA — MVP Definition (v0.1)

## 1. Purpose

UniversiTEA is an **invite-only social space** designed to explore whether **controlled identity, optional verification, and selective anonymity** can enable candid yet accountable sharing (“tea”) within a defined community.

This MVP exists to validate **behavior**, not scale, virality, or monetization.

---

## 2. Core Hypotheses

The MVP tests the following:

1. Users are more willing to share sensitive content when:
   - Access is gated
   - Visibility can be restricted
2. Verification-based visibility changes posting and viewing behavior
3. Optional anonymity lowers friction **without destroying trust**
4. Manual + AI moderation is sufficient at small scale

If these fail, the product premise fails.

---

## 3. Target Users

**Included**
- Invited users
- Verified and non-verified users
- Users willing to post under identity or anonymously

**Explicitly Excluded (for MVP)**
- Public users
- Search engine discovery
- Cross-school/global communities

---

## 4. Non-Goals (Out of Scope)

The following must **not block MVP launch**:

- Monetization
- Reputation / karma systems
- Likes, reactions, or upvotes
- DMs or private messaging
- Advanced analytics dashboards
- Growth loops or referrals beyond invites
- Native mobile apps

If implemented, they are considered scope creep.

---

## 5. User States

Each user has exactly one state:

- **Unverified**
- **Verified**
- **Suspended / Banned**

No levels, no scores, no reputation.

---

## 6. First-Time vs Returning User Flow

First-time users are guided through **profile setup and optional verification**.  
Returning users bypass onboarding.

### Diagram — First-Time vs Non-First-Time User

![First Time vs Non First Time User](https://assets.universitea.shop/first-time-vs-non-first-time-user.png)

---

## 7. Posting a Tea

### Rules
- All posts originate from **My Drafts & Posts**
- Posting requires verification
- Users may:
  - Save as draft
  - Post immediately
  - Post anonymously
- Posts may be:
  - Visible to all users
  - Visible to verified users only

### Moderation
- AI moderation runs **before publishing**
- Failed moderation:
  - Post is saved as draft
  - User is notified
- Passed moderation:
  - Post appears on Tea Feed

### Diagram — Posting a Tea

![Posting a Tea](https://assets.universitea.shop/posting-a-tea.png)

---

## 8. Viewing the Tea Feed

### Rules
- All users see the same feed structure
- Verified-only teas:
  - **Fully visible** to verified users
  - **Blurred** for non-verified users
- Metadata (author, timestamp) remains visible unless anonymous

### Diagram — Viewing Tea Feed

![Viewing Tea Feed](https://assets.universitea.shop/viewing-a-tea-on-the-feed.png)

---

## 9. Viewing & Commenting on a Tea

### Dedicated Tea Page
- Clicking a tea opens a dedicated page
- Entire tea content is shown based on verification rules
- **All users can see comments**

### Commenting Rules
- AI moderation applies to all comments
- AI explicitly checks for:
  - Toxicity
  - Copy-pasted content from the tea itself
- If copied content is detected:
  - Comment is rejected
  - Comment is not published

### Diagram — Viewing & Commenting on Tea

![Viewing and Commenting Tea](https://assets.universitea.shop/viewing-and-commenting-tea.png)

---

## 10. Viewing a User Profile

### Profile View Includes
- Profile picture
- Username
- List of teas posted **non-anonymously**

### Exclusions
- Anonymous teas **never appear** on profile pages
- Verified-only visibility rules still apply:
  - Blurred for non-verified users
  - Fully visible for verified users

### Diagram — Viewing a Profile

![Viewing Profile](https://assets.universitea.shop/viewing-profile.png)

---

## 11. Anonymity Rules (MVP)

- Anonymous posts:
  - Do not show username or profile
  - Do not link back to user profile
  - Do not appear in profile views
- Backend may retain linkage for moderation/admin only
- No UI path exists to “reveal” anonymous authors

---

## 12. Moderation & Safety (MVP Level)

- AI moderation for:
  - Posts
  - Comments
- Manual admin actions:
  - Hide post
  - Suspend user
  - Remove content
- Rate limits on:
  - Posting
  - Commenting

No automated bans in MVP.

---

## 13. Success Criteria

The MVP is successful if:

- ≥ 30% of invited users post at least once
- ≥ 50% of users return within 7 days
- Moderation load is manageable manually
- No severe abuse forces shutdown

Failure = reassessment, not iteration.

---

## 14. Hard Launch Criteria

Do **not** launch unless:

- Invite enforcement works
- Verification gating works
- Anonymous posts do not leak identity
- Admin can remove content and users
- Kill switch is available

---

## 15. Kill Switch (Non-Negotiable)

At any time, admins must be able to:

- Disable posting
- Disable commenting
- Make the app read-only

---

## 16. Versioning

- MVP Version: **v0.1**
- Status: Draft / In Progress
- Owner: UniversiTEA Core

---

## 17. Explicitly Deferred Questions

To be answered **only after MVP validation**:

- Should verification be mandatory?
- Should teas expire?
- Should anonymous posting be restricted?
- Should visibility defaults change?

These must not be solved prematurely.
