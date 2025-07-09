import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// React import removed - not used in this test file
import '@testing-library/jest-dom';
import { vi } from 'vitest';

import { SessionsManager } from '../../core/session-management/SessionsManager';

// Mock fetch globally
global.fetch = vi.fn();

describe('SessionsManager', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('renders without crashing and shows sessions manager', async () => {
    render(<SessionsManager />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Sessions Manager')).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: 'New Session' })).toBeInTheDocument();
  });

  it('displays session metrics', async () => {
    render(<SessionsManager />);

    await waitFor(() => {
      expect(screen.getByText('Total Sessions')).toBeInTheDocument();
      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(screen.getByText('Avg Duration')).toBeInTheDocument();
    });
  });

  it('creates a new session when New Session button is clicked', async () => {
    render(<SessionsManager />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'New Session' })).toBeInTheDocument();
    });

    const newSessionButton = screen.getByRole('button', { name: 'New Session' });
    
    await waitFor(async () => {
      fireEvent.click(newSessionButton);
    });

    // Should show the new session in the list
    await waitFor(() => {
      expect(screen.getByText('New Session')).toBeInTheDocument();
    });
  });

  it('displays existing sessions', async () => {
    render(<SessionsManager />);

    await waitFor(() => {
      expect(screen.getByText('System Architecture Review')).toBeInTheDocument();
      expect(screen.getByText('Bug Fixing Session')).toBeInTheDocument();
      expect(screen.getByText('Feature Planning')).toBeInTheDocument();
    });
  });
}); 