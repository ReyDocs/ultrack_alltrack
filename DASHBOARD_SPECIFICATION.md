# ULTRACK Dashboard - Complete Visual Specification

**Document Version:** 1.0  
**Date Created:** May 10, 2026  
**Base Resolution:** 2880×2484px  
**Theme:** Dark Mode with Glassmorphism Elements

---

## 1. OVERALL DASHBOARD LAYOUT STRUCTURE

### Page Canvas
- **Total Width:** 2880px (full viewport)
- **Total Height:** 2484px
- **Background:** Dark charcoal/dark brown (#1a1a1a or similar dark color)
- **Layout Type:** CSS Grid with responsive column layout

### Layout Grid Architecture
```
┌─────────────────────────────────────────────────────┐
│ HEADER SECTION (Greeting + Logout)                  │
├────────────────┬────────────────────────────────────┤
│ TOP ROW:       │ Resume Card (710px)│Pomodoro(488px)│
│ 2 columns      │                                     │
├────────────────┴────────────────────────────────────┤
│ MIDDLE ROW:    │ Budget │ Burnout │ GWA              │
│ 3 columns      │ (402px)│(414px) │(398px)           │
├─────────────────────────────────────────────────────┤
│ BOTTOM ROW:    │ To Do! │ Resource Vault             │
│ 2 columns      │(536px)│  (536px)                    │
└─────────────────────────────────────────────────────┘
```

### Page Margin & Padding
- **Left Sidebar Width:** ~160-180px (contains navigation icons)
- **Main Content Left Margin:** ~20-24px
- **Main Content Top Margin:** ~40-50px (below header greeting)
- **Main Content Right Margin:** ~20-24px
- **Main Content Bottom Margin:** ~30-40px

### Gap Spacing Between Sections
- **Row Gap (vertical):** ~20-28px between major sections
- **Column Gap (horizontal):** ~16-20px between cards within same row

### Header Section Specifications
- **Header Height:** ~100-120px (including greeting and profile)
- **Profile Avatar:** ~60-80px diameter, circular, semi-transparent background
- **Greeting Text "Hello Von!":** Large, bold white text (~28-32px font size)
- **Subtitle "Glad to have you here!":** Smaller gray text (~14-16px)
- **Logout Icon:** Top right, ~24-32px size, semi-transparent

---

## 2. TOP ROW GRID - RESUME & POMODORO CARDS

### Container Layout
- **Row Height:** ~324px
- **Grid Distribution:** 60% (Resume) / 40% (Pomodoro)
- **Card Actual Widths:**
  - Resume: 710px
  - Pomodoro: 488px
  - Total with gap: 710px + 20px + 488px = 1218px

### Card: Internship Resume Generator (Resume)
**Card Dimensions:** 710px × 324px
**File Reference:** Resume.png

#### Structure & Content Layout
```
┌─ Card Border (rounded corners ~24-32px radius) ─┐
│ [Category Label]      [Empty Space]             │
│ Title: "Internship Resume Generator"            │
│ Description Text (2 lines):                      │
│   "Fill in course, org roles, projects, skills │
│    and the AI rewrites vague entries into..."   │
│ [Divider Line - subtle]                         │
│                                                  │
│ [Data Field]                  [GENERATE Button]│
└──────────────────────────────────────────────────┘
```

#### Typography & Content Details
- **Category Label:** "START YOUR CAREER"
  - Font Size: ~12-14px
  - Color: Orange/Salmon (#E89B3F or similar)
  - Font Weight: 600-700 (semibold to bold)
  - Text Transform: UPPERCASE
  - Letter Spacing: ~1.5-2px

- **Main Title:** "Internship Resume Generator"
  - Font Size: ~28-32px
  - Color: White (#FFFFFF)
  - Font Weight: 700 (bold)
  - Margin Top: ~8-12px from category

- **Body Description Text:** "Fill in course, org roles, projects, skills and the AI rewrites vague entries into strong, action-verb bullet points tailored to Philippine internship postings."
  - Font Size: ~14-16px
  - Color: Gray (#999999 or #A0A0A0)
  - Line Height: 1.5-1.6
  - Text Length: ~2 lines
  - Margin Top: ~12-16px
  - Margin Bottom: ~16-20px

#### Spacing & Layout
- **Card Padding:** ~24-32px (all sides)
- **Top Padding:** ~28-36px (more space above category)
- **Content Area Height:** ~260-280px (excluding padding)
- **Divider Line:** Thin (~1px), semi-transparent gray, positioned ~24px from bottom
- **Bottom Section Height:** ~60-80px (contains button)

#### Button Specifications
- **Label:** "GENERATE"
- **Button Style:** Outlined/Stroke button
  - Border: 1.5-2px solid orange/gold (#E89B3F)
  - Background: Transparent
  - Border Radius: 24-32px (fully rounded)
  - Padding: ~8-12px horizontal, ~4-8px vertical
  - Font Size: ~14-16px
  - Font Weight: 600-700
  - Color: Orange/Gold (#E89B3F)

- **Button Position:** Bottom right of card
  - Right Offset: ~24-32px
  - Bottom Offset: ~24-28px

#### Card Background & Effects
- **Background Color:** Near black with slight brown tint (#0F0F0F or #1A1615)
- **Background Opacity:** 85-95% (semi-transparent)
- **Border Radius:** 24-32px
- **Box Shadow:** 
  - Soft shadow with blur ~8-12px
  - Shadow color: rgba(0, 0, 0, 0.3-0.4)
  - Offset: ~2-4px down, ~2-4px right
  - Elevation effect: ~2-4px depth

---

### Card: Pomodoro (Lock In)
**Card Dimensions:** 488px × 324px
**File Reference:** Pomodoro.png

#### Structure & Content Layout
```
┌─ Card Border (rounded corners ~24-32px radius) ─┐
│ [Category Label]                                 │
│ Title: "Pomodoro"                               │
│ Description Text (2 lines):                      │
│   "List down your tasks. Pomodoro timer         │
│    auto-adjusts for long exam reviews..."       │
│ [Divider Line - subtle]                         │
│                                                  │
│ [Status Label]        [Time Display] [Button]   │
│ "LOCKED IN"           "4 MIN"       "FOCUS"    │
└──────────────────────────────────────────────────┘
```

#### Typography & Content Details
- **Category Label:** "LOCK IN"
  - Font Size: ~12-14px
  - Color: Orange/Salmon (#E89B3F)
  - Font Weight: 600-700
  - Text Transform: UPPERCASE
  - Letter Spacing: ~1.5-2px

- **Main Title:** "Pomodoro"
  - Font Size: ~28-32px
  - Color: White (#FFFFFF)
  - Font Weight: 700 (bold)
  - Margin Top: ~8-12px

- **Body Description:** "List down your tasks. Pomodoro timer auto-adjusts for long exam reviews vs short homework sessions."
  - Font Size: ~14-16px
  - Color: Gray (#999999 or #A0A0A0)
  - Line Height: 1.5-1.6
  - Text Length: ~2 lines
  - Margin Top: ~12-16px
  - Margin Bottom: ~16-20px

#### Status Display & Button Section
- **Status Label:** "LOCKED IN"
  - Font Size: ~12-14px
  - Color: Gray (#888888)
  - Font Weight: 500-600
  - Position: Bottom left

- **Time Display:** "4 MIN"
  - Font Size: ~24-28px
  - Color: White (#FFFFFF)
  - Font Weight: 700
  - Position: Left-center of bottom section
  - Margin Top: ~4-8px from status label

- **Button:** "FOCUS"
  - Same style as Resume button (outlined)
  - Border: 1.5-2px solid orange/gold (#E89B3F)
  - Border Radius: 24-32px
  - Position: Bottom right
  - Right Offset: ~24-32px
  - Font Size: ~14-16px

#### Card Background & Effects
- **Background Color:** Near black with slight brown tint (#0F0F0F or #1A1615)
- **Background Opacity:** 85-95%
- **Border Radius:** 24-32px
- **Box Shadow:** Same as Resume card
  - Soft blur ~8-12px
  - Shadow color: rgba(0, 0, 0, 0.3-0.4)

---

## 3. MIDDLE ROW GRID - THREE COLUMN LAYOUT (BUDGET, BURNOUT, GWA)

### Container Layout
- **Row Height:** ~357px (based on Burnout card height)
- **Grid Distribution:** Equal distribution across 3 columns
- **Card Widths:**
  - Budget: 402px
  - Burnout: 414px
  - GWA: 398px
  - Total with gaps: 402px + 20px + 414px + 20px + 398px = 1254px

### Card: Budget Tracker (Fiscal Health)
**Card Dimensions:** 402px × 357px
**File Reference:** Budget.png

#### Structure & Content Layout
```
┌─ Card Border (rounded corners ~24-32px) ─┐
│ [Category Label]                          │
│ Title: "Budget Tracker"                  │
│ Description Text (1-2 lines):            │
│   "Allowance first. Track your budget   │
│    and transpo costs estimates"         │
│ [Divider Line]                          │
│                                          │
│ [Data Label] [Data Value]               │
│ "SAVED"      "P500"      [SAVE Button] │
└──────────────────────────────────────────┘
```

#### Typography & Content Details
- **Category Label:** "FISCAL HEALTH"
  - Font Size: ~11-13px
  - Color: Orange/Salmon (#E89B3F)
  - Font Weight: 600-700
  - Text Transform: UPPERCASE
  - Letter Spacing: ~1.5-2px

- **Main Title:** "Budget Tracker"
  - Font Size: ~24-28px
  - Color: White (#FFFFFF)
  - Font Weight: 700 (bold)
  - Margin Top: ~8-12px

- **Body Description:** "Allowance first. Track your budget and transpo costs estimates"
  - Font Size: ~13-15px
  - Color: Gray (#999999)
  - Line Height: 1.5-1.6
  - Text Length: ~2 lines
  - Margin Bottom: ~16-20px

#### Data Display Section
- **Data Label:** "SAVED"
  - Font Size: ~12-14px
  - Color: Gray (#888888)
  - Font Weight: 500-600

- **Data Value:** "P500"
  - Font Size: ~22-26px
  - Color: White (#FFFFFF)
  - Font Weight: 700
  - Margin Top: ~4-8px

- **Button:** "SAVE"
  - Same outlined style as other buttons
  - Border: 1.5-2px solid orange/gold
  - Border Radius: 24-32px
  - Position: Bottom right
  - Font Size: ~14-16px

#### Spacing & Layout
- **Card Padding:** ~24-32px (all sides)
- **Divider Line:** ~1px, semi-transparent gray, positioned ~24px from bottom

#### Card Background & Effects
- **Background Color:** Near black (#0F0F0F)
- **Background Opacity:** 85-95%
- **Border Radius:** 24-32px
- **Box Shadow:** Soft shadow with ~8-12px blur

---

### Card: Burnout Barometer (Well-Being)
**Card Dimensions:** 414px × 357px
**File Reference:** Burnout.png

#### Structure & Content Layout
```
┌─ Card Border ─┐
│ [Cat] [LEARN MORE Badge]              │
│ Title: "Burnout Barometer"            │
│ Description Text (2-3 lines):         │
│   "Daily 3-question check-in. Detects│
│    stress patterns over time and     │
│    nudges rest before burnout hits." │
│ [Divider]                            │
│                                       │
│ [Icon] [Icon] [Icon]                 │
│ [Green] [Red] [Gray]                 │
│ GOOD/S MEIJO JKJS                    │
│ LANG    KAYA PA                      │
└───────────────────────────────────────┘
```

#### Typography & Content Details
- **Category Label:** "WELL - BEING"
  - Font Size: ~11-13px
  - Color: Orange/Salmon (#E89B3F)
  - Font Weight: 600-700
  - Text Transform: UPPERCASE

- **Category Badge:** "LEARN MORE"
  - Position: Top right corner
  - Background: Dark red/maroon (#8B0000 or similar)
  - Padding: ~4-6px horizontal
  - Font Size: ~11-12px
  - Font Weight: 600
  - Color: Light/white
  - Border Radius: ~4-6px

- **Main Title:** "Burnout Barometer"
  - Font Size: ~24-28px
  - Color: White (#FFFFFF)
  - Font Weight: 700
  - Margin Top: ~8-12px

- **Body Description:** "Daily 3-question check-in. Detects stress patterns over time and nudges rest before burnout hits."
  - Font Size: ~13-15px
  - Color: Gray (#999999)
  - Line Height: 1.5-1.6
  - Text Length: ~3 lines
  - Margin Bottom: ~16-20px

#### Visual Elements Section
- **Icon Size:** ~48-56px diameter (circular background)
- **Icon Spacing:** ~12-16px gaps between three icons
- **Icon Layout:** Horizontal row, centered alignment
- **Icons:**
  1. **Happy/Good (Green):**
     - Background: Semi-transparent green (#4CAF50 or similar)
     - Icon: Smiley face emoji (😊) or SVG
     - Label: "GOOD S\nLANG"
     - Font Size: ~11-13px
     - Color: White
  
  2. **Neutral/Okay (Red):**
     - Background: Semi-transparent red (#F44336 or similar)
     - Icon: Neutral face emoji (😐) or SVG
     - Label: "MEIJO\nKAYA PA"
     - Font Size: ~11-13px
     - Color: White
  
  3. **Bad/Stressed (Gray):**
     - Background: Semi-transparent gray (#757575)
     - Icon: Sad face emoji (😞) or SVG
     - Label: "JKJS" (or similar)
     - Font Size: ~11-13px
     - Color: White

#### Card Background & Effects
- **Background Color:** Near black (#0F0F0F)
- **Background Opacity:** 85-95%
- **Border Radius:** 24-32px
- **Box Shadow:** Soft shadow with ~8-12px blur

---

### Card: UP - GWA (Grades So Far)
**Card Dimensions:** 398px × 351px
**File Reference:** GWA.png

#### Structure & Content Layout
```
┌─ Card Border ─┐
│ [Category Label]                     │
│ Title: "UP - GWA"                   │
│ Description Text (2 lines):         │
│   "Uses the official UP 1.0-5.0    │
│    grading scale. Simulates what   │
│    grades you need to hit target   │
│    GWA."                           │
│ [Divider]                          │
│                                     │
│ [Label]         [Button]           │
│ "CURRENT"       "Calculate"        │
│ "1.75"                             │
└─────────────────────────────────────┘
```

#### Typography & Content Details
- **Category Label:** "GRADES SO FAR"
  - Font Size: ~11-13px
  - Color: Orange/Salmon (#E89B3F)
  - Font Weight: 600-700
  - Text Transform: UPPERCASE

- **Main Title:** "UP - GWA"
  - Font Size: ~24-28px
  - Color: White (#FFFFFF)
  - Font Weight: 700
  - Margin Top: ~8-12px

- **Body Description:** "Uses the official UP 1.0-5.0 grading scale. Simulates what grades you need to hit your target GWA."
  - Font Size: ~13-15px
  - Color: Gray (#999999)
  - Line Height: 1.5-1.6
  - Text Length: ~3-4 lines
  - Margin Bottom: ~16-20px

#### Data Display Section
- **Data Label:** "CURRENT"
  - Font Size: ~12-14px
  - Color: Gray (#888888)
  - Font Weight: 500-600

- **Data Value:** "1.75"
  - Font Size: ~22-26px
  - Color: White (#FFFFFF)
  - Font Weight: 700
  - Margin Top: ~4-8px

- **Button:** "Calculate"
  - Same outlined style
  - Border: 1.5-2px solid orange/gold
  - Border Radius: 24-32px
  - Position: Bottom right
  - Font Size: ~14-16px

#### Card Background & Effects
- **Background Color:** Near black (#0F0F0F)
- **Background Opacity:** 85-95%
- **Border Radius:** 24-32px
- **Box Shadow:** Soft shadow with ~8-12px blur

---

## 4. BOTTOM ROW GRID - TWO COLUMN LAYOUT (TO DO & RESOURCE VAULT)

### Container Layout
- **Row Height:** ~457px
- **Grid Distribution:** 50/50 (equal width)
- **Card Widths:**
  - To Do!: 536px
  - Resource Vault: 536px
  - Total with gap: 536px + 20px + 536px = 1092px

### Card: To Do! (Strategic Timeline)
**Card Dimensions:** 536px × 457px
**File Reference:** To DO.png

#### Structure & Content Layout
```
┌─ Card Border ─┐
│ [Category Label]                      │
│ Title: "To Do!"                      │
│                                       │
│ [Task Item 1] ─────────────────────  │
│  [12] Differential Equations          │
│       MIDTERMS • NOV 12    [CRITICAL]│
│                                       │
│ [Task Item 2] ─────────────────────  │
│  [15] Organic Chemistry               │
│       FINAL QUIZ • NOV 15  [MODERATE]│
│                                       │
│                                       │
│ [Add to list Button]                 │
└───────────────────────────────────────┘
```

#### Typography & Content Details
- **Category Label:** "STRATEGIC TIMELINE"
  - Font Size: ~11-13px
  - Color: Orange/Salmon (#E89B3F)
  - Font Weight: 600-700
  - Text Transform: UPPERCASE

- **Main Title:** "To Do!"
  - Font Size: ~28-32px
  - Color: White (#FFFFFF)
  - Font Weight: 700
  - Margin Top: ~8-12px
  - Margin Bottom: ~20-24px

#### Task Item Structure
**Number of Items Shown:** 2 (scrollable list)
**Item Height:** ~60-70px each
**Item Spacing:** ~12-16px between items
**Item Container Margin:** ~16-20px left and right

##### Individual Task Item
```
┌─ Task Container ─────────────────────┐
│ [Date Badge] [Task Title]  [Priority]│
│ "12"         "Differential..."       │
│              "MIDTERMS • NOV 12" │CRITICAL│
└──────────────────────────────────────┘
```

- **Date Badge:**
  - Size: ~36-44px × 36-44px (square or slightly rounded)
  - Background: Semi-transparent brown/tan (#8B6F47 or similar for item 1)
  - Color: Light/white (#F0F0F0)
  - Font Size: ~20-24px
  - Font Weight: 700
  - Border Radius: ~4-8px

- **Task Title:** "Differential Equations"
  - Font Size: ~15-17px
  - Color: White (#FFFFFF)
  - Font Weight: 600
  - Position: Next to date badge

- **Subtitle:** "MIDTERMS • NOV 12"
  - Font Size: ~12-13px
  - Color: Gray (#999999)
  - Font Weight: 500
  - Position: Below task title

- **Priority Badge:** "CRITICAL"
  - Font Size: ~11-12px
  - Color: Light red/salmon (#FF6B6B or #E89B3F)
  - Font Weight: 700
  - Position: Top right of item
  - Text Transform: UPPERCASE

#### Styling for Different Task Items
- **Item 1 (Differential Equations):**
  - Date Badge Background: Brown/tan (#8B6F47)
  - Priority: "CRITICAL" (red coloring)

- **Item 2 (Organic Chemistry):**
  - Date Badge Background: Orange/brown (#D2691E or similar)
  - Priority: "MODERATE" (orange coloring)

#### Bottom Action Section
- **Button:** "Add to list"
  - Style: Filled/solid button (different from outlined top cards)
  - Background: Grayish/muted tone (#6B6B6B or similar)
  - Color: White text
  - Border Radius: ~24-32px
  - Padding: ~12-16px
  - Font Size: ~14-16px
  - Font Weight: 600
  - Width: ~80-85% of card width
  - Position: Bottom center
  - Bottom Margin: ~20-24px

#### Card Background & Effects
- **Background Color:** Near black (#0F0F0F)
- **Background Opacity:** 85-95%
- **Border Radius:** 24-32px
- **Box Shadow:** Soft shadow with ~8-12px blur
- **Card Padding:** ~24-32px (all sides)

---

### Card: Resource Vault (Saved Links)
**Card Dimensions:** 536px × 457px
**File Reference:** Resource.png

#### Structure & Content Layout
```
┌─ Card Border ─┐
│ [Category Label]                      │
│ Title: "Resource Vault"              │
│                                       │
│ [Link Item 1] ────────────────────── │
│ 🔗 https://arxiv.org/pdf/2301.0456...│
│                                       │
│ [Link Item 2] ────────────────────── │
│ 🔗 https://notion.so/up-study-guides.│
│                                       │
│ [Link Item 3] ────────────────────── │
│ 🔗 https://coursera.org/learn/neural..│
│                                       │
│ [Open Links Button]                  │
└───────────────────────────────────────┘
```

#### Typography & Content Details
- **Category Label:** "SAVED LINKS"
  - Font Size: ~11-13px
  - Color: Orange/Salmon (#E89B3F)
  - Font Weight: 600-700
  - Text Transform: UPPERCASE

- **Main Title:** "Resource Vault"
  - Font Size: ~28-32px
  - Color: White (#FFFFFF)
  - Font Weight: 700
  - Margin Top: ~8-12px
  - Margin Bottom: ~20-24px

#### Link Items
**Number of Items Shown:** 3 (scrollable list)
**Item Height:** ~40-50px each
**Item Spacing:** ~12-16px between items
**Item Container Margin:** ~16-20px left and right

##### Individual Link Item
- **Icon:** Link icon 🔗
  - Size: ~16-20px
  - Color: Gray (#999999)
  - Position: Left of URL text

- **Link Text:** "https://arxiv.org/pdf/2301.0456..."
  - Font Size: ~12-14px
  - Color: Gray (#A0A0A0)
  - Font Weight: 500
  - Text Overflow: Ellipsis (truncated with "...")
  - Font Family: Monospace or system default

- **Item Background:** Transparent (no background highlight visible)
- **Hover State:** (if applicable) Slight background highlight

#### Bottom Action Section
- **Button:** "Open Links"
  - Style: Filled/solid button (gray background)
  - Background: Grayish/muted tone (#6B6B6B)
  - Color: White text
  - Border Radius: ~24-32px
  - Padding: ~12-16px
  - Font Size: ~14-16px
  - Font Weight: 600
  - Width: ~80-85% of card width
  - Position: Bottom center
  - Bottom Margin: ~20-24px

#### Card Background & Effects
- **Background Color:** Near black (#0F0F0F)
- **Background Opacity:** 85-95%
- **Border Radius:** 24-32px
- **Box Shadow:** Soft shadow with ~8-12px blur
- **Card Padding:** ~24-32px (all sides)

---

## 5. UNIVERSAL CARD STYLING & EFFECTS

### Border & Shadow Treatment
- **Border Radius:** Consistent 24-32px across all cards
- **Border:** None (no visible border stroke)
- **Box Shadow:**
  - Primary Shadow: `0 4px 12px rgba(0, 0, 0, 0.4)`
  - Secondary Shadow (optional): Subtle inset shadow for depth
  - Blur Radius: ~8-12px
  - Spread Radius: 0-2px
  - Offset: 2-4px down, 2-4px right

### Card Background & Transparency
- **Base Color:** Dark near-black (#0F0F0F, #1A1615, or #111111)
- **Opacity/Transparency:** 85-95% (semi-transparent to allow background blur/falloff)
- **Glassmorphism Effect:**
  - Backdrop Filter: blur(10px) possible
  - Gives semi-frosted glass appearance
  - Creates depth layering effect

### Divider Lines
- **Color:** Semi-transparent gray (#4A4A4A or rgba(255,255,255,0.1))
- **Thickness:** 1px
- **Opacity:** 15-25%
- **Position:** Typically 24px from bottom of text content
- **Width:** Full card width minus padding

---

## 6. TYPOGRAPHY SYSTEM

### Font Family (Inferred)
- **Primary Font:** Modern sans-serif (likely: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, or similar)
- **Fallback:** System fonts
- **Monospace (for URLs):** Menlo, Monaco, Courier New, or similar

### Font Weight Scale
- **Light:** 300
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

### Font Size Scale (Observed)
| Usage | Size | Weight |
|-------|------|--------|
| Header Greeting | 28-32px | 700 |
| Card Titles | 24-32px | 700 |
| Category Labels | 11-14px | 600-700 |
| Body Text | 13-16px | 400 |
| Data Values | 20-28px | 700 |
| Data Labels | 12-14px | 500-600 |
| Button Text | 14-16px | 600 |
| Task Titles | 15-17px | 600 |
| Link URLs | 12-14px | 500 |

### Line Height
- **Body Text:** 1.5-1.6
- **Headings:** 1.2-1.3
- **Tight Text:** 1.4

### Color Palette

#### Primary Colors
- **Primary Action/Accent:** Orange/Gold (#E89B3F or #E8994C)
- **Dark Background:** #0F0F0F, #1A1615
- **White/Light Text:** #FFFFFF
- **Gray Text:** #999999, #A0A0A0, #888888

#### Status/Badge Colors
- **Critical/Alert:** Red (#FF6B6B, #E74C3C, or #8B0000 for dark variants)
- **Moderate:** Orange (#E89B3F or #D2691E)
- **Good/Success:** Green (#4CAF50, #52C77A)
- **Neutral:** Gray (#757575, #6B6B6B)

---

## 7. SPACING & MEASUREMENTS REFERENCE

### Card Internal Spacing
- **Padding (All Cards):** 24-32px on all sides
- **Top Padding (Extra):** 28-36px (category label area)
- **Bottom Section Offset:** 20-24px from bottom edge

### Element Spacing Within Cards
- **Category to Title:** 8-12px
- **Title to Description:** 12-16px
- **Description to Divider:** 16-20px
- **Divider to Bottom Section:** 20-24px

### Button & Interactive Element Spacing
- **Button Padding:** 8-16px (horizontal), 6-12px (vertical)
- **Button Border Width:** 1.5-2px (outlined buttons)

### Icon & Visual Element Sizing
- **Avatar (Header):** 60-80px diameter
- **Profile Icon (Cards):** 36-56px
- **Task Date Badge:** 36-44px × 36-44px
- **Link Icon:** 16-20px
- **Status Icon:** 48-56px diameter

---

## 8. RESPONSIVE BREAKPOINTS (Design Notes)

### Current Design Specification
- **Desktop Viewport:** 2880px full width (high-res design)
- **Sidebar:** ~160-180px fixed width
- **Main Content Area:** ~2700px

### Grid Responsiveness
- **Top Row (Resume + Pomodoro):** 2-column layout
- **Middle Row (Budget + Burnout + GWA):** 3-column layout
- **Bottom Row (To Do + Resource):** 2-column layout
- **Gap Between Cards:** 16-20px consistent

---

## 9. VISUAL STYLE CHARACTERISTICS

### Design System Summary
1. **Theme:** Dark Mode with Glassmorphism
2. **Color Approach:** Dark backgrounds + Orange accents + White typography
3. **Shadow Depth:** Moderate (medium drop shadows for card elevation)
4. **Border Style:** Rounded corners only, no visible borders
5. **Transparency:** Semi-transparent cards with backdrop effects
6. **Typography:** Clean, modern sans-serif with clear hierarchy
7. **Interaction Style:** Outlined buttons for primary actions, filled buttons for secondary
8. **Icons/Visuals:** Emoji-based faces, simple link icons, colored status badges

### Glassmorphism Implementation
- **Frosted Glass Effect:** Semi-transparent backgrounds with blur
- **Depth Layering:** Cards appear elevated above background
- **Color Layering:** Slight brown/warm tint in dark backgrounds
- **Shadow Variation:** Consistent soft shadows without harsh edges

---

## 10. IMPLEMENTATION GUIDELINES

### CSS Framework Recommendations
- **Grid System:** CSS Grid (native grid layout)
- **Card Components:** Reusable card container with consistent styling
- **Button Components:** Variant system (outlined vs filled)
- **Typography:** CSS custom properties for font sizes/weights

### Key Implementation Notes
1. **Card Template:** Create base card component with:
   - Category label area
   - Title and description zones
   - Content area (variable height)
   - Divider line
   - Bottom section with buttons/data
   - Consistent padding and spacing

2. **Layout Grid:** 
   - Use CSS Grid for main dashboard layout
   - Define row and column gaps explicitly
   - Ensure card sizing constraints

3. **Color System:**
   - Define CSS variables for all colors
   - Use consistent hex values across all components
   - Apply opacity/transparency through rgba()

4. **Typography:**
   - Establish font size scale
   - Use semantic font weights
   - Maintain line-height consistency

5. **Effects:**
   - Box-shadow for card elevation
   - Border-radius for corners (24-32px)
   - Optional: backdrop-filter for glassmorphism
   - Subtle divider lines with opacity

---

## 11. EXPORTS & ASSET NOTES

### Referenced Design Files
- Dashboard.png: 2880×2484px (Full page screenshot)
- Resume.png: 710×324px (Card component)
- Pomodoro.png: 488×324px (Card component)
- Budget.png: 402×357px (Card component)
- Burnout.png: 414×357px (Card component with icons)
- GWA.png: 398×351px (Card component)
- To DO.png: 536×457px (Card with list items)
- Resource.png: 536×457px (Card with links)

### Implementation Path
1. Create base card component with all specified dimensions
2. Build layout grid with proper spacing
3. Apply typography and color system
4. Implement buttons and interactive elements
5. Add shadow and visual effects
6. Test responsiveness on target viewport

---

**End of Specification Document**

*This document provides measurable specifications for 1:1 recreation of the ULTRACK Dashboard design. All measurements are approximate based on visual analysis and should be refined during implementation based on actual design system constraints.*
