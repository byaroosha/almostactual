# Aroosha Sarrafi — AI Portfolio

A static, dark-and-minimal portfolio site with expressive motion. No build step, no dependencies.

## Files
- `index.html` — content & structure
- `styles.css` — all styling (theme colors live at the top in `:root`)
- `main.js` — motion: preloader, custom cursor, hero neural-net canvas, scroll reveals, magnetic buttons, project image previews

## Run it locally
Open a terminal in this folder and run:

```bash
python3 -m http.server 4321
```

Then visit **http://localhost:4321**. (Opening `index.html` directly also works, but a server is closer to production.)

## Edit your content
Everything you need to change is marked with the word `EDIT` in `index.html`:
- **Name / role** — search `EDIT`, and the `<title>` at the top
- **Location** — hero eyebrow (`Based in ____`)
- **Projects** — duplicate a `<li class="project ...">` block for each one. Change the title, tags, year, description, and `data-img` (the hover-preview image URL). Point `href` at each project's case study / repo / demo.
- **About** — bio, Focus list, Toolkit list
- **Contact** — email + social links (GitHub, LinkedIn, etc.)

## Change the look
In `styles.css`, edit the `:root` variables:
- `--accent` — the single accent color (currently violet `#7b61ff`). Change this one value to recolor the whole site.
- `--bg`, `--fg` — background and text colors.

## Deploy (free options)
- **Netlify / Vercel** — drag this folder onto their dashboard, done.
- **GitHub Pages** — push the folder to a repo, enable Pages on the `main` branch.

## Notes
- Placeholder project images load from Unsplash. Replace the `data-img` URLs with your own screenshots (drop images in the folder and use e.g. `data-img="images/project1.jpg"`).
- Respects `prefers-reduced-motion` — animations are disabled for users who ask for that.
