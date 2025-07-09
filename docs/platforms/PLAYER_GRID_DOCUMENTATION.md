# Player Grid Visualization - Data Model & Logic

## Overview

The Player Grid is a motivational, color-progressive heatmap that visualizes player recruitment progress. It serves as the focal point of the team home screen, encouraging Matt and Brian to move players from "new" to "successful college recruit."

## Data Model

### Core Types

#### Player Progress
```typescript
interface PlayerProgress {
  playerId: string;
  completionLevel: number; // 0-100
  status: PlayerStatus;
  milestones: PlayerMilestone[];
  lastActivity: Date;
  colorStage: ColorStage;
}
```

#### Player Status (Journey Stages)
```typescript
type PlayerStatus = 
  | 'new'              // Just entered system
  | 'profile_populated' // Basic info added
  | 'engaged'          // First communication
  | 'participating'    // Attended camp/clinic
  | 'recruited'        // College offer received
  | 'successful';      // Committed to college
```

#### Color Stages (Visual Progression)
```typescript
type ColorStage = 
  | 'bone_white'    // #F5F5F5 - New player, minimal info
  | 'player_pink'   // #DC3545 - Profile populated
  | 'pink_medium'   // #B02A37 - More engagement
  | 'pink_dark'     // #8B1F29 - Active participation
  | 'gold';         // #FFD700 - Successful college recruit
```

## Progress Calculation Logic

### Profile Completion (40 points max)
- **Fields tracked**: name, position, grad year, email, phone, parent name, date of birth
- **Calculation**: `(completedFields / totalFields) * 40`

### Milestone Points (60 points max)
Each milestone has a point value:

| Milestone | Points | Description |
|-----------|--------|-------------|
| `profile_complete` | 10 | Profile fully populated |
| `contact_info_added` | 5 | Contact information added |
| `notes_added` | 3 | Notes added to player record |
| `tags_added` | 2 | Tags added to player |
| `first_communication` | 8 | First communication initiated |
| `camp_registered` | 15 | Player registered for camp |
| `camp_attended` | 25 | Player attended camp |
| `coach_contacted` | 12 | College coach contacted |
| `college_interest` | 20 | College shows interest |
| `recruitment_offer` | 35 | Recruitment offer received |
| `commitment_made` | 50 | Player committed to college |

### Status Determination
```typescript
function determinePlayerStatus(completionLevel: number, milestones: PlayerMilestone[]): PlayerStatus {
  if (completionLevel >= 90 && milestones.some(m => m.type === 'commitment_made')) {
    return 'successful';
  }
  if (completionLevel >= 80 && milestones.some(m => m.type === 'recruitment_offer')) {
    return 'recruited';
  }
  if (completionLevel >= 60 && milestones.some(m => m.type === 'camp_attended')) {
    return 'participating';
  }
  if (completionLevel >= 40 && milestones.some(m => m.type === 'first_communication')) {
    return 'engaged';
  }
  if (completionLevel >= 20) {
    return 'profile_populated';
  }
  return 'new';
}
```

### Color Stage Determination
```typescript
function determineColorStage(completionLevel: number, status: PlayerStatus): ColorStage {
  switch (status) {
    case 'successful': return 'gold';
    case 'recruited': return 'pink_dark';
    case 'participating': return 'pink_medium';
    case 'engaged': return 'player_pink';
    case 'profile_populated': return 'player_pink';
    case 'new': default: return 'bone_white';
  }
}
```

## Grid Visualization

### Grid Cell Structure
Each player is represented as a square cell containing:
- **Player initials** (white text)
- **Progress percentage** (white text, smaller)
- **Status badge** (colored dot in corner)
- **Background color** (based on progress stage)

### Status Badges
Default badges with Noun Project icons:
- **Recruitable** (red) - Player shows potential
- **Coachable** (lime) - Player demonstrates coachability  
- **Needs Follow-up** (orange) - Requires attention

### Grid Layout
- **10 columns** by default
- **Responsive** - adjusts based on screen size
- **Hover effects** - scale and shadow on hover
- **Click handling** - opens detailed player view (future)

## View Modes

### All Players View (Default)
- Shows all players in a single grid
- Sorted by progress (highest first)
- Color progression visible across entire dataset

### Cohort/Camp View
- Groups players by camp/clinic
- Each cohort shows as a sub-grid
- Enrollment progress visible per cohort
- 100 spots per camp (as specified)

## Motivational Design

### Psychological Elements
1. **Color Progression**: White → Pink → Gold creates visual journey
2. **Percentage Display**: Shows exact progress (motivates completion)
3. **Status Badges**: Quick visual indicators for action items
4. **Hover Information**: Shows player name and progress on hover
5. **Grid Density**: More filled cells = more success

### Gamification Features
- **Point System**: Each milestone awards points
- **Progress Tracking**: Visual completion percentage
- **Status Advancement**: Clear progression through stages
- **Activity Tracking**: Last activity date for urgency

## Integration Points

### Data Sources
- **Player Database**: Existing player records
- **CSV Import**: Matt's spreadsheet data
- **Milestone Tracking**: Manual and automated milestone creation
- **Notes/Comments**: Team collaboration data

### Future Features
- **Detailed Modal**: Click player for full profile
- **Filtering**: By status, position, graduation year
- **Search**: Find specific players
- **Export**: Progress reports
- **Analytics**: Progress trends and insights

## Usage Instructions

### For Matt & Brian
1. **View Progress**: See all players at a glance
2. **Identify Priorities**: White cells need attention
3. **Track Success**: Gold cells = successful recruits
4. **Toggle Views**: Switch between all players and camp cohorts
5. **Click Players**: Access detailed information (future)

### For Development
1. **Add Milestones**: Use `addMilestone()` function
2. **Update Progress**: Call `calculatePlayerProgress()`
3. **Customize Colors**: Modify `COLORS` object
4. **Add Badges**: Extend `DEFAULT_STATUS_BADGES`
5. **Integrate Data**: Connect to real player database

## Technical Implementation

### Key Files
- `src/types/index.ts` - Type definitions
- `src/utils/playerProgress.ts` - Progress calculation logic
- `src/components/PlayerGrid.tsx` - Grid visualization component
- `src/components/TeamPortal.tsx` - Integration with team dashboard

### Dependencies
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Custom color palette matching brand guidelines

This system provides a foundation for building a comprehensive player recruitment management platform that motivates the team to achieve their goals of getting players recruited to college sports programs. 