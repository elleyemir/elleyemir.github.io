PROFILE PHOTO
=============
Drop your professional photograph in this folder, named exactly:

    profile.jpg

Full path: public/images/profile.jpg

Recommended: square-ish or 4:5 portrait crop, at least 800x1000px, under ~400KB.
The hero renders an elegant designed placeholder (monogram + knight motif) while
this file is absent, so the site never breaks.

TIMELINE IMAGES
===============
Put timeline / achievement media (screenshots, certificates) in:

    public/images/timeline/

Then reference them from src/data/timeline.json like:

    "media": [
      { "type": "image", "src": "images/timeline/elixis-dashboard.png",
        "alt": "Elixis dashboard", "caption": "Pharmacy dashboard" }
    ]

Use paths WITHOUT a leading slash — the app prefixes them with
import.meta.env.BASE_URL so they keep working on a GitHub Pages subpath.
