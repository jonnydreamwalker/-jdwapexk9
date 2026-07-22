# JonnyDreamwalker Apex K9 Supply

**Proprietary storefront.** Not open source. Not for sale as a template.

Veteran-owned dog gear — Florida warehouse pattern shared with Apex Herp.

## Structure (modular)

```
assets/js/site-config.js   → brand name, categories, API base, cart key
assets/js/nav-shell.js     → menu, cart, mobile
assets/js/apex-bridge.js   → live catalog from ApexFreePort
assets/css/style.css       → brand styles + frost dropdown
services/*.html            → thin category pages (data-category drives feed)
```

Edit **site-config.js** first when branding or categories change.

## ApexFreePort on same EC2

You can run a second node process for K9 inventory:

```bash
# example — separate data dir + port
PORT=3001 DATA_DIR=~/apexfreeport-k9 node server.js
```

Point `APEX_API` in `site-config.js` / bridge at that origin (or path-based tenant later).

## License

See [LICENSE](LICENSE) — All Rights Reserved.
