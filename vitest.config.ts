import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './client/src/test/setup.ts',
        include: ['**/*.{test,spec}.{ts,tsx}'],
        alias: {
            '@': path.resolve(__dirname, './client/src'),
            '@shared': path.resolve(__dirname, './shared'),
            '@assets': path.resolve(__dirname, './attached_assets'),
        },
    },
});
