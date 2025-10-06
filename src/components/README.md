# AssessmentView Component

A comprehensive assessment view component for CMMC compliance controls that provides a modern, dark-themed interface for evaluating implementation status.

## Features

- **Control Information Header**: Displays control ID, title, priority level, and estimated implementation time
- **Main Question**: Prominent display of the control question
- **Description Section**: Information about what the control addresses
- **Implementation Guidance**: Step-by-step guidance for implementation
- **Evidence Required**: Interactive tags showing required documentation
- **Implementation Status**: Five selectable status options with icons
- **Status Summary**: Current status display with last updated timestamp

## Implementation Status Options

1. **Fully Implemented** - Control is completely implemented and operational
2. **Partially Implemented** - Control is partially implemented but needs completion
3. **Planned** - Control implementation is planned for future
4. **Not Implemented** - Control is not yet implemented
5. **Not Applicable** - Control does not apply to this organization

## Usage

```tsx
import { AssessmentView, ImplementationStatus } from './components/AssessmentView';

const MyComponent = () => {
  const handleStatusChange = (status: ImplementationStatus) => {
    console.log('Status changed to:', status);
    // Save status to backend
  };

  return (
    <AssessmentView
      controlId="3.1.1"
      controlTitle="Access Control"
      priority="HIGH"
      estimatedTime="2-4 weeks"
      question="Does your organization limit information system access to authorized users, processes acting on behalf of authorized users, or devices?"
      description="This control addresses the management of accounts used by individuals and devices that access the system."
      implementationGuidance="Implement account management procedures including account establishment, activation, modification, review, and removal."
      evidenceRequired={[
        "Access Control Policy",
        "Account Management Procedures", 
        "User Access Lists"
      ]}
      onStatusChange={handleStatusChange}
      initialStatus="not-implemented"
    />
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `controlId` | string | Yes | The control identifier (e.g., "3.1.1") |
| `controlTitle` | string | Yes | The control title (e.g., "Access Control") |
| `priority` | 'HIGH' \| 'MEDIUM' \| 'LOW' | Yes | Priority level with color coding |
| `estimatedTime` | string | Yes | Estimated implementation time |
| `question` | string | Yes | The main control question |
| `description` | string | Yes | Description of what the control addresses |
| `implementationGuidance` | string | Yes | Step-by-step implementation guidance |
| `evidenceRequired` | string[] | Yes | Array of required evidence items |
| `onStatusChange` | function | No | Callback when status changes |
| `initialStatus` | ImplementationStatus | No | Initial implementation status |

## Styling

The component uses Tailwind CSS with a dark theme and includes:
- Responsive design for mobile, tablet, and desktop
- Smooth transitions and hover effects
- Consistent spacing and typography
- Accessible color contrast
- Interactive status selection with visual feedback

## Icons

Uses Lucide React icons for consistent visual language:
- Info icon for description section
- FileText icon for evidence items
- Status-specific icons for each implementation status
- Priority color coding (red for high, yellow for medium, green for low)