# Match 'n' Taste — Development Session Summary

## Project overview
A cocktail recommendation platform for cafe bars, accessed via QR code.
Customers answer a short branching quiz and get a personalised cocktail suggestion.
Bilingual: English + Greek (ΕΛ).

Live URL: https://match-n-taste.vercel.app
GitHub repo: https://github.com/GNtrazios/match-n-taste

---

## Tech stack
- **Framework:** Next.js 16.2.7 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + custom CSS variables (dark luxury theme)
- **Animations:** Framer Motion v12
- **Database:** Supabase (not yet connected — Phase 2)
- **Hosting:** Vercel (free hobby tier)
- **Node:** v26.2.0 / npm v11

---

## Current file structure
```
match-n-taste/
├── app/
│   ├── globals.css       ← custom dark theme, all component styles
│   ├── layout.tsx        ← root layout, Google Fonts (Cormorant Garamond + DM Sans)
│   └── page.tsx          ← renders <QuizEngine />
├── components/
│   └── QuizEngine.tsx    ← main component, useReducer state machine, Framer Motion
├── data/
│   ├── cocktails.ts      ← 10 cocktails with bilingual content
│   └── quiz-tree.ts      ← branching question tree, TOTAL_STEPS = 3
├── lib/
│   └── i18n.ts           ← UI strings (EN / GR)
├── types/
│   └── index.ts          ← TypeScript types (Lang, Cocktail, QuizNode, QuizOption etc.)
├── public/
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## What's been built (Phase 1 ✅)
- Welcome screen with EN / ΕΛ language toggle
- Branching quiz decision tree (3 steps max depth)
- 10 cocktail results: Mojito, Aperol Spritz, Negroni, Old Fashioned, Daiquiri,
  Cosmopolitan, Gin & Tonic, Paloma Rosé, Espresso Martini, Margarita
- Animated transitions between screens (Framer Motion)
- Result screen with cocktail name, description, ingredients
- Fully responsive / mobile-first
- Deployed to Vercel with GitHub CI/CD (auto-deploys on every git push)

---

## Architecture — QuizEngine state machine
Uses `useReducer` with 3 stages: `welcome` → `quiz` → `result`

Actions: SET_LANG | START | SELECT | RESTART

Quiz data is currently hardcoded in /data — Phase 2 moves it to Supabase.

---

## Design tokens (globals.css)
```
--gold: #C9A84C
--gold-light: #E8CF7E
--gold-dark: #8B6914
--dark: #0F0D0A
--dark-2: #1A1713
--dark-3: #251F18
--dark-4: #332A1F
--cream: #F5EED8
--cream-dim: #C8B98A
--text-muted: #7A6A4F
```
Fonts: Cormorant Garamond (serif, headings) + DM Sans (sans, body)

---

## Known issues / notes
- Project must NOT be in a folder path with Greek/non-ASCII characters
  (Turbopack crashes on non-ASCII paths — was in OneDrive/Υπολογιστής)
- Current project location: C:\Users\grigo\projects\match-n-taste
- Windows machine (use `dir` not `ls`)

---

## Phase 2 — IN PROGRESS (next session starts here)

### Goal: Supabase + Admin Panel

### Step 1 — Supabase project setup (NEXT STEP)
- User has a Supabase account ✅
- Need to create new Supabase project named `match-n-taste`
- Region: EU West (closest to Greece)
- Then run SQL to create 3 tables:

**cocktails** (id text PK, name, glass, subtitle_en, subtitle_gr,
               description_en, description_gr, ingredients text[])

**quiz_nodes** (id text PK, tag_en, tag_gr, question_en, question_gr, order_index)

**quiz_options** (id uuid PK, node_id → quiz_nodes, label_en, label_gr, emoji,
                  next_node_id → quiz_nodes, next_cocktail_id → cocktails, order_index)

### Step 2 — Connect Next.js to Supabase
- Install: `@supabase/supabase-js` and `@supabase/ssr`
- Add env variables to .env.local and Vercel dashboard
- Update quiz to fetch data from DB instead of hardcoded files

### Step 3 — Admin auth
- Supabase Auth (email + password, single admin user)
- Protected /admin route with middleware
- /admin/login page

### Step 4 — Admin panel routes
- /admin/cocktails — CRUD for cocktails
- /admin/quiz — CRUD for quiz nodes and options

### Phase 3 (planned later)
- QR code generator (per venue)
- Printable card template
- Vercel Analytics

### Phase 4 (planned later)
- Claude API integration for dynamic cocktail descriptions
