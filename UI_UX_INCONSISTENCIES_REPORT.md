# UI/UX Inconsistencies Report
## CyberCertitude Platform - Analysis Date: $(date)

---

## Executive Summary

This report identifies UI/UX inconsistencies across the CyberCertitude platform that should be standardized using the design tokens defined in `src/shared/design-tokens.ts`.

### Critical Issues Found:
1. **Color System Inconsistencies** - Hardcoded colors instead of design tokens
2. **Button Pattern Inconsistencies** - Mixed button implementations
3. **Card/Container Inconsistencies** - Inconsistent surface and border colors
4. **Typography Inconsistencies** - Hardcoded font sizes and weights
5. **Spacing Inconsistencies** - Inconsistent padding and margins
6. **Dark Mode Inconsistencies** - Mixed dark mode implementations

---

## 1. Color System Inconsistencies

### Issue: Hardcoded Gray Colors
**Problem:** Components use hardcoded Tailwind gray colors instead of design tokens.

**Examples Found:**
- `bg-gray-50`, `bg-gray-100`, `bg-gray-200`, `bg-gray-800` 
- `text-gray-600`, `text-gray-800`, `text-gray-500`
- `border-gray-200`, `border-gray-300`, `border-gray-700`

**Files Affected:**
- `src/components/ComplianceAssessmentWizard.tsx` (multiple instances)
- `src/components/EnhancedDashboard.tsx` (multiple instances)
- Many feature components

**Should Use:**
- `bg-surface-light dark:bg-surface-dark` instead of `bg-white dark:bg-gray-800`
- `bg-background-light dark:bg-background-dark` for page backgrounds
- `text-text-primary-light dark:text-text-primary-dark` instead of `text-gray-800`
- `text-text-secondary-light dark:text-text-secondary-dark` instead of `text-gray-600`
- `border-support-light dark:border-support-dark` instead of `border-gray-200 dark:border-gray-700`

### Issue: Hardcoded Blue Colors
**Problem:** Components use hardcoded blue colors instead of primary/secondary design tokens.

**Examples Found:**
- `bg-blue-600`, `bg-blue-700`, `bg-blue-50`, `bg-blue-100`
- `text-blue-600`, `text-blue-700`
- `border-blue-200`, `border-blue-500`

**Files Affected:**
- `src/features/reporting/components/AssessmentReportsPage.tsx`
- `src/features/evidence/components/EvidenceCollectionDashboard.tsx`
- `src/components/ComplianceAssessmentWizard.tsx`

**Should Use:**
- `bg-primary-500`, `bg-primary-600` instead of `bg-blue-600`, `bg-blue-700`
- `text-primary-500`, `text-primary-400` instead of `text-blue-600`, `text-blue-400`
- `bg-primary-50`, `bg-primary-100` instead of `bg-blue-50`, `bg-blue-100`

---

## 2. Button Pattern Inconsistencies

### Issue: Inconsistent Button Implementations
**Problem:** Buttons are implemented in multiple ways:
1. Using hardcoded classes: `bg-blue-600 hover:bg-blue-700`
2. Using Button component (correct)
3. Using CSS classes: `.btn-primary` (correct)

**Examples of Hardcoded Buttons:**
```tsx
// WRONG - ComplianceAssessmentWizard.tsx
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">

// WRONG - EnhancedDashboard.tsx  
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">

// CORRECT - Should be:
<Button variant="primary" size="lg">...</Button>
// OR
<button className="btn-primary px-6 py-3 rounded-lg">
```

**Files Affected:**
- `src/components/ComplianceAssessmentWizard.tsx` (lines 330, 439, 448)
- `src/components/EnhancedDashboard.tsx` (line 152)
- Many feature components

**Recommendation:**
- Standardize on either:
  1. Using the `Button` component from `src/shared/components/ui/Button.tsx`
  2. OR using CSS classes like `.btn-primary`, `.btn-secondary` defined in `src/index.css`

---

## 3. Card/Container Inconsistencies

### Issue: Inconsistent Surface Colors
**Problem:** Cards use different color patterns for backgrounds and borders.

**Current Mixed Usage:**
```tsx
// Pattern 1 (INCORRECT):
bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700

// Pattern 2 (CORRECT - Design System):
bg-surface-light dark:bg-surface-dark border border-support-light dark:border-support-dark
```

**Files Using Incorrect Pattern:**
- `src/shared/components/layout/StartScreen.tsx`
- `src/features/reporting/components/AssessmentReportsPage.tsx`
- `src/components/HowItWorks.tsx`
- `src/components/WorkflowGuidance.tsx`
- `src/components/EnhancedUserOnboarding.tsx`

**Recommendation:**
- Use `.card-standard` or `.card-elevated` CSS classes from `src/index.css`
- OR use design tokens: `bg-surface-light dark:bg-surface-dark border border-support-light dark:border-support-dark`

### Issue: Inconsistent Border Radius
**Problem:** Mixed usage of border radius values.

**Examples:**
- `rounded-lg` (8px)
- `rounded-xl` (12px) 
- `rounded-2xl` (16px)
- `rounded-full`

**Recommendation:**
- Standardize on `rounded-xl` for cards (matches design tokens: `borderRadius.xl`)
- Use `rounded-lg` for smaller elements
- Use `rounded-full` only for pills/badges

---

## 4. Typography Inconsistencies

### Issue: Hardcoded Font Sizes
**Problem:** Font sizes are hardcoded instead of using typography scale.

**Examples Found:**
```tsx
// Current:
className="text-3xl font-bold text-gray-800"
className="text-xl font-semibold text-gray-800"
className="text-lg font-medium text-gray-600"

// Should be:
className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark"
```

**Typography Scale (from design tokens):**
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

**Recommendation:**
- Use design token text colors with font size classes
- Consider creating typography utility classes in CSS

---

## 5. Spacing Inconsistencies

### Issue: Inconsistent Padding and Margins
**Problem:** Padding and margins vary across similar components.

**Examples:**
- Cards: `p-4`, `p-6`, `p-8`, `p-12`
- Margins: `mb-4`, `mb-6`, `mb-8`, `mb-12`

**Spacing Scale (from design tokens):**
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)

**Recommendation:**
- Standardize card padding:
  - Small cards: `p-4` or `p-6`
  - Standard cards: `p-6` or `p-8`
  - Large cards: `p-8` or `p-12`
- Use consistent margin scale

---

## 6. Dark Mode Inconsistencies

### Issue: Mixed Dark Mode Color Patterns
**Problem:** Some components use proper design tokens, others use hardcoded dark colors.

**Inconsistent Patterns:**
```tsx
// Pattern 1 (INCORRECT):
bg-white dark:bg-gray-800
text-gray-800 dark:text-white
border-gray-200 dark:border-gray-700

// Pattern 2 (CORRECT):
bg-surface-light dark:bg-surface-dark
text-text-primary-light dark:text-text-primary-dark
border-support-light dark:border-support-dark
```

**Files Needing Updates:**
- `src/components/ComplianceAssessmentWizard.tsx` - Uses hardcoded colors, no dark mode
- `src/components/EnhancedDashboard.tsx` - Uses hardcoded colors, no dark mode
- `src/shared/components/layout/StartScreen.tsx` - Uses `dark:bg-gray-800`

---

## 7. Input/Form Inconsistencies

### Issue: Inconsistent Input Styling
**Problem:** Form inputs use different styling patterns.

**Examples Found:**
```tsx
// Pattern 1:
className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"

// Pattern 2 (CORRECT):
className="input-standard"
```

**Recommendation:**
- Use `.input-standard` class from `src/index.css`
- Use `.input-error` for error states
- Or use the `Input` component from `src/shared/components/ui/Input.tsx`

---

## Priority Fix List

### High Priority (Affects Visual Consistency)
1. ✅ Replace all `bg-white dark:bg-gray-800` with `bg-surface-light dark:bg-surface-dark`
2. ✅ Replace all `text-gray-800` with `text-text-primary-light dark:text-text-primary-dark`
3. ✅ Replace all `bg-blue-600` buttons with `.btn-primary` or Button component
4. ✅ Standardize card styling using `.card-standard` class

### Medium Priority (Affects User Experience)
5. ✅ Standardize border radius (use `rounded-xl` for cards)
6. ✅ Replace `border-gray-200 dark:border-gray-700` with `border-support-light dark:border-support-dark`
7. ✅ Standardize spacing (padding/margins)
8. ✅ Replace hardcoded blue colors with primary design tokens

### Low Priority (Nice to Have)
9. ✅ Standardize typography using utility classes
10. ✅ Create shared component patterns documentation
11. ✅ Add Storybook stories for consistent component usage

---

## Recommendations

### Immediate Actions:
1. **Create a design system migration plan** - Prioritize high-traffic pages first
2. **Update component library** - Ensure all shared components use design tokens
3. **Add linting rules** - Prevent hardcoded colors in new code
4. **Create style guide documentation** - Document approved patterns

### Long-term Actions:
1. **Component audit** - Review all components for consistency
2. **Automated testing** - Visual regression testing for UI consistency
3. **Design token expansion** - Add more semantic tokens if needed
4. **Developer education** - Team training on design system usage

---

## Files Requiring Updates (Sample)

### Critical Files:
- `src/components/ComplianceAssessmentWizard.tsx` - Complete rewrite needed
- `src/components/EnhancedDashboard.tsx` - Major updates needed
- `src/components/HowItWorks.tsx` - Card styling updates
- `src/features/reporting/components/AssessmentReportsPage.tsx` - Color updates

### Medium Priority:
- `src/shared/components/layout/StartScreen.tsx` - Surface color updates
- `src/features/evidence/components/EvidenceCollectionDashboard.tsx` - Button and color updates
- `src/components/WorkflowGuidance.tsx` - Card styling updates

---

## Design Token Reference

All design tokens are defined in:
- **Tokens File:** `src/shared/design-tokens.ts`
- **Tailwind Config:** `tailwind.config.js`
- **CSS Classes:** `src/index.css` (Layer: components)

### Key Design Token Classes:
- **Colors:** `bg-primary-500`, `text-primary-500`, `bg-surface-light`, `bg-background-light`
- **Text:** `text-text-primary-light`, `text-text-secondary-light`, `text-text-muted-light`
- **Borders:** `border-support-light`, `border-support-dark`
- **Buttons:** `.btn-primary`, `.btn-secondary`, `.btn-accent`, `.btn-ghost`
- **Cards:** `.card-standard`, `.card-elevated`
- **Inputs:** `.input-standard`, `.input-error`

---

**Report Generated:** $(date)
**Analyzed Files:** 50+ components
**Issues Found:** 100+ instances of inconsistencies
