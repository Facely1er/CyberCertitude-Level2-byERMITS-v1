# Placeholder Pages Implementation Plan

## Issues Identified
1. **Breadcrumb Spacing Inconsistency**: Some pages use `mb-6`, others have extra `<div>` wrappers
2. **Container Inconsistency**: Mix of `container-responsive section-padding`, `max-w-7xl mx-auto`, `max-w-6xl mx-auto`
3. **Extra Spacing**: Some pages have multiple `<div className="mb-6">` wrappers creating extra space

## Standard Pattern to Apply

```tsx
<div className="container-responsive section-padding">
  {/* Breadcrumbs - consistent spacing */}
  <div className="mb-8">
    <Breadcrumbs items={breadcrumbs} />
  </div>

  {/* Header - no extra wrapper divs */}
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
    <div className="p-6">
      {/* Header content */}
    </div>
  </div>

  {/* Page content */}
</div>
```

## Pages to Fix Spacing On

1. **src/routes/assets.tsx** - 5 placeholder pages (categories, dependencies, workflow, roadmap, action-plan)
2. **src/features/audit/components/EvidenceCollector.tsx** - has double mb-6
3. **src/features/assessment/components/AssessmentIntroScreen.tsx** - different container class
4. **src/features/assets/components/AssetDetailView.tsx** - has back button still

## Priority Order

### Phase 1: Fix Spacing Issues (Immediate)
1. Standardize container classes to `container-responsive section-padding`
2. Fix breadcrumb spacing to consistent `mb-8`
3. Remove double `mb-6` div wrappers
4. Remove any remaining back buttons

### Phase 2: Implement Asset Pages (Next)
1. Asset Categories - categorization interface
2. Asset Dependencies - relationship mapping
3. Asset Workflow - lifecycle management
4. Asset Roadmap - timeline planning
5. Asset Action Plan - task management

