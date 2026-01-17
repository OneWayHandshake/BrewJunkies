# BrewJunkies Feature Backlog

## Legend
- **Impact:** H (High), M (Medium), L (Low)
- **Effort:** S (Small: <1 week), M (Medium: 1-4 weeks), L (Large: 1-3 months), XL (Extra Large: 3+ months)
- **Status:** Not Started, In Progress, Complete

---

## Priority 1: Critical Features (Q1-Q2 2026)

### 1.1 Brewing Timer System
**Impact: H | Effort: L | Status: Complete**

#### Description
A step-by-step guided brewing timer supporting multiple methods with customizable recipes, audio cues, and visual progress indicators.

#### User Stories
- As a user, I want to follow a timed brewing recipe so I can make consistent coffee
- As a user, I want audio cues so I don't have to watch my phone while brewing
- As a user, I want to create custom recipes so I can save my preferred methods
- As a user, I want to see brew progress visually so I know what step I'm on

#### Technical Requirements
- [ ] Create `BrewTimer` component with countdown/count-up modes
- [ ] Create `BrewRecipe` model in Prisma schema
- [ ] Create `BrewStep` model (type: bloom, pour, wait, stir, etc.)
- [ ] Implement recipe CRUD API endpoints
- [ ] Create recipe library page with filtering by method
- [ ] Add audio notification system (Web Audio API)
- [ ] Create visual pour-rate indicator
- [ ] Support methods: V60, AeroPress, Chemex, French Press, Kalita Wave, Clever Dripper
- [ ] Add 4:6 method and Hoffmann techniques as default recipes
- [ ] Create recipe scaling calculator (adjust water/coffee amounts)

#### Acceptance Criteria
- [ ] User can start a pre-built recipe and see step-by-step instructions
- [ ] Timer shows current step with time remaining
- [ ] Audio plays at each step transition
- [ ] User can pause/resume timer
- [ ] User can create and save custom recipes
- [ ] Recipes can be scaled up/down

---

### 1.2 Brew Journal/Logging
**Impact: H | Effort: M | Status: Complete**

#### Description
Allow users to log individual brewing sessions with detailed parameters, tasting notes, and ratings, linked to coffees in their collection.

#### User Stories
- As a user, I want to log my brews so I can track what works
- As a user, I want to rate each brew so I can find my best recipes
- As a user, I want to compare brews of the same coffee to improve
- As a user, I want to see my brewing history over time

#### Technical Requirements
- [ ] Create `BrewLog` model in Prisma schema
  ```prisma
  model BrewLog {
    id            String    @id @default(cuid())
    userId        String
    coffeeId      String?
    method        BrewMethod
    dose          Float     // grams
    yield         Float?    // grams (espresso) or ml (filter)
    grindSetting  String?
    waterTemp     Float?    // celsius
    brewTime      Int?      // seconds
    rating        Int?      // 1-5
    tastingNotes  String[]
    notes         String?
    imageUrl      String?
    recipeId      String?   // if used a recipe
    createdAt     DateTime  @default(now())
  }
  ```
- [ ] Create brew logging API endpoints (CRUD)
- [ ] Create `BrewLogForm` component with all parameters
- [ ] Create `BrewHistory` page showing all logs
- [ ] Create `BrewComparison` view for same coffee
- [ ] Add quick-log button from coffee detail page
- [ ] Link brew logs to Passport (auto-add coffee when logged)
- [ ] Add photo upload for brew results

#### Acceptance Criteria
- [ ] User can log a brew with basic parameters (method, dose, yield, time)
- [ ] User can add tasting notes and rating
- [ ] User can link brew to a coffee in catalog
- [ ] User can view brew history with filters
- [ ] Brews automatically count toward Passport achievements

---

### 1.3 Beanalysis (AI Bean Analysis)
**Impact: H | Effort: L | Status: Complete**

#### Description
AI-powered bean analysis that identifies roast level, suggests brew parameters, and predicts tasting notes from a photo of coffee beans.

#### User Stories
- As a user, I want to analyze my beans to understand their roast level
- As a user, I want AI-suggested brew parameters for my specific beans
- As a user, I want to know likely tasting notes before brewing

