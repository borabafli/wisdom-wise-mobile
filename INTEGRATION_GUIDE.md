# Integration Guide: Stoic-Inspired Components

This guide shows how to integrate the new Stoic-inspired components into your app.

## Components Created

### 1. ExerciseLibrary Screen (Updated)
**File**: `src/screens/ExerciseLibrary.tsx`

**Features**:
- Clean Stoic app-inspired design with white cards
- Featured & For You section with upcoming events
- Your Mindful Library organized sections (Collections, Weekly Themes, Daily Essentials, Well-Being SOS)
- Quick practice cards for breathing and meditation
- Search bar integration

### 2. QuickActionsPopup Component
**File**: `src/components/QuickActionsPopup.tsx`

**Usage**:
```tsx
import QuickActionsPopup from '../components/QuickActionsPopup';

const [showQuickActions, setShowQuickActions] = useState(false);

const handleQuickActionSelect = (action: string) => {
  switch (action) {
    case 'breathing':
      // Start breathing exercise
      break;
    case 'gratitude':
      // Start gratitude practice
      break;
    // ... other actions
  }
};

// In render:
<QuickActionsPopup 
  visible={showQuickActions}
  onClose={() => setShowQuickActions(false)}
  onActionSelect={handleQuickActionSelect}
/>
```

### 3. ExerciseCompletionRating Component
**File**: `src/components/ExerciseCompletionRating.tsx`

**Features**:
- Sleep rating slider style from Stoic app
- 1-5 rating scale with text descriptions
- Animated slider with visual feedback
- Progress indicator
- Beautiful illustrations

**Usage**:
```tsx
import ExerciseCompletionRating from '../components/ExerciseCompletionRating';

const [showRating, setShowRating] = useState(false);

const handleRatingSubmit = async (rating: number) => {
  await exerciseRatingService.saveRating({
    exerciseId: 'breathing-exercise',
    exerciseName: 'Breathing Exercise',
    rating,
    category: 'Breathing',
  });
};

// In render:
<ExerciseCompletionRating
  visible={showRating}
  exerciseName="Breathing Exercise"
  onClose={() => setShowRating(false)}
  onRatingSubmit={handleRatingSubmit}
/>
```

### 4. Exercise Rating Service
**File**: `src/services/exerciseRatingService.ts`

**Features**:
- Store exercise ratings locally with AsyncStorage
- Calculate insights and trends
- Average ratings by category
- Top rated exercises
- Rating trends over time

**Usage**:
```tsx
import { exerciseRatingService } from '../services/exerciseRatingService';

// Save a rating
await exerciseRatingService.saveRating({
  exerciseId: 'breathing-001',
  exerciseName: 'Deep Breathing',
  rating: 4,
  category: 'Breathing',
});

// Get insights for dashboard
const insights = await exerciseRatingService.getRatingInsights();
console.log('Average rating:', insights.averageRating);
console.log('Total ratings:', insights.totalRatings);
console.log('Top exercises:', insights.topRatedExercises);
```

### 5. useExerciseRating Hook
**File**: `src/hooks/useExerciseRating.ts`

**Features**:
- Manages rating modal state
- Handles rating submission
- Integrates with rating service

**Usage**:
```tsx
import { useExerciseRating } from '../hooks/useExerciseRating';

const {
  showRatingModal,
  exerciseName,
  openRatingModal,
  closeRatingModal,
  submitRating,
  isSubmitting
} = useExerciseRating();

// Open rating modal after exercise completion
const handleExerciseComplete = () => {
  openRatingModal('Breathing Exercise', 'breathing-001', 'Breathing');
};

// In render:
<ExerciseCompletionRating
  visible={showRatingModal}
  exerciseName={exerciseName}
  onClose={closeRatingModal}
  onRatingSubmit={submitRating}
/>
```

## Integration Points

### HomeScreen
- Search bar now opens QuickActionsPopup
- Updated with Stoic-inspired design
- Added state management for popup

### ExerciseLibrary
- Completely redesigned with Stoic app layout
- Multiple sections: Featured, Library, Quick Practice
- Card-based design with proper spacing

### ChatInterface Integration
To integrate the rating system into chat completion:

```tsx
// After exercise completion in ChatInterface
import { useExerciseRating } from '../hooks/useExerciseRating';

const { openRatingModal } = useExerciseRating();

// When exercise flow completes
const handleExerciseComplete = (exerciseData) => {
  openRatingModal(
    exerciseData.name,
    exerciseData.id,
    exerciseData.category
  );
};
```

### Insights Integration
For displaying rating insights in the Insights tab:

```tsx
import { exerciseRatingService } from '../services/exerciseRatingService';

const InsightsScreen = () => {
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const loadInsights = async () => {
      const data = await exerciseRatingService.getRatingInsights();
      setInsights(data);
    };
    loadInsights();
  }, []);

  return (
    <View>
      <Text>Average Rating: {insights?.averageRating}/5</Text>
      <Text>Total Sessions: {insights?.totalRatings}</Text>
      {/* Display other insights */}
    </View>
  );
};
```

## File Structure
```
src/
├── components/
│   ├── QuickActionsPopup.tsx
│   └── ExerciseCompletionRating.tsx
├── hooks/
│   └── useExerciseRating.ts
├── services/
│   └── exerciseRatingService.ts
└── screens/
    ├── HomeScreen.tsx (updated)
    └── ExerciseLibrary.tsx (redesigned)
```

## Design Principles
All components follow the Stoic app's design language:
- Clean white cards with subtle shadows
- Proper spacing and typography
- Gradient accent colors (#04CCEF to #0898D3)
- Modern, minimalist aesthetic
- Accessible touch targets
- Smooth animations and transitions

## Next Steps
1. Integrate rating popup into exercise completion flow
2. Add insights visualization to Insights screen
3. Test user flow from quick actions to completion rating
4. Add analytics to track rating patterns