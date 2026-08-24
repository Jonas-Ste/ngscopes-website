# ngscopes.com

The NGScopes company website. Plain HTML, CSS and a few lines of JavaScript —
no framework, no build step, no dependencies. Every file in this repository is
served exactly as it is.

- **Live:** https://ngscopes.com
- **Hosting:** GitHub Pages
- **Domain:** registered at IONOS, DNS points at GitHub Pages

---

## Contents

| Path | What it is |
|---|---|
| `index.html` | Landing page — logo, claim, contact call to action |
| `contact.html` | Contact form and direct details |
| `imprint.html` | Imprint (§ 5 DDG / formerly § 5 TMG) |
| `privacy.html` | Privacy policy (GDPR) |
| `404.html` | Error page |
| `careers.html` | **Not published.** Complete, but unlinked and set to `noindex` |
| `careers/_template.html` | Kopiervorlage for a job posting, also unpublished |
| `assets/css/style.css` | The entire stylesheet |
| `assets/js/main.js` | Footer year, current-page marker, contact form |
| `assets/img/` | Logo variants and favicons |
| `assets/fonts/` | Inter, self-hosted (SIL OFL — see `OFL.txt`) |
| `tools/` | Optional helper for keeping nav & footer in sync |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |
| `robots.txt`, `sitemap.xml` | Search engines |

Editing instructions are in **[CONTENT.md](CONTENT.md)** — start there for the
contact form, the careers page, or the remaining placeholders.

---

## Local preview

Opening the files directly with `file://` mostly works, but a local server
behaves exactly like production:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Stop it with `Ctrl-C`.

---

## Status

**Live since 24 August 2026 at <https://ngscopes.com>.**

The domain was taken over from a repository we had no access to, using
account-level domain verification. The `CNAME` file in this repository claims
the domain; GitHub Pages reads it on every deploy. Do not delete it.

From here on, every `git push` to `main` publishes to the live site within a
minute. There is no staging environment — test locally first (see below).

## Publishing to GitHub Pages

Once, when setting the repository up:

1. Create a new repository on GitHub — suggested name: `ngscopes-website`.
   It must be **public** for GitHub Pages on a free account.

2. Push this folder to it:

```bash
git remote add origin git@github.com:YOUR-GITHUB-USERNAME/ngscopes-website.git
git branch -M main
git push -u origin main
```

3. In the repository: **Settings → Pages**
   - *Source:* "Deploy from a branch"
   - *Branch:* `main`, folder `/ (root)`
   - Save.

4. Still under **Settings → Pages**, in *Custom domain*, enter `ngscopes.com`
   and save. GitHub reads the `CNAME` file in this repository, so the field
   should already be pre-filled after the first deploy.

5. Once the DNS check passes (see below), tick **Enforce HTTPS**. The
   certificate takes a few minutes to be issued.

From then on, every `git push` to `main` publishes the site within a minute.

---

## DNS at IONOS

**Checked on 23 August 2026: the DNS is already correct and needs no
changes.** Both `ngscopes.com` and `www.ngscopes.com` resolve to all four
GitHub Pages addresses, `www` redirects to the apex, and the Let's Encrypt
certificate is valid. The switch to this repository is therefore a change of
ownership inside GitHub, not a DNS migration — it takes effect in seconds
rather than hours.

```bash
dig +short A ngscopes.com     # expect the four 185.199.*.153 addresses
```

Leave the Microsoft 365 records alone — the `v=verifydomain MS=…` TXT record
and the SPF record belong to the mail setup. The GitHub verification token
goes on its own subdomain (`_github-pages-challenge-…`) and does not touch
them.

The table below documents the target state, for the case that a record is
ever lost or the domain moves to another registrar:

| Type | Host name | Value | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 1 h |
| A | `@` | `185.199.109.153` | 1 h |
| A | `@` | `185.199.110.153` | 1 h |
| A | `@` | `185.199.111.153` | 1 h |
| CNAME | `www` | `YOUR-GITHUB-USERNAME.github.io.` | 1 h |

