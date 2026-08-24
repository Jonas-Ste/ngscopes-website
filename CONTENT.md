# Editing the content

Everything here is plain HTML. You need a text editor and nothing else.

```bash
grep -rn "TODO" --include="*.html" .
```

> This repository is public — it has to be, for GitHub Pages on a free
> account. Keep anything you would not want a competitor, a journalist or a
> Abmahnanwalt to read out of it. Open items, legal assessments and reasoning
> about private data live in `NOTES-private.md`, which is not committed.

---

## 1. The contact form

### How it behaves right now

The visitor fills in the form and presses *Send message*. Their own email
program opens with the message already composed and addressed to
`contactform@ngscopes.com`; they press send themselves.

Nothing is transmitted in the background, no third party is involved, and the
privacy policy stays as short as it is. The trade-off: a visitor without a
configured mail program sees nothing happen — which is why the email address
is also printed next to the form.

### Switching on real background sending

GitHub Pages serves static files and cannot send email. A form that submits
silently therefore needs an external service that receives the submission and
forwards it to you by email — for example Formspree, Web3Forms or Formsubmit.
All of them work the same way: you register, you get an endpoint URL.

Then, in `assets/js/main.js`, near the top:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxx';
```

That single line is the whole switch — the form markup does not change.

**What has to happen alongside it, because this is personal data:**

1. **Conclude a data processing agreement (AVV / DPA)** with the provider.
   All the established ones offer one; you usually accept it in the account
   settings.
2. **Prefer an EU-hosted provider.** With a US provider you additionally rely
   on standard contractual clauses and have to say so in the privacy policy.
3. **Update `privacy.html` § 6.** The section currently describes the
   mailto behaviour. Directly underneath it, in an HTML comment, is the
   alternative wording for a real endpoint — swap them and fill in the
   provider's name and address.
4. **Test what happens when it fails.** The form already falls back to a
   readable error with your email address if the request does not go through.

The honeypot field (`website`) in the form catches most spam bots. Do not
remove it.

---

## 2. Publishing the careers page

`careers.html` and `careers/_template.html` are finished but deliberately out
of circulation: unlinked, `noindex`, excluded from `sitemap.xml` and blocked in
`robots.txt`.

To publish:

1. Delete the `<meta name="robots" content="noindex">` line in `careers.html`.
2. Add a Careers link to `tools/partials/header.html` and
   `tools/partials/footer.html`, then run `./tools/sync-partials.sh`.
3. Un-comment the recruiting block in `index.html`.
4. Add `/careers.html` to `sitemap.xml` and delete the two `Disallow` lines in
   `robots.txt`.
5. Fill in the actual positions — see the instructions inside
   `careers/_template.html`.

Note that `privacy.html` § 8 already covers applicant data, so that part is
ready.

---

## 3. When the company is entered in the register

The company currently appears as **NGScopes GmbH i.G.** Once the HRB number
is issued:

1. Replace `NGScopes GmbH i.G.` with `NGScopes GmbH` in `imprint.html`,
   `privacy.html`, `contact.html` and `tools/partials/footer.html`, then run
   `./tools/sync-partials.sh`.
2. In `imprint.html`, un-comment the *Register entry* and *VAT identification
   number* sections and fill them in. Both are mandatory under § 5 DDG once
   they exist.

```bash
grep -rn "i.G." --include="*.html" .
```

---

## 4. Changing colours or fonts

All colours live in the `:root` block at the top of `assets/css/style.css`.
Change `--accent` and the whole site follows.

---

## 5. If you add content about the technology

The site deliberately says nothing beyond "Lightweight Through-the-Scope
Robotics for Endoscopy", which is why it carries no development-stage
disclaimer. The moment you describe the product, that changes: the technology
is preclinical, has no CE marking and no FDA clearance, and may not be
presented as available or clinically proven.

| Write this | Not this |
|---|---|
| "designed to …" | "improves …" |
| "we are investigating whether …" | "enables surgeons to …" |
| "in preclinical development" | "our product for the clinic" |
| "aims to reduce …" | "reduces …" |

Describe the engineering. Describe the intent. Do not describe outcomes.

The disclaimer that used to sit in the footer, ready to paste back in:

> NGScopes' technology is under development and is being evaluated in preclinical
> research. It is not a certified medical device, it has no CE marking and no FDA
> clearance, and it is not available for sale or for use in patient care. Nothing
> on this website constitutes medical advice or a claim regarding clinical
> performance.

---