#### Technical Requirements
- [x] Create `AnalyzePage` with image upload/drag-drop
- [x] Add analyze endpoint using multi-provider AI system
- [x] Create analysis prompt for coffee bean images
- [x] Return structured data: roast level, bean type, origin guess, tasting notes
- [x] Display brew parameters for espresso and pour-over
- [x] Support multiple AI providers (Claude, GPT-4, Gemini, House Blend)
- [x] Store uploaded images with analysis
- [x] Show confidence scores for predictions

#### Acceptance Criteria
- [x] User can upload or drag-drop image of coffee beans
- [x] AI analyzes roast level with confidence score
- [x] User sees suggested brew parameters (espresso + pour-over)
- [x] User sees predicted tasting notes
- [x] User can choose AI provider for analysis

---

### 1.4 Statistics Dashboard
**Impact: H | Effort: M | Status: Complete**

#### Description
Comprehensive statistics page showing consumption trends, spending, preferences, and insights based on user's coffee journey.

#### User Stories
- As a user, I want to see how much coffee I've consumed over time
- As a user, I want to track my coffee spending
- As a user, I want to understand my flavor preferences
- As a user, I want to see my brewing method distribution

#### Technical Requirements
- [ ] Create `/api/stats` endpoint with aggregated data
- [ ] Create `StatsPage` with chart components
- [ ] Implement charts using Recharts or Chart.js:
  - [ ] Coffees tried over time (line chart)
  - [ ] Origins distribution (pie chart)
  - [ ] Brew methods used (bar chart)
  - [ ] Tasting notes frequency (word cloud or bar)
  - [ ] Roast level preferences (donut chart)
  - [ ] Spending over time (if price data available)
- [ ] Add date range filters (week, month, year, all time)
- [ ] Create "Insights" section with generated observations
- [ ] Add stats summary cards to profile page

#### Acceptance Criteria
- [ ] User can view statistics dashboard
- [ ] Charts render with their data
- [ ] Date range filter works
- [ ] Stats update when new brews/coffees are added

---

## Priority 2: High-Value Features (Q2-Q3 2026)

### 2.1 Interactive Flavor Wheel
**Impact: M | Effort: S | Status: Complete**

#### Description
SCA-based interactive flavor wheel for exploring and selecting tasting notes in reviews and filters.

#### Technical Requirements
- [ ] Create `FlavorWheel` component (SVG-based)
- [ ] Implement tier navigation (general → specific)
- [ ] Add click-to-select functionality
- [ ] Integrate into review creation flow
- [ ] Add flavor filtering to coffee catalog
- [ ] Create flavor profile visualization on coffee detail

#### Acceptance Criteria
- [ ] User can explore flavor wheel interactively
- [ ] Clicking selects tasting notes
- [ ] Selected notes are used in reviews/filters

---

### 2.2 Social Features (Basic)
**Impact: H | Effort: L | Status: Not Started**

#### Description
Enable users to follow others, see an activity feed, and share their coffee journey.

#### Technical Requirements
- [ ] Create `Follow` model (follower/following relationship)
- [ ] Create `Activity` model for feed items
- [ ] Add follow/unfollow endpoints
- [ ] Create activity feed page
- [ ] Make profiles optionally public
- [ ] Add share buttons for coffees/reviews
- [ ] Create "Discover" section showing trending coffees

#### Acceptance Criteria
- [ ] User can follow other users
- [ ] User sees activity feed from followed users
- [ ] User can set profile to public/private
- [ ] User can share coffees externally

---

### 2.3 Bean Inventory Management
**Impact: M | Effort: M | Status: Not Started**

#### Description
Track coffee bean inventory with freshness alerts and usage tracking.

#### Technical Requirements
- [ ] Add inventory fields to `UserCoffee` or create `Inventory` model
- [ ] Track: purchase date, roast date, weight purchased, weight remaining
- [ ] Create inventory dashboard
- [ ] Add freshness indicator (days since roast)
- [ ] Create "running low" alerts
- [ ] Deduct weight when logging brews

#### Acceptance Criteria
- [ ] User can add coffee to inventory with weight
- [ ] Freshness indicator shows
- [ ] Weight decreases when brews are logged
- [ ] User gets notification when running low

---

### 2.4 Coffee Shop Finder
**Impact: M | Effort: L | Status: Not Started**

#### Description
Map-based discovery of specialty coffee shops with community submissions.

#### Technical Requirements
- [ ] Create `CoffeeShop` model with location data
- [ ] Integrate mapping library (Mapbox or Google Maps)
- [ ] Create map view with pins
- [ ] Add shop submission form
- [ ] Create shop detail page with info
- [ ] Add check-in functionality
- [ ] Link to Passport for "cafes visited" achievement