Four A records, all of them — GitHub serves the apex domain from four
addresses. The apex (`ngscopes.com`) cannot be a CNAME record; that is a DNS
rule, not a GitHub limitation. `www.ngscopes.com` gets the CNAME and GitHub
redirects it to the apex automatically.

Delete any old A, AAAA or CNAME records for `@` and `www` that pointed at the
previous host, otherwise the two configurations fight each other.

Check propagation:

```bash
dig +short ngscopes.com
```

You should see the four `185.199.*` addresses. Allow up to a few hours.

---

## Migrating away from the old repository

The domain is currently attached to a different GitHub repository. GitHub
allows a custom domain to be claimed by only one repository at a time, so the
order matters:

1. In the **old** repository: *Settings → Pages → Custom domain* → clear the
   field and save. If you still have access, this is the simplest route.
2. In the **new** repository: set the custom domain to `ngscopes.com`.
3. Update the DNS records at IONOS as described above.
4. Tick *Enforce HTTPS* once the certificate is issued.

### If you cannot access the old repository

You do not need it. GitHub lets you prove ownership of the domain through
DNS — something you control at IONOS — and a verified domain is reserved for
your account, which releases any other repository's claim on it.

1. <https://github.com/settings/pages> → *Add a domain* → `ngscopes.com`
2. GitHub shows a TXT record, roughly
   `_github-pages-challenge-Jonas-Ste`, with a token as its value.
3. Add that TXT record at IONOS. In the IONOS form, enter only the part
   before the domain as the host name.
4. Back on GitHub, click *Verify*.

Do this **after** the new repository is public and Pages is working, because
verification stops the old site from being served under the domain.

Verifying the domain is worth doing even if you can clear the old
repository — it permanently prevents any other GitHub account from pointing
a repository at `ngscopes.com`.

### If GitHub blocks the domain anyway

Two fallbacks, in order:

- **GitHub Support** can release a custom-domain claim manually. An abandoned
  repository with no reachable owner is a routine case for them.
- **Host somewhere other than GitHub Pages.** Cloudflare Pages, Netlify and
  Vercel all build straight from this repository, for free, with automatic
  HTTPS. GitHub's domain claim is irrelevant there, because GitHub is no
  longer serving the site. The site is plain static files with no build step,
  so any of them works without changes — point the host at the repository
  root and update DNS at IONOS to whatever that host requires.

  This adds a dependency, which is why it is the fallback and not the plan.
  But it means you are never stuck: the domain is at IONOS, the repository is
  yours, and the host in between is replaceable.

---

## Changing the navigation or footer

Every page contains the full header and footer markup — that is what makes the
site work without a build step. To change them in one place instead of six:

1. Edit `tools/partials/header.html` or `tools/partials/footer.html`.
2. Run:

```bash
./tools/sync-partials.sh
```

The script rewrites the marked blocks in every page. The `{{base}}` token
becomes empty for pages in the root and `../` for pages in `careers/`. Commit
the resulting changes as usual.

You never have to use the script — editing the pages by hand works too, as
long as you keep them consistent.

---

## Conventions worth keeping

- **No external requests.** Fonts, styles, scripts and images all come from
  this domain. That is what keeps the privacy policy short and means no cookie
  banner is required. Adding a Google Font, an embedded map, an analytics
  snippet or a form endpoint changes that — and requires updating
  `privacy.html` first.
- **The site currently says almost nothing about the technology**, which is
  why it carries no development-stage disclaimer. If you later add content
  about the product, the disclaimer has to come back: the technology is
  preclinical, has no CE marking and no FDA clearance, and may not be
  presented as available or clinically proven. The wording to paste back in
  is in CONTENT.md.
- **Every new page** needs: a `<title>`, a `<meta name="description">`, a
  `<link rel="canonical">`, and an entry in `sitemap.xml`.
