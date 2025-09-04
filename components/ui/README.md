# UI Components Library

This directory contains reusable UI components designed to match Bybit's styling and behavior.

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from './ui';

// Basic usage
<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  Click me
</Button>

// Variants
<Button variant="primary">Primary Button</Button>       // Orange Bybit style
<Button variant="secondary">Secondary Button</Button>   // Gray style
<Button variant="moly">Moly Button</Button>             // Dark gray style
<Button variant="outline">Outline Button</Button>       // Transparent with border
<Button variant="ghost">Ghost Button</Button>           // Transparent

// Sizes
<Button size="xs">Extra Small</Button>    // 10px font, 2px 6px padding
<Button size="sm">Small</Button>          // 11px font, 4px 8px padding
<Button size="md">Medium</Button>         // 12px font, 6px 12px padding
<Button size="lg">Large</Button>          // 14px font, 8px 16px padding
```

### Text

A text component with consistent typography and colors.

```tsx
import { Text } from './ui';

// Typography variants
<Text variant="h1">Heading 1</Text>
<Text variant="h2">Heading 2</Text>
<Text variant="body">Body Text</Text>
<Text variant="caption">Caption Text</Text>

// Colors
<Text color="primary">Primary Text</Text>     // #eaecef
<Text color="secondary">Secondary Text</Text> // #adb1b8
<Text color="muted">Muted Text</Text>         // #71757a
<Text color="success">Success Text</Text>     // #0ecb81
<Text color="error">Error Text</Text>         // #f6465d
<Text color="warning">Warning Text</Text>     // #f7a600

// Sizes and weights
<Text size="lg" weight="bold">Large Bold Text</Text>
<Text align="center">Centered Text</Text>
```

### TextInput

A styled text input component with prefix/suffix support.

```tsx
import { TextInput } from './ui';

// Basic usage
<TextInput
  value={value}
  placeholder="Enter text"
  onChange={(value) => setValue(value)}
/>

// With prefix/suffix
<TextInput
  value={quantity}
  placeholder="0.0"
  suffix="BTC"
  onChange={(value) => setQuantity(value)}
/>

// Different sizes
<TextInput size="sm" placeholder="Small input" />
<TextInput size="md" placeholder="Medium input" />
<TextInput size="lg" placeholder="Large input" />

// Error state
<TextInput error={true} placeholder="Input with error" />
```

### Checkbox

A customizable checkbox component.

```tsx
import { Checkbox } from './ui';

// Basic usage
<Checkbox
  checked={isChecked}
  label="Check me"
  onChange={(checked) => setIsChecked(checked)}
/>

// Different colors
<Checkbox color="warning" label="Orange checkbox" />
<Checkbox color="success" label="Green checkbox" />
<Checkbox color="primary" label="White checkbox" />

// Different sizes
<Checkbox size="sm" label="Small" />
<Checkbox size="md" label="Medium" />
<Checkbox size="lg" label="Large" />
```

### Dropdown

A dropdown select component.

```tsx
import { Dropdown } from "./ui";

const options = [
  { value: "cross", label: "Cross" },
  { value: "isolated", label: "Isolated" },
];

<Dropdown
  options={options}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  placeholder="Select option"
/>;
```

## Usage Examples

### Replacing inline styles

Instead of:

```tsx
<button
  style={{
    background: "#404347",
    border: "1px solid #404347",
    borderRadius: "2px",
    color: "#eaecef",
    padding: "4px 8px",
    fontSize: "10px",
    cursor: "pointer",
  }}
>
  + Add
</button>
```

Use:

```tsx
<Button variant="moly" size="xs">
  + Add
</Button>
```

### Replacing text elements

Instead of:

```tsx
<div style={{ fontSize: "12px", color: "#0ecb81" }}>Success Message</div>
```

Use:

```tsx
<Text size="md" color="success">
  Success Message
</Text>
```

### Replacing form inputs

Instead of:

```tsx
<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  style={{
    background: "#404347",
    border: "1px solid #404347",
    color: "#eaecef",
    // ... more styles
  }}
/>
```

Use:

```tsx
<TextInput value={value} onChange={(value) => setValue(value)} />
```

## Benefits

1. **Consistency**: All components follow Bybit's design system
2. **Maintainability**: Change styling in one place affects all instances
3. **Type Safety**: Full TypeScript support with proper prop types
4. **Accessibility**: Built-in accessibility features
5. **Reusability**: Easy to use across different components
6. **Performance**: Optimized with proper React patterns

## Migration Guide

To migrate existing components:

1. Import the UI components: `import { Button, Text, Checkbox } from './ui';`
2. Replace inline styled elements with corresponding UI components
3. Use the appropriate props instead of inline styles
4. Test the component to ensure styling matches
5. Remove old styled elements

This approach will make your codebase more maintainable and consistent!
