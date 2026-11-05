# NEXT GEN — Model Management

Premium single-page site with a 3D runway scene (three.js), scouting info and an application form.

## Files
- `index.html`, `style.css`, `script.js`
- `images/runway.jpg`, `images/show.jpg`, `images/studio.jpg`

## Deploy on GitHub Pages
1. Create a repo and upload everything (keep the `images` folder).
2. Settings → Pages → Deploy from branch → `main` / root.

## Applications (so the owner can scout)
GitHub Pages is static, so applications are sent through Formspree (free):
1. Sign up at formspree.io and create a form.
2. In `index.html`, replace `YOUR_FORM_ID` in the form `action`.
3. The owner reads and scouts applications in the Formspree dashboard and email.

Preview locally with `python3 -m http.server` (the 3D photo panels need a server, not a double-clicked file).
