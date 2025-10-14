// jest.config.ts
import nextJest from 'next/jest';

const createJestConfig = nextJest({
    dir: './', // path to your Next.js app
});

const config = {
    testEnvironment: 'jest-environment-jsdom',
    // Tell Jest where your setup file is
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // update if your tsconfig paths differ
    },
    testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx)'],
    transform: {}, // next/jest sets this up for you
};

export default createJestConfig(config);
