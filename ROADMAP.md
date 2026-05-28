# Photomap Roadmap

## Open decisions

### Instagram fetching — how to authenticate the fetcher  ⟶ DECISION PENDING
The site still shows 5 sample pins; real `to.colante` posts have never been fetched.
Credentials Aires shared are wrong (Instagram's own login UI rejects them — confirmed
2026-05-29). And even with a correct password, instaloader's password login is unreliable
(`"Unexpected null login result"`). The fix is a **session-based** approach, but we need to
pick which one. Reading the *public* to.colante profile works with **any** logged-in session
— it does not have to be the to.colante account.

Options (pick one path, or A as a stopgap then move to B+C):

- **A — Aires's browser session on the current GitHub Actions CI.**
  Quickest. He exports his IG session/cookies; we store it as a GitHub secret and load it in
  `fetch.py` instead of `L.login()`.
  *Fragile:* dies on his logout / "log out all devices" / password change, and — most likely —
  Instagram auto-revoking it because the session is used from a GitHub datacenter IP (location
  anomaly). Realistically needs re-export every few weeks. Also couples our pipeline to his
  personal account. (Note: him merely clearing browser cookies or closing the browser does NOT
  break it — that's local-only; the token stays valid server-side.)

- **B — Dedicated burner Instagram account.**
  Create a throwaway account, log in once, export *its* session. Decouples from Aires, you own
  the refresh cadence, and a ban hurts no real account. Still needs occasional refresh.

- **C — Run the fetch from a residential IP instead of GitHub Actions.**
  Single biggest factor in session longevity — IG trusts a consistent home IP and revokes far
  less, so a session can last months instead of days. Natural home: the **Synology NAS** (already
  runs photo-org) on a cron that fetches and commits `data.json`. More infra to set up, most durable.

**Recommended:** B + C together (burner session, run from the NAS). A is the expedient stopgap.
**Prerequisite for all:** one working session — either a correct password from Aires, or an
exported browser session from someone logged into a valid IG account.

## Backlog (smaller)
- Clear the 5 sample pins from `docs/data.json` once a real fetch works.
- `README.md` is stale (describes the old AWS/SQL/jQuery educational project) — rewrite to
  describe the current static Benfica sticker map. *(security audit INFO-I3)*
- Deferred low-priority security hardening from the 2026-05-29 audit: pin GitHub Actions to
  commit SHAs (L2); add `base-uri 'none'` / `object-src 'none'` to the CSP (L4); add a Pillow
  decompression-bomb guard in `fetch.py` (L5).
- Rotate the IG password once a working one exists (the one shared over WhatsApp is compromised
  by being in plaintext). *(audit INFO-I1)*
