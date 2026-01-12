# Landing Page Animations Guide

## Features Implemented

### 1. Sticky Navbar on Scroll
- Navbar becomes sticky after scrolling 100px
- Smooth transition with backdrop blur
- Background changes from transparent to primary color

### 2. Scroll Reveal Animations
- Content slides in from bottom when scrolling into view
- Supports 4 directions: up, down, left, right
- Customizable delay for staggered animations

## How to Use

### Using ScrollReveal Component

```tsx
import { ScrollReveal } from "../shared/ScrollReveal";

// Basic usage (slides up from bottom)
<ScrollReveal>
  <h2>Your Content Here</h2>
</ScrollReveal>

// With direction
<ScrollReveal direction="left">
  <div>Slides in from left</div>
</ScrollReveal>

// With delay (for staggered animations)
<ScrollReveal delay={200}>
  <p>Appears 200ms after trigger</p>
</ScrollReveal>

// All options
<ScrollReveal 
  direction="right" 
  delay={400}
  className="custom-class"
>
  <div>Fully customized</div>
</ScrollReveal>
```

### Animation Directions

- `up` (default) - Slides up from bottom
- `down` - Slides down from top
- `left` - Slides from left
- `right` - Slides from right

### Example: Staggered Cards

```tsx
<div className="grid md:grid-cols-3 gap-8">
  <ScrollReveal delay={0}>
    <Card>Card 1</Card>
  </ScrollReveal>
  
  <ScrollReveal delay={200}>
    <Card>Card 2</Card>
  </ScrollReveal>
  
  <ScrollReveal delay={400}>
    <Card>Card 3</Card>
  </ScrollReveal>
</div>
```

## Files Created

1. `hooks/useScrollAnimation.ts` - Intersection Observer hook
2. `components/shared/ScrollReveal.tsx` - Reusable animation component
3. `components/desktop/Navbar.tsx` - Updated with scroll detection
4. `components/desktop/DemoSection.tsx` - Example implementation

## Customization

### Adjust Animation Duration

Edit `ScrollReveal.tsx` line 27:
```tsx
duration-700  // Change to duration-500, duration-1000, etc.
```

### Adjust Scroll Threshold

Edit `useScrollAnimation.ts` line 5:
```tsx
threshold = 0.1  // Change to 0.5 for 50% visible before animating
```

### Adjust Navbar Scroll Trigger

Edit `Navbar.tsx` line 14:
```tsx
window.scrollY > 100  // Change 100 to your preferred pixel value
```
