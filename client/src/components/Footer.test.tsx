import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { describe, it, expect, vi } from 'vitest';

// Mock wouter
vi.mock('wouter', () => ({
    Link: ({ children, href, ...props }: any) => (
        <a href={href} {...props}>{children}</a>
    ),
}));

// Mock ImigongoPattern
vi.mock('./ImigongoPattern', () => ({
    ImigongoPattern: () => <div data-testid="imigongo-pattern" />,
}));

describe('Footer Component', () => {
    it('renders contact information', () => {
        render(<Footer />);
        expect(screen.getByText('info@ikoranabuhanga.tech')).toBeInTheDocument();
        expect(screen.getByText('NR24, Rwanda')).toBeInTheDocument();
        expect(screen.getByTestId('footer-link-phone')).toBeInTheDocument();
    });

    it('renders quick links', () => {
        render(<Footer />);
        expect(screen.getByTestId('footer-link-home')).toBeInTheDocument();
        expect(screen.getByTestId('footer-link-about')).toBeInTheDocument();
        expect(screen.getByTestId('footer-link-programs')).toBeInTheDocument();
        expect(screen.getByTestId('footer-link-get-involved')).toBeInTheDocument();
    });

    it('renders copyright with current year', () => {
        render(<Footer />);
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    });
});
