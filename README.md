# KINETIC — Accessible Training Session Planner

KINETIC modernizes a 2023 HTML/CSS/JavaScript gym landing page into a focused, testable front-end interaction project.

The original repository had a single hero section, Lorem Ipsum copy, dead `href="#"` navigation, an empty JavaScript file, and a mobile navigation design that could not actually open. The rebuild keeps the original Vanilla JS identity instead of converting a small static project into unnecessary framework or backend complexity.

## Why this project exists

Small front-end projects can still demonstrate engineering quality when state, accessibility, persistence, and failure recovery are treated deliberately.

KINETIC lets a user:

- filter sessions by training focus
- select up to three sessions
- see selected time and training days
- preserve the selection in localStorage
- mirror planner state into the query string
- recover safely from invalid URL or storage values

## Modernization summary

- placeholder gym hero → bounded session-planning interaction
- empty JavaScript file → explicit UI behavior and state orchestration
- dead navigation links → real section navigation
- broken mobile menu → accessible menu button with ARIA state
- invalid mobile CSS → responsive navigation state
- duplicated/ambiguous CSS variables → scoped design tokens
- external icon/font dependencies → local/system typography and CSS controls
- no state model → pure planner rules
- no persistence → sanitized localStorage state
- no shareable state → query-string serialization
- no tests → Node built-in test suite
- no CI → GitHub Actions quality gate
- no deployment workflow → GitHub Pages workflow
- two-line README → architecture, security, testing, and scope documentation

## Architecture

```text
assets/js/sessions.js
        │
        ▼
assets/js/planner.js
        ├─ focus normalization
        ├─ session filtering
        ├─ selection limit
        ├─ stale-state cleanup
        ├─ summary calculation
        └─ URL read/write
        │
        ▼
assets/js/main.js
        ├─ DOM rendering
        ├─ mobile navigation
        ├─ localStorage sync
        └─ history.replaceState()
        │
        ▼
index.html + assets/css/styles.css
```

The business rules are kept out of DOM event handlers so they can be tested without a browser.

## State flow

```text
URL query + localStorage
        ↓
normalize / sanitize
        ↓
planner state
        ↓
filter + render
        ↓
user interaction
        ↓
pure state transition
        ↓
localStorage + URL sync
```

URL state takes precedence when selected sessions are explicitly present. Otherwise a sanitized local selection is restored.

## Accessibility

- skip link to planner content
- real `button` element for mobile navigation
- `aria-expanded` and `aria-controls` on the menu toggle
- `aria-pressed` on filters and session controls
- visible keyboard focus
- semantic section and heading structure
- live planner summary updates
- reduced-motion handling
- no autoplay or forced animation

## Security and privacy

KINETIC has no backend, account system, payment flow, form submission, analytics, or remote API.

No secrets, passwords, tokens, or API keys are required.

localStorage contains only selected public session identifiers. Stored values and URL parameters are checked against the known session dataset before they affect application state.

The UI does not render user-provided HTML.

## Local development

Because the site uses ES modules, serve the repository through a local web server instead of opening `index.html` directly with `file://`.

For example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Tests

Requires Node.js 22+.

```bash
npm test
```

The suite verifies:

- focus normalization
- session filtering
- stale/invalid selection removal
- three-session maximum
- add/remove state transitions
- summary duration/day calculations
- invalid URL recovery
- preservation of unrelated query parameters

Run the full quality gate:

```bash
npm run check
```

## CI

`.github/workflows/quality.yml` runs on pull requests and pushes to `main`:

```text
JavaScript syntax check → Node test suite
```

There are no runtime npm dependencies, so CI does not need an install step.

## Deployment

The project is static and compatible with GitHub Pages.

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Run **Actions → Deploy Pages → Run workflow**.

## Scope and limitations

KINETIC intentionally does not include:

- authentication
- real memberships
- payments
- trainer booking
- backend persistence
- user accounts
- live class availability
- health or training recommendations
- framework-specific state libraries

Session content is demo data used to exercise the interaction model. It should not be interpreted as individualized fitness guidance.

## License

MIT License. See [LICENSE](./LICENSE).
