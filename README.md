# justinstec.github.io

Personal academic website for Justin Thomas Stec. Static HTML and CSS, no build step, no JavaScript, self-hosted fonts (Literata + Inter via Fontsource). Designed for GitHub Pages.

## Deploying (first time)

1. On github.com, signed in as **JustinStec**, create a new **public** repository named exactly `justinstec.github.io`. Do not initialize it with a README.
2. From this folder:

   ```bash
   git remote add origin git@github.com:JustinStec/justinstec.github.io.git
   git push -u origin main
   ```

   (Use `https://github.com/JustinStec/justinstec.github.io.git` if you prefer HTTPS.)
3. GitHub Pages builds user sites from the `main` branch root automatically. Within a minute or two the site is live at **https://justinstec.github.io/**. If it doesn't appear, check Settings → Pages and confirm Source is "Deploy from a branch," branch `main`, folder `/ (root)`.

The site at the root URL coexists with your existing project pages (`/metamodality`, …) — those live in their own repos and are unaffected.

## Updating

Edit the HTML, commit, push. Pages redeploys on every push to `main`. The publications lists on `research.html` and `cv.html` mirror the canonical CV (last synced: Stec_CV_Canonical_2026-10-06) — when the CV changes, change both, and regenerate `assets/Stec-CV.pdf` from the canonical docx.

## Slots left open on purpose

- **Photograph** — drop `assets/portrait.jpg`, then uncomment the `<figure>` block in `index.html`.
- **Derrida Today DOI** — printed as plain text on `cv.html` because it has not resolved yet; link it once the 19.3 issue is live.
- **Journal dashboards (NLH / ELH)** — deliberately absent from the projects page until there is a public-safe build (the full viewers expose corpus PDFs).

## Custom domain (optional, later)

1. Buy the domain (e.g. justinstec.com).
2. Add a file named `CNAME` containing exactly `justinstec.com` to this repo root.
3. At your DNS provider, add a CNAME record pointing `www` to `justinstec.github.io`, and A records for the apex per GitHub's current Pages documentation.
4. In Settings → Pages, set the custom domain and enable "Enforce HTTPS."

## Maintenance cadence

Quarterly, or when a paper changes status.
