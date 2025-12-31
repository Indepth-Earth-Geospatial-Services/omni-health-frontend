# Map Integration Documentation

## Overview
Production-grade Mapbox GL JS integration for healthcare facility location and navigation.

## Setup Instructions

### 1. Get Mapbox Access Token
1. Create account at [mapbox.com](https://www.mapbox.com/)
2. Navigate to Account → Tokens
3. Create new token with these scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
4. Copy token to `.env.local`:
   ```bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoi...your_token_here
   ```

### 2. Environment Variables

**.env.local** (Your local environment):
```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_actual_token_here
NEXT_PUBLIC_API_BASE_URL=https://omni-health-backend.onrender.com/api/v1
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12
NEXT_PUBLIC_MAP_DEFAULT_LAT=4.8156
NEXT_PUBLIC_MAP_DEFAULT_LNG=7.0498
```

**.env.example** (Template for team):
```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
NEXT_PUBLIC_API_BASE_URL=https://omni-health-backend.onrender.com/api/v1
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=12
NEXT_PUBLIC_MAP_DEFAULT_LAT=4.8156
NEXT_PUBLIC_MAP_DEFAULT_LNG=7.0498
```

## Features Implemented

### ✅ Core Functionality
- **Auto-location detection** - Requests user's location on mount
- **Facility pins** - Color-coded markers (green = open, red = closed)
- **Interactive popups** - Shows facility details on marker click
- **User location marker** - Animated blue dot showing current position
- **Dynamic map padding** - Adjusts when sidebar opens/closes
- **Facility bounds** - Auto-fits map to show all facilities
- **Port Harcourt focus** - Centers on PH by default

### ✅ API Integration
All endpoints integrated:
- `GET /facilities` - All facilities
- `POST /facilities/detect-location` - Facilities by user location
- `GET /facilities/nearest` - Nearest facilities
- `GET /facilities/{id}` - Single facility details
- `POST /routing/between-points` - Distance calculation

### ✅ Security
- Input sanitization on all user inputs
- XSS prevention
- Rate limiting ready (API side)
- No sensitive data in client storage
- Secure token handling

### ✅ Performance
- Dynamic import (no SSR overhead)
- Marker pooling (reuse DOM elements)
- Debounced map events
- Lazy loading
- Request caching with React Query (ready to integrate)

### ✅ Accessibility
- Keyboard navigation support
- ARIA labels on all controls
- Screen reader friendly
- High contrast markers
- Focus indicators

## Architecture

```
src/
├── components/
│   └── map/
│       └── FacilityMap.tsx        # Main map component
├── hooks/
│   └── useGeolocation.ts          # Location hook
├── lib/
│   └── api-client.ts              # API wrapper
└── types/
    └── api.ts                      # API type definitions
```

## Map Component Usage

```tsx
import FacilityMap from '@/components/map/FacilityMap';

<FacilityMap
  isSidebarOpen={boolean}
  onFacilitySelect={(facility) => {
    // Handle facility selection
  }}
/>
```

## Map Padding Logic

The map automatically adjusts padding when sidebar opens/closes:

- **Sidebar Open**: Left padding = 384px (w-96)
- **Sidebar Closed**: No padding
- **Transition**: Smooth 300ms ease

This ensures:
- Map content never hidden behind sidebar
- Facility markers remain visible
- Smooth visual transition

## Marker Styling

### Open Facilities
- Color: Green (#22c55e)
- Icon: SVG pin with white center
- Popup: Shows "Open" status in green

### Closed Facilities
- Color: Red (#ef4444)
- Icon: SVG pin with white center
- Popup: Shows "Closed" status in red

### User Location
- Blue circle (#4A90E2)
- White border
- Pulsing animation
- Always visible on map

## Custom Popup Content

```html
<div class="p-3">
  <h3>{facility.name}</h3>
  <p>{facility.address}</p>
  <div>
    <span class="status">{Open/Closed}</span>
    <span class="distance">{X.X km away}</span>
  </div>
</div>
```

## Error Handling

### Geolocation Errors
- Permission denied → Yellow warning banner
- Position unavailable → Fallback to Port Harcourt
- Timeout → Retry with cached position

### API Errors
- Network failure → Retry with exponential backoff
- 404 → Show empty state
- 500 → Error banner with retry option

### Map Errors
- Invalid token → Error overlay
- Style load failure → Fallback style
- Render error → Graceful degradation

## Performance Metrics

Target metrics:
- **Initial Load**: < 2s
- **Marker Render**: < 100ms for 50 facilities
- **Map Interaction**: < 16ms (60fps)
- **API Response**: < 1s with caching

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Optimization

- Touch-friendly markers (44x44px min)
- Responsive sidebar (collapses on mobile)
- Geolocation fallback
- Reduced motion support

## TODO for Production

- [ ] Implement React Query for API caching
- [ ] Add facility detail modal
- [ ] Implement routing visualization
- [ ] Add facility filtering by type
- [ ] Implement search on map
- [ ] Add clustering for many markers
- [ ] Implement offline map tiles
- [ ] Add analytics tracking
- [ ] Implement error boundary
- [ ] Add unit tests for API client

## Troubleshooting

### Map not loading
1. Check Mapbox token in `.env.local`
2. Verify token has correct scopes
3. Check browser console for errors
4. Ensure `NEXT_PUBLIC_` prefix on env vars

### Facilities not showing
1. Check API endpoint connectivity
2. Verify location permissions granted
3. Check browser console for API errors
4. Ensure facilities have valid coordinates

### Sidebar overlapping map
1. Check sidebar width matches map padding
2. Verify z-index layering
3. Check responsive breakpoints

## Security Checklist

- ✅ Environment variables properly secured
- ✅ API client has request/response interceptors
- ✅ No sensitive data in localStorage
- ✅ HTTPS-only in production
- ✅ Input validation on all user inputs
- ✅ XSS prevention
- ⏳ Rate limiting (backend)
- ⏳ CORS configuration (backend)
