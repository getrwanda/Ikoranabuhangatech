import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from './Navigation';
import { describe, it, expect, vi } from 'vitest';

// Mock wouter to avoid routing issues
vi.mock('wouter', async () => {
    const actual = await vi.importActual('wouter');
    return {
        ...actual,
        useLocation: () => ['/', vi.fn()],
        Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
            <a href={href}>{children}</a>
        ),
    };
});

describe('Navigation Component', () => {
    it('renders the logo', () => {
        render(<Navigation />);
        const logoLink = screen.getByTestId('link-home');
        expect(logoLink).toBeInTheDocument();
    });

    it('renders all desktop navigation links', () => {
        render(<Navigation />);
        const links = [
            'link-home',
            'link-about',
            'link-programs',
            'link-events',
            'link-blog',
            'link-get-involved',
            'link-resources',
            'link-contact'
        ];

        links.forEach(testId => {
            expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
    });

    it('toggles language when language button is clicked', () => {
        render(<Navigation />);
        const langButton = screen.getByTestId('button-language-toggle');

        expect(langButton).toHaveTextContent('EN');

        fireEvent.click(langButton);
        expect(langButton).toHaveTextContent('KN');

        fireEvent.click(langButton);
        expect(langButton).toHaveTextContent('EN');
    });

    it('toggles mobile menu when menu button is clicked', () => {
        render(<Navigation />);
        const menuButton = screen.getByTestId('button-menu-toggle');

        // Menu should be closed initially (mobile menu items not visible)
        // Note: They are hidden with CSS (md:hidden), but JSDOM doesn't fully simulate layout.
        // However, the conditional rendering {isOpen && ...} is what we test.

        const mobileLinkTestId = 'mobile-link-about';
        expect(screen.queryByTestId(mobileLinkTestId)).not.toBeInTheDocument();

        // Open menu
        fireEvent.click(menuButton);
        expect(screen.getByTestId(mobileLinkTestId)).toBeInTheDocument();

        // Close menu
        fireEvent.click(menuButton);
        // Wait for animation or state update if necessary, but here it's synchronous React state
        expect(screen.queryByTestId(mobileLinkTestId)).not.toBeInTheDocument();
    });
});
