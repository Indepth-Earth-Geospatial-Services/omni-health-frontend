# Typography Guide

This document describes all available typography styles in the Omni Health application.

## Available Fonts

- **Geist** - Already installed (primary font)
- **SF Pro Display** - Loaded via CDN
- **Helvetica Neue** - System font fallback
- **Inter** - Loaded via Google Fonts

## Typography Classes

### 1. Heading Text (.text-heading)
**Use for:** Main headings, page titles
```tsx
<h1 className="text-heading">Find Healthcare Facilities near you</h1>
```
- Font: Geist
- Weight: 500 (Medium)
- Size: 23px
- Line height: 100%

### 2. Body Text (.text-body)
**Use for:** Main content, paragraphs, descriptions
```tsx
<p className="text-body">This is the main body text</p>
```
- Font: SF Pro Display
- Weight: 400 (Regular)
- Size: 16px
- Line height: 100%

### 3. Secondary Text (.text-secondary)
**Use for:** Supporting text, captions
```tsx
<p className="text-secondary">Secondary information</p>
```
- Font: Geist
- Weight: 400 (Regular)
- Size: 15px
- Line height: 100%

### 4. Small Text (.text-small)
**Use for:** Timestamps, metadata, fine print
```tsx
<span className="text-small">Opens at 11:00 am</span>
```
- Font: Helvetica Neue
- Weight: 400 (Regular)
- Size: 12.28px
- Line height: 19.65px

### 5. Label Text (.text-label)
**Use for:** Form labels, buttons, badges
```tsx
<label className="text-label">Your Location</label>
<button className="text-label">Search</button>
```
- Font: SF Pro Display
- Weight: 500 (Medium)
- Size: 14px
- Line height: 100%

### 6. Interactive Text (.text-interactive)
**Use for:** Buttons, links, interactive elements
```tsx
<button className="text-interactive">Click Here</button>
<a className="text-interactive">View Details</a>
```
- Font: Inter
- Weight: 500 (Medium)
- Size: 14px
- Line height: 140%

## Tailwind Font Family Utilities

You can also use Tailwind classes with these fonts:

```tsx
<p className="font-geist text-lg">Geist font</p>
<p className="font-sf-pro text-base">SF Pro Display font</p>
<p className="font-helvetica text-sm">Helvetica Neue font</p>
<p className="font-inter text-sm">Inter font</p>
```

## Usage Examples

### Sidebar Header
```tsx
<h2 className="text-heading">Find Healthcare Facilities near you</h2>
<p className="text-secondary">We need your location to find our nearest restaurant to you</p>
```

### Facility Card
```tsx
<h4 className="text-body font-semibold">Akuloma Healthcare Centre</h4>
<p className="text-secondary">Akuloma PH, UG13, RS</p>
<span className="text-small">Opens at 11:00 am</span>
```

### Form
```tsx
<label className="text-label">Your Location</label>
<input type="text" className="text-secondary" />
<button className="text-label">Search</button>
```

## Combining with Tailwind

You can combine typography classes with Tailwind utilities:

```tsx
<h1 className="text-heading text-gray-900 mb-4">
  Heading with custom color and margin
</h1>

<p className="text-body text-gray-600 leading-relaxed">
  Body text with custom color and line height
</p>
```

## Quick Reference Table

| Class | Font | Weight | Size | Line Height | Use Case |
|-------|------|--------|------|-------------|----------|
| `.text-heading` | Geist | 500 | 23px | 100% | Headings |
| `.text-body` | SF Pro | 400 | 16px | 100% | Body text |
| `.text-secondary` | Geist | 400 | 15px | 100% | Secondary text |
| `.text-small` | Helvetica | 400 | 12.28px | 19.65px | Small text |
| `.text-label` | SF Pro | 500 | 14px | 100% | Labels/Buttons |
| `.text-interactive` | Inter | 500 | 14px | 140% | Interactive elements |
