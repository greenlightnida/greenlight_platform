# Component Name

## Overview

Brief description of the component, its purpose, and when to use it.

## Design

### Visual Design
- **Design Specs**: Link to design files
- **Variants**: Available visual variants
- **States**: Different states (default, hover, active, disabled, etc.)
- **Sizes**: Available sizes
- **Colors**: Color usage and theming

### Accessibility
- **WCAG Compliance**: WCAG 2.1 AA compliant
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators
- **Color Contrast**: Meets contrast requirements

### Responsive Behavior
- **Mobile**: Mobile-specific behavior and styling
- **Tablet**: Tablet-specific behavior and styling
- **Desktop**: Desktop-specific behavior and styling
- **Breakpoints**: Responsive breakpoints used

## Usage

### When to Use
- Primary use cases
- Appropriate contexts
- Best practices

### When Not to Use
- Inappropriate use cases
- Anti-patterns to avoid
- Alternative components to consider

### Examples

#### Basic Usage
```tsx
import { ComponentName } from '@greenlight/design-system';

function MyComponent() {
  return (
    <ComponentName>
      Content here
    </ComponentName>
  );
}
```

#### With Props
```tsx
import { ComponentName } from '@greenlight/design-system';

function MyComponent() {
  return (
    <ComponentName 
      variant="primary"
      size="large"
      disabled={false}
    >
      Content here
    </ComponentName>
  );
}
```

#### Complex Example
```tsx
import { ComponentName, Icon } from '@greenlight/design-system';

function MyComponent() {
  return (
    <ComponentName 
      variant="secondary"
      size="medium"
      onClick={handleClick}
    >
      <Icon name="rocket" size="sm" />
      Launch Application
    </ComponentName>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual variant of the component |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the component |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `onClick` | `(event: MouseEvent) => void` | `undefined` | Click handler function |
| `children` | `ReactNode` | `undefined` | Content to render inside the component |
| `className` | `string` | `undefined` | Additional CSS classes |
| `id` | `string` | `undefined` | Unique identifier for the component |

### Events

| Event | Description | Payload |
|-------|-------------|---------|
| `onClick` | Fired when the component is clicked | `MouseEvent` |
| `onFocus` | Fired when the component receives focus | `FocusEvent` |
| `onBlur` | Fired when the component loses focus | `FocusEvent` |
| `onKeyDown` | Fired when a key is pressed | `KeyboardEvent` |

### CSS Classes

| Class | Description |
|-------|-------------|
| `.component-name` | Base component class |
| `.component-name--primary` | Primary variant |
| `.component-name--secondary` | Secondary variant |
| `.component-name--small` | Small size |
| `.component-name--large` | Large size |
| `.component-name--disabled` | Disabled state |
| `.component-name--focused` | Focused state |

## Design Tokens

### Colors
```css
--component-primary: var(--color-primary);
--component-secondary: var(--color-neutral);
--component-disabled: var(--color-neutral);
```

### Spacing
```css
--component-padding-small: var(--space-sm);
--component-padding-medium: var(--space-md);
--component-padding-large: var(--space-lg);
```

### Typography
```css
--component-font-family: var(--font-family);
--component-font-weight: var(--font-weight-bold);
--component-font-size-small: 0.875em;
--component-font-size-medium: 1em;
--component-font-size-large: 1.125em;
```

### Shadows
```css
--component-shadow: var(--shadow-sm);
--component-shadow-hover: var(--shadow-md);
```

## Accessibility

### ARIA Attributes
- `role`: Appropriate ARIA role
- `aria-label`: Descriptive label for screen readers
- `aria-disabled`: Indicates disabled state
- `aria-pressed`: For toggle components

### Keyboard Support
- **Enter/Space**: Activates the component
- **Tab**: Moves focus to/from the component
- **Escape**: Closes modals or cancels actions

### Focus Management
- Clear focus indicators
- Proper focus order
- Focus trapping for modals

## Testing

### Unit Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName>Test Content</ComponentName>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick}>Click me</ComponentName>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state', () => {
    render(<ComponentName disabled>Disabled</ComponentName>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

### Integration Tests
```tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName Integration', () => {
  it('works with form submission', () => {
    render(
      <form>
        <ComponentName type="submit">Submit</ComponentName>
      </form>
    );
    
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
```

### Accessibility Tests
```tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<ComponentName>Accessible</ComponentName>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Performance

### Bundle Size
- **Component**: ~2KB (gzipped)
- **With dependencies**: ~5KB (gzipped)

### Rendering Performance
- **First render**: < 1ms
- **Re-renders**: < 0.5ms
- **Memory usage**: Minimal

### Optimization Tips
- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid inline function creation in render

## Migration Guide

### From Previous Version
```tsx
// Old API
<OldComponent variant="blue" />

// New API
<ComponentName variant="primary" />
```

### Breaking Changes
- `variant="blue"` → `variant="primary"`
- `onPress` → `onClick`
- `isDisabled` → `disabled`

## Related Components

- **[RelatedComponent1](./related-component1.md)**: Similar component for different use case
- **[RelatedComponent2](./related-component2.md)**: Complementary component
- **[RelatedComponent3](./related-component3.md)**: Component that works well together

## Changelog

### v2.0.0
- Added new variants
- Improved accessibility
- Enhanced performance

### v1.5.0
- Added size variants
- Fixed focus management
- Updated design tokens

### v1.0.0
- Initial release
- Basic functionality
- Core accessibility features

---

*This component is part of the Greenlight Platform Design System. For questions or issues, please contact the design system team.* 