import type { Meta, StoryObj } from '@storybook/react';

import { Icon, FeatureIcon, SystemIcon, StatusIcon, PriorityIcon, IconMapping } from './IconSystem';

const meta: Meta<typeof Icon> = {
  title: 'Design System/Components/IconSystem',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: `
# Icon System

A comprehensive icon system for the Greenlight Platform that provides visual cues for features, components, and system elements.

## Features

- **Feature Icons**: Automatic icon mapping for different feature types
- **System Icons**: Icons for different system categories
- **Status Icons**: Visual indicators for component and feature status
- **Priority Icons**: Icons for priority levels
- **Accessibility**: Proper ARIA labels and screen reader support
- **Consistent Sizing**: Standardized icon sizes across the platform

## Usage

The icon system provides multiple components for different use cases:

- \`Icon\`: Basic icon component with manual name mapping
- \`FeatureIcon\`: Automatic icon mapping for features
- \`SystemIcon\`: Icons for system categories
- \`StatusIcon\`: Status indicators
- \`PriorityIcon\`: Priority level indicators

## Icon Categories

### System Icons
- Design System: 🎨
- Features: ⚡
- Product: 📋
- Governance: 🛡️
- Monitoring: 📊

### Feature Categories
- UI: 🎨
- Business: 💼
- Infrastructure: 🏗️
- Integration: 🔗
- Utility: 🛠️

### Status Icons
- Healthy: ✅
- Warning: ⚠️
- Error: ❌
- Loading: ⏳

### Priority Icons
- Critical: 🚨
- High: 🔴
- Medium: 🟡
- Low: 🟢
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(IconMapping),
      description: 'The name of the icon to display',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The size of the icon',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    title: {
      control: 'text',
      description: 'Tooltip text and accessibility label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'design-system',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default icon with medium size.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Icon name="design-system" size="xs" title="Extra Small" />
      <Icon name="design-system" size="sm" title="Small" />
      <Icon name="design-system" size="md" title="Medium" />
      <Icon name="design-system" size="lg" title="Large" />
      <Icon name="design-system" size="xl" title="Extra Large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available icon sizes from xs to xl.',
      },
    },
  },
};

export const SystemIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="design-system" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Design System</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="features" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Features</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="product" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Product</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="governance" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Governance</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="monitoring" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Monitoring</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Main system icons used throughout the platform.',
      },
    },
  },
};

export const FeatureIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="ui" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>UI</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="business" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Business</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="infrastructure" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Infrastructure</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="integration" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Integration</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="utility" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Utility</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Feature category icons for different types of features.',
      },
    },
  },
};

export const StatusIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="healthy" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Healthy</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="warning" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Warning</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="error" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Error</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="loading" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Loading</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status icons for indicating component and feature health.',
      },
    },
  },
};

export const PriorityIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="critical" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Critical</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="high" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>High</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="medium" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Medium</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <Icon name="low" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Low</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Priority icons for indicating feature and task priority levels.',
      },
    },
  },
};

// FeatureIcon Stories
export const FeatureIconExample: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <FeatureIcon featureType="ui" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>UI Feature</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <FeatureIcon featureType="business" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Business Feature</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <FeatureIcon featureType="infrastructure" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Infrastructure Feature</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'FeatureIcon component with automatic icon mapping based on feature type.',
      },
    },
  },
};

// SystemIcon Stories
export const SystemIconExample: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <SystemIcon system="design-system" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Design System</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <SystemIcon system="features" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Features System</div>
      </div>
      <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <SystemIcon system="product" size="lg" />
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Product System</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SystemIcon component for displaying system category icons.',
      },
    },
  },
}; 