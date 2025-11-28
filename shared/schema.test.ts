import { describe, it, expect } from 'vitest';
import {
    insertContactSchema,
    insertEventSchema,
    insertUserSchema,
    insertStudentSchema,
    insertPartnerApplicationSchema
} from './schema';

describe('Shared Schemas', () => {
    describe('insertContactSchema', () => {
        it('should validate valid contact data', () => {
            const validData = {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'Hello world',
                type: 'contact'
            };
            const result = insertContactSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should fail on missing required fields', () => {
            const invalidData = {
                name: 'John Doe',
                // email missing
                message: 'Hello world',
                type: 'contact'
            };
            const result = insertContactSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should fail on invalid email', () => {
            const invalidData = {
                name: 'John Doe',
                email: 'not-an-email',
                message: 'Hello world',
                type: 'contact'
            };
            const result = insertContactSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('insertEventSchema', () => {
        it('should validate valid event data', () => {
            const validData = {
                title: 'Tech Workshop',
                description: 'Learn coding',
                category: 'digital-literacy',
                date: new Date().toISOString(),
                location: 'Kigali',
                capacity: 50
            };
            const result = insertEventSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should coerce date strings to Date objects', () => {
            const validData = {
                title: 'Tech Workshop',
                description: 'Learn coding',
                category: 'digital-literacy',
                date: '2023-12-25',
                location: 'Kigali',
                capacity: 50
            };
            const result = insertEventSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.date).toBeInstanceOf(Date);
            }
        });
    });

    describe('insertUserSchema', () => {
        it('should validate valid user data', () => {
            const validData = {
                username: 'admin',
                password: 'securepassword123'
            };
            const result = insertUserSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });

    describe('insertStudentSchema', () => {
        it('should validate valid student data', () => {
            const validData = {
                name: 'Student One',
                email: 'student@school.com',
                school: 'Kigali High',
                grade: '12',
                learningGoals: ['coding', 'design'],
                interests: ['robotics'],
                location: 'Kigali'
            };
            const result = insertStudentSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should fail if arrays are empty', () => {
            const invalidData = {
                name: 'Student One',
                email: 'student@school.com',
                school: 'Kigali High',
                grade: '12',
                learningGoals: [], // empty
                interests: [], // empty
                location: 'Kigali'
            };
            const result = insertStudentSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});
