import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from '../components/admin/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(),
}));

vi.mock('wouter', () => ({
    useLocation: vi.fn(),
}));

describe('ProtectedRoute', () => {
    const mockSetLocation = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useLocation as any).mockReturnValue(['/admin/dashboard', mockSetLocation]);
    });

    it('shows loading state initially', () => {
        (useQuery as any).mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', async () => {
        (useQuery as any).mockReturnValue({
            data: { user: null },
            isLoading: false,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        await waitFor(() => {
            expect(mockSetLocation).toHaveBeenCalledWith('/admin/login');
        });
    });

    it('renders children when user is authenticated', () => {
        (useQuery as any).mockReturnValue({
            data: { user: { id: '1', username: 'admin' } },
            isLoading: false,
        });

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        expect(mockSetLocation).not.toHaveBeenCalled();
    });
});
