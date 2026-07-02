# Web3 Token Discovery & DEX Dashboard — CrackerSwap

## 1. Project Description
A premium CrackerSwap-branded Web3 DEX dashboard. Features warm orange brand accents, electric purple trading actions, deep navy canvas, and a modern card-based layout. The Token Discovery page is the main entry point with a hero section, stats, market highlights, and a comprehensive token table. Full Portfolio module with wallet states, asset tracking, LP exposure, and transaction history. Swap page for token trading. Pools module with pool discovery and pool analytics.

## 2. Design System
- **Style**: Premium dark-mode Web3 trading product, CrackerSwap branded
- **Colors**: Deep navy/black (#070214) background, warm orange (#FF6A1A) primary brand, electric purple (#6C4DFF) trading accent, green (#34D07F) positive, red (#FF5B5B) negative
- **Typography**: Inter (clean, modern, geometric) — all weights from 300 to 800
- **Effects**: Liquid glass card system with backdrop blur, gradient borders, inner highlights, ambient orange/purple glows

## 3. Page Structure
- `/` — Token Discovery (original, with Navbar component)
- `/v2` — Token Discovery V2 (liquid glass redesign with chart drawer)
- `/swap` — Dedicated swap page
- `/pools` — Pools Listing (sidebar layout, filters, table, pagination)
- `/pools/:poolId` — Pool Detail (analytics, charts, LP exposure)
- `/portfolio` — Portfolio module (Overview, Assets, LP Exposure, Activity tabs)
- `*` — 404 Not Found

## 4. Core Features
- [x] CrackerSwap top navigation with orange brand logo, nav pills, Connect Wallet
- [x] Token Discovery with hero, stats, highlights, token table, pagination, chart drawer
- [x] Swap page with token select modal, full transaction flow
- [x] Portfolio module with wallet connection flow
- [x] Portfolio Overview tab (total value, stat cards, allocation, recent activity)
- [x] Asset Balances table with search, chain filter, token balance drawer
- [x] LP Exposure tab with pool details drawer
- [x] Activity/Transaction History tab with filters and transaction detail drawer
- [x] Pools Listing page with stat cards, filters, table, pagination
- [x] Pool Detail page with composition chart, activity chart, LP exposure, related actions
- [ ] Connect wallet functionality (mock only)
- [ ] Live price data integration (future)
- [ ] Positions page (future)

## 5. Data Model Design
- Mock discovery token data with chains, badges, sparklines, liquidity, market cap
- Mock portfolio data with token balances, LP exposure, transaction history
- Mock chart data for token chart drawer
- Mock pool data with TVL, volume, APR, liquidity, status
- No database needed for current phase

## 6. Backend / Third-party Integration Plan
- Supabase: Not needed for current phase
- Shopify: Not needed
- Stripe: Not needed

## 7. Development Phase Plan

### Phase 1: CrackerSwap Token Discovery (COMPLETED)
- Goal: Build the complete Token Discovery page with CrackerSwap branding
- Deliverable: Fully functional token discovery with hero, stats, highlights, table, pagination

### Phase 2: Token Chart Drawer & Liquid Glass System (COMPLETED)
- Goal: Add token chart quick-view drawer, refine liquid glass material system
- Deliverable: Chart drawer on all token rows, premium glass styling

### Phase 3: Portfolio Module (COMPLETED)
- Goal: Full wallet portfolio experience with assets, LP exposure, activity
- Deliverable: Portfolio page with 4 tabs, 3 drawers, connect wallet flow, all states

### Phase 4: Swap Module (COMPLETED)
- Goal: Build complete Swap flow with quote, review, transaction states
- Deliverable: Swap page with full user journey, liquid glass card, background arc

### Phase 5: Pools Module (COMPLETED)
- Goal: Build Pools Listing and Pool Detail screens
- Deliverable: Pools page with sidebar, table, filters; Pool Detail with analytics charts

### Phase 6: Additional Pages (FUTURE)
- Goal: Build Positions page
- Deliverable: Working navigation with full position functionality

### Phase 7: Live Data (FUTURE)
- Goal: Connect to real price APIs and wallet providers
- Deliverable: Live data dashboard