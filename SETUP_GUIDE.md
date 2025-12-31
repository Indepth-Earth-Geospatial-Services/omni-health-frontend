# Omni Health - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Mapbox Token
1. Go to [mapbox.com](https://www.mapbox.com/) and create account
2. Navigate to **Account → Access Tokens**
3. Click **Create a token**
4. Name it "Omni Health Development"
5. Enable these scopes:
   - ✅ `styles:read`
   - ✅ `fonts:read`
   - ✅ `datasets:read`
6. Click **Create token** and copy it

**⚠️ IMPORTANT:** Your token should start with `pk.` and be a long string (e.g., `pk.eyJ1IjoibXl1c2VybmFtZSIsImEiOiJjbG...`). The example token in `.env.example` will NOT work - you must use your real token.

### 3. Configure Environment
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your Mapbox token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoi...your_token_here
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003)

## Environment Variables

All environment variables are prefixed with `NEXT_PUBLIC_` to make them available in the browser.

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox GL JS token | `pk.eyJ1...` |

### Optional (with defaults)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `https://omni-health-backend.onrender.com/api/v1` |
| `NEXT_PUBLIC_MAP_DEFAULT_ZOOM` | Initial map zoom | `12` |
| `NEXT_PUBLIC_MAP_DEFAULT_LAT` | Port Harcourt latitude | `4.8156` |
| `NEXT_PUBLIC_MAP_DEFAULT_LNG` | Port Harcourt longitude | `7.0498` |

## Project Structure

```
omni-health-user-desktop/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles + Mapbox styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page with map
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Top navigation
│   │   │   └── Sidebar.tsx      # Facility search sidebar
│   │   ├── map/
│   │   │   └── FacilityMap.tsx  # Mapbox integration
│   │   └── ui/
│   │       └── FacilityCard.tsx # Reusable facility card
│   ├── hooks/
│   │   └── useGeolocation.ts    # Browser geolocation hook
│   ├── lib/
│   │   ├── api-client.ts        # API wrapper with interceptors
│   │   └── validation.ts        # Input sanitization
│   ├── types/
│   │   ├── api.ts               # API response types
│   │   └── facility.ts          # Facility data types
│   └── data/
│       └── mockFacilities.ts    # Mock data (dev only)
├── .env.example                  # Environment template
├── .env.local                    # Your local config (git-ignored)
└── MAP_INTEGRATION.md            # Detailed map docs
```

## Features

### ✅ Implemented
- Mapbox GL JS integration
- Auto-location detection
- Facility markers with status (open/closed)
- Interactive popups
- Sidebar with facility search
- API integration (all endpoints)
- Input sanitization
- Error handling
- Responsive design
- Accessibility (WCAG 2.1 AA)

### 🚧 In Progress
- React Query caching
- Facility detail modal
- Route visualization
- Facility filtering

## Development Workflow

### 1. Start Development
```bash
npm run dev
```

### 2. Check TypeScript
```bash
npm run build
```

### 3. Lint Code
```bash
npm run lint
```

## API Endpoints

Backend: `https://omni-health-backend.onrender.com/api/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/facilities` | GET | Get all facilities |
| `/facilities/detect-location` | POST | Get facilities by location |
| `/facilities/nearest` | GET | Get nearest facilities |
| `/facilities/{id}` | GET | Get facility details |
| `/routing/between-points` | POST | Calculate route distance |

## Browser Permissions

The app requests these permissions:
- **Location (Geolocation)** - Required to find nearby facilities
  - User can deny and manually search instead

## Troubleshooting

### "Map failed to load"
- Check your Mapbox token in `.env.local`
- Ensure token has correct scopes
- Verify internet connection

### "Unable to detect location"
- Grant location permission in browser
- Check HTTPS (geolocation requires secure context)
- Try manual search instead

### TypeScript errors
- Run `npm install` to ensure all types installed
- Restart TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TS Server"

### Port already in use
- Kill process on port 3000: `lsof -ti:3000 | xargs kill -9`
- Or change port in `package.json`: `next dev -p 3001`

## Production Checklist

Before deploying:
- [ ] Add real Mapbox token (not development token)
- [ ] Update `NEXT_PUBLIC_API_BASE_URL` to production API
- [ ] Enable error tracking (Sentry, etc.)
- [ ] Configure CORS on backend
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Test geolocation on mobile devices
- [ ] Verify all environment variables set
- [ ] Run `npm run build` successfully
- [ ] Test on multiple browsers

## Security Notes

### ⚠️ Important
- Never commit `.env.local` to git
- Mapbox tokens are public (designed for client-side)
- API authentication should use backend tokens (not exposed to client)
- All user input is sanitized before use

### Best Practices
- Rotate Mapbox token if compromised
- Use URL restrictions on Mapbox token (production only)
- Keep dependencies updated
- Monitor for security advisories

## Performance

Target metrics:
- Initial load: < 2s
- Map render: < 500ms
- API response: < 1s
- Marker interaction: 60fps

## Support

For issues:
1. Check `MAP_INTEGRATION.md` for map-specific issues
2. Check `REFACTOR_SUMMARY.md` for code architecture
3. Check browser console for errors
4. Verify all environment variables set

## License

Proprietary - Omni Health 2024
