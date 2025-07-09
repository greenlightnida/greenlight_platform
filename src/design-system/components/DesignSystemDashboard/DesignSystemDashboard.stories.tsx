import type { Meta, StoryObj } from '@storybook/react';

import { DesignSystemDashboard } from './DesignSystemDashboard';

const meta: Meta<typeof DesignSystemDashboard> = {
  title: 'Design System/Dashboards/DesignSystemDashboard',
  component: DesignSystemDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Design System Dashboard

A professional dashboard for managing and monitoring design system components, tokens, and governance.

## Features

- **Component Registry**: View and manage all design system components
- **Design Tokens**: Visualize and manage design tokens by category
- **Governance**: Monitor compliance and policy enforcement
- **Health Monitoring**: Track component health and performance
- **Professional UI**: UI/UX Design Guide 2025 compliant interface

## Usage

This dashboard provides a comprehensive view of the design system's health, 
components, and governance status. It's designed for design system managers, 
developers, and stakeholders to monitor and maintain design system quality.

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Reduced motion support
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Component doesn't take props, but we can document its behavior
  },
};

export default meta;
type Story = StoryObj<typeof DesignSystemDashboard>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default Design System Dashboard showing all components, tokens, and governance metrics.',
      },
    },
  },
};

export const Loading: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Dashboard in loading state while data is being fetched.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    docs: {
      description: {
        story: 'Dashboard optimized for mobile devices with responsive design.',
      },
    },
  },
};

export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Dashboard optimized for tablet devices.',
      },
    },
  },
};

export const Desktop: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Dashboard optimized for desktop devices with full feature set.',
      },
    },
  },
}; 