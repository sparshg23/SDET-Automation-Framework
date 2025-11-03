import type { Config } from '@wdio/config';
import * as dotenv from 'dotenv';

// Load environment variables based on ENV
const envFile = `.env.${process.env.ENV || 'qa'}`;
dotenv.config({ path: envFile });

export const config: Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: 'tsconfig.json'
        }
    },
    
    //
    // ==================
    // Specify Test Files
    // ==================
    specs: [
        './features/**/*.feature' // Runs our Cucumber test
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    //
    // ============
    // Capabilities
    // ============
    maxInstances: 10,
    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            // We are keeping headless commented out to watch the test run
            args: [
                // '--headless', 
                '--disable-gpu', 
                '--window-size=1920,1080'
            ],
        }
    }],
    //
    // ===================
    // Test Configurations
    // ===================
    logLevel: 'warn',
    bail: 0,
    baseUrl: 'https://app.rudderstack.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [], // Correct for WDIO v9
    framework: 'cucumber', // Set back to Cucumber
    reporters: ['spec'],

    //
    // ==================
    // Framework Options
    // ==================
    cucumberOpts: {
        require: ['./step-definitions/**/*.ts'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 120000, // 60 second timeout for Cucumber steps
        ignoreUndefinedDefinitions: false
    },
};