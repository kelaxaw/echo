# Echo — Voice Journal · Design Brief for Claude Design

> Placeholder name "Echo" — swap for your own.

## Product
A voice-first reflection app. The user records a short voice note about their day; the app returns a **structured daily report** (productivity, procrastination, mood, key events) and tracks **emotional trends over time**. Build a high-fidelity, interactive mobile prototype. Prioritize the **Today** and **Daily Report** screens.

## Platform & Frame
- Mobile, iPhone (390 × 844), rendered inside a phone frame
- Dark mode only

## Visual Language — reference: **Opal app**
Cinematic, premium, calm. Near-black canvas with a **single vibrant focal element per screen**. Monochrome UI with **one accent color driven by mood**. Generous negative space, oversized bold headers, soft rounded surfaces, subtle frosted glass and gradients. Occasional tactile/skeuomorphic element (Opal uses an LCD timer).

## Design Tokens

**Color**
- Background: `#000000` → `#0B0B0F` — a photographic backdrop at the top (cave rock / starfield / mountains) fading into pure black
- Surface / cards: `#141418`, 1px stroke `rgba(255,255,255,0.08)`
- Text: primary `#FFFFFF`, secondary `rgba(255,255,255,0.55)`
- **Mood accent (dynamic)**: good `#4ADE80`, neutral warm amber `#F5A623`, low `#9CA3AF` (muted grey — never an alarming red)
- Streak / flame accent: `#FF7A1A`

**Type** (Inter or SF Pro Display, tight tracking)
- Screen title: 34px / 800
- Big metric number: 64px / 300
- Card title: 20px / 700
- Body: 15px / 400 · secondary: 13px

**Shape**
- Cards radius 28px · pills fully rounded · buttons 56px tall
- Bottom nav: floating blurred-dark pill, 3 tabs (icon + label)

## Hero element
Each screen has one photographic/abstract backdrop up top, fading into black. The **Today** hero is a glassy, colorful **"mood orb"** on a pedestal (Opal's crystal-egg energy) whose palette reflects *today's* mood.

---

## Screens

### 1. Today (Home)
- Top bar: app name "Echo" (left) · `🔥 6` streak + round avatar (right)
- Center hero: **mood orb** on a pedestal, cinematic backdrop with stars
- `Day Score` label + **big number** (e.g. `74`) with an up-arrow trend
- Three metric pills below, joined by a bracket line (exactly like Opal's Sleep/Focus/Rest):
  - **Mood 78** · **Focus 71** · **Drift 34** (procrastination — lower is better)
- Card: "Record today's reflection" — mic icon + **Record** pill button
- Card: "This week" — mini mood sparkline
- Bottom nav: **Today · Journal · Record**

### 2. Record
- Cinematic mountain backdrop
- Center: a large **pulsing waveform / orb** (keep it tactile & skeuomorphic like Opal's LCD timer, but for audio)
- Elapsed time, large
- Primary pill button **Record** → toggles to **Stop**
- Chip: `Add context ›`
- "Recents" — horizontal cards (mirror Opal's Flow State cards): each shows date · mood-colored image · duration

### 3. Daily Report  *(the core — structured output)*
- Header: date + one-line AI title ("A heavy but productive Tuesday")
- Small mood orb, colored by the day
- **Structured block:**
  - Productivity — horizontal bar, 72%
  - Procrastination — bar, 40%
  - Mood — 6.5 / 10 with emoji trend
  - Energy — bar
- **Key events** — list of 3–4 rows/chips
- **Emotions** — tag pills (anxious · hopeful · tired)
- AI summary — 2–3 line paragraph
- **Callback card** (RAG memory): "You mentioned wanting to start running — 8 days ago."
- Buttons: **Share** · **Ask follow-up**

### 4. Insights / Trends
- Faint backdrop
- Large **mood line/area chart**, 30 days, dynamic accent gradient
- Segmented control: Week / Month / Year
- **Recurring themes** — list with bars (burnout ×5 · work stress ×4)
- Small cards: Best days / Hard days

### 5. Shared Entry *(optional — sharing feature)*
- A Daily Report with **private comments** from added close people beneath it
- Default state is **private**; sharing is opt-in per entry

---

## Interactions (keep light)
- Tap **Record** → button toggles, waveform animates
- Tap a Recents card → opens Daily Report
- Metric pills + segmented control are tappable

## Deliverable
High-fidelity, dark, Opal-grade polish. Ship **Today** + **Daily Report** first; the rest can be static.
