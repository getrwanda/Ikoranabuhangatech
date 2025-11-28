import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from './Contact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as queryClientModule from '@/lib/queryClient';

// Mock components to avoid rendering complexity
vi.mock('@/components/ImigongoPattern', () => ({
    ImigongoPattern: () => <div data-testid="imigongo-pattern" />,
    ImigongoAccent: () => <div data-testid="imigongo-accent" />,
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: mockToast,
    }),
}));

// Mock apiRequest
const mockApiRequest = vi.spyOn(queryClientModule, 'apiRequest');

describe('Contact Page', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });
        mockToast.mockClear();
        mockApiRequest.mockReset();
    });

    const renderComponent = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <Contact />
            </QueryClientProvider>
        );
    };

    it('renders the contact form and info', () => {
        renderComponent();

        expect(screen.getByText('Contact Us')).toBeInTheDocument();
        expect(screen.getByTestId('input-contact-name')).toBeInTheDocument();
        expect(screen.getByTestId('input-contact-email')).toBeInTheDocument();
        expect(screen.getByTestId('input-contact-message')).toBeInTheDocument();
        expect(screen.getByTestId('button-send-message')).toBeInTheDocument();

        // Check contact info cards
        expect(screen.getByText('info@ikoranabuhanga.tech')).toBeInTheDocument();
    });

    it('shows validation errors for empty submission', async () => {
        renderComponent();

        const submitBtn = screen.getByTestId('button-send-message');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
            expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument();
        });

        expect(mockApiRequest).not.toHaveBeenCalled();
    });

    it('submits form successfully with valid data', async () => {
        renderComponent();

        // Setup success mock
        mockApiRequest.mockResolvedValue({ ok: true } as Response);

        fireEvent.change(screen.getByTestId('input-contact-name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByTestId('input-contact-email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByTestId('input-contact-message'), { target: { value: 'This is a valid message for testing.' } });

        const submitBtn = screen.getByTestId('button-send-message');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockApiRequest).toHaveBeenCalledWith(
                'POST',
                '/api/contact',
                expect.objectContaining({
                    name: 'John Doe',
                    email: 'john@example.com',
                    message: 'This is a valid message for testing.',
                    type: 'contact'
                })
            );
        });

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Message Sent!',
            }));
        });
    });

    it('handles submission error', async () => {
        renderComponent();

        // Setup error mock
        mockApiRequest.mockRejectedValue(new Error('Network error'));

        fireEvent.change(screen.getByTestId('input-contact-name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByTestId('input-contact-email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByTestId('input-contact-message'), { target: { value: 'This is a valid message for testing.' } });

        const submitBtn = screen.getByTestId('button-send-message');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Unable to Send Message',
                variant: 'destructive'
            }));
        });
    });
});
