# VizzarJobs Google Analytics Integration

This document provides information on how Google Analytics 4 (GA4) is integrated into the VizzarJobs platform.

## Setup Overview

Google Analytics 4 is integrated throughout the application using the Measurement ID: `G-F3WJBPTC6F`

### Implementation Details

1. **Core Integration**
   - The main integration is in `src/components/analytics/GoogleAnalytics.tsx`
   - Uses Next.js `Script` component for proper loading
   - Tracks page views automatically on route changes

2. **Analytics Utilities**
   - Located in `src/lib/analytics/index.ts`
   - Provides helper functions for tracking different types of events

3. **Custom Event Tracking**
   - Job search tracking
   - Job view tracking
   - Job application tracking
   - User login/signup tracking

## How to Track New Events

To track a new custom event, import the tracking utilities and use them in your components:

```tsx
import { trackEvent } from "~/lib/analytics";

// Then in your component:
trackEvent({
  action: 'event_name',
  category: 'category',
  label: 'optional_label',
  value: optionalNumericValue
});
```

### Pre-defined Event Helpers

We've created helper functions for common events:

```tsx
import { jobEvents, userEvents, employerEvents } from "~/lib/analytics";

// Examples:
jobEvents.view(jobId, jobTitle);
jobEvents.apply(jobId, jobTitle);
jobEvents.search(searchQuery, resultCount);

userEvents.login(methodName);
userEvents.signup(methodName);

employerEvents.postJob(jobId, jobTitle);
```

## Viewing Analytics Data

1. Log in to [Google Analytics](https://analytics.google.com/)
2. Select the VizzarJobs property
3. Navigate to Reports > Realtime to see current activity
4. Use Exploration for custom reports on specific events

## Best Practices

1. Always use semantic event names that clearly describe the user action
2. Group related events under consistent categories
3. Include relevant metadata with events (IDs, names, etc.)
4. Don't track personally identifiable information (PII)
5. Test your tracking implementation before deploying

## Troubleshooting

If events aren't appearing in Google Analytics:

1. Ensure the correct Measurement ID is being used
2. Check browser console for any errors related to gtag
3. Verify that the event tracking code is being executed
4. Remember that there can be a delay before events appear in the GA interface

For any additional questions or issues with analytics, please contact the development team.