#### Acceptance Criteria
- [ ] User can view map of coffee shops
- [ ] User can submit new shops
- [ ] User can check in at shops
- [ ] Map filters by location/rating

---

## Priority 3: Medium Features (Q3-Q4 2026)

### 3.1 Grinder Dial-in Assistant
**Impact: M | Effort: M | Status: Complete**

Track grind settings per coffee and suggest starting points for new beans.

#### Implementation
- Grinder management (CRUD for user's grinders with brand, model, burr type)
- Grind settings tracking per grinder/coffee/brew method combination
- "Dialed In" marking for preferred settings
- Intelligent suggestions based on:
  - Exact coffee match (high confidence)
  - Same roast level match (medium confidence)
  - Any dialed-in setting for method (low confidence)
- Accessible at `/grinders` (authenticated users)

### 3.2 Caffeine Tracking
**Impact: M | Effort: M | Status: Not Started**

Log caffeine intake with daily totals and sleep impact estimation.

### 3.3 Bluetooth Scale Integration
**Impact: M | Effort: XL | Status: Not Started**

Support popular Bluetooth scales for real-time weight during brewing.

### 3.4 Recipe Sharing
**Impact: L | Effort: M | Status: Complete**

Share and import brew recipes with the community.

#### Implementation
- Recipes can be marked as "Public" when creating/editing
- Community Recipes page at `/recipes/community` showing all public recipes
- Clone functionality to copy community recipes to user's collection
- Cloned recipes track their source via `clonedFromId`
- Pagination and filtering by brew method

---

## Priority 4: Nice-to-Have Features (2027+)

| Feature | Impact | Effort | Status |
|---------|--------|--------|--------|
| Water Quality Calculator | L | S | Not Started |
| TDS/Extraction Calculator | L | S | Not Started |
| Equipment Profiles | L | S | Not Started |
| Data Export (CSV/JSON) | M | S | Not Started |
| ~~Dark Mode~~ | L | S | **Complete** |
| PWA/Offline Support | M | L | Not Started |
| Apple Watch App | L | XL | Not Started |
| Cupping Session Tool | L | M | Not Started |

---

## Quick Wins (< 1 Week Each)

### Immediate Improvements
- [x] **Dark Mode Toggle** - Theme switcher with light/dark/system modes in header
- [x] **Enhanced Profile Stats** - Shows brew count, coffees tried, favorites, reviews, recipes, analyses + top origins + recent brews
- [x] **Share Buttons** - Social share (Twitter, Facebook, WhatsApp) on coffee detail pages with native share API support
- [x] **Keyboard Shortcuts** - Navigation shortcuts (Ctrl+H/B/J/K/N, Ctrl+Shift+S/D) with ? to show help dialog
- [x] **Recent Activity Widget** - Shows last 5 brews on home page for authenticated users

### Bug Fixes & Polish
- [ ] Improve mobile responsiveness on flavor wheel
- [x] **Loading Skeletons** - Skeleton components for cards, lists, profiles, stats
- [ ] Optimize image loading with lazy load
- [x] **Empty State Illustrations** - Illustrated empty states for brews, coffees, recipes, grinders, stats

---

## Technical Debt to Address

- [ ] Add comprehensive error handling
- [ ] Implement request caching strategy
- [ ] Add rate limiting to API
- [ ] Set up monitoring/analytics
- [ ] Add end-to-end tests
- [ ] Document API endpoints
- [ ] Set up CI/CD pipeline

---

## Notes

### User Research Insights
1. Users prioritize **practical daily-use features** over advanced analytics
2. **Friction in logging** is the #1 reason users abandon coffee apps
3. **Visual feedback** (charts, badges) increases engagement significantly
4. **Social proof** (community activity) drives discovery and retention

### Technical Considerations
1. Consider WebSocket for real-time timer sync across devices
2. Bluetooth Web API has limited browser support - may need native app
3. Map data storage costs can scale quickly - consider aggregation
4. AI bag scanning could use existing provider infrastructure

### Competitive Moat
Our unique AI analysis capabilities should be extended:
- Bag scanning leverages our multi-provider AI system
- Analysis results could inform brew recommendations
- Quality scoring could differentiate from visual-only apps

---

*Last Updated: January 2026*
*Review Cycle: Monthly*
