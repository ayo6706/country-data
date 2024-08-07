/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    forceExit: true,
    testTimeout: 60000,
    testMatch: ["**/**/*.test.ts"],
    verbose: true
};
