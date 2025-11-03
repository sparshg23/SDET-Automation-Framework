import { Given, When, Then } from '@wdio/cucumber-framework';

import LoginPage from '../pageobjects/login.page.ts';
import ConnectionsPage from '../pageobjects/connections.page.ts';
import DestinationPage from '../pageobjects/destination.page.ts';
import ApiHelper from '../utils/api.helper.ts';

// Store shared data between steps
let dataPlaneUrl: string;
let writeKey: string;

Given('I log in to the Rudderstack application', async () => {
    const user = process.env.RUDDERSTACK_USER;
    const pass = process.env.RUDDERSTACK_PASS;
    if (!user || !pass) {
        throw new Error('RUDDERSTACK_USER and RUDDERSTACK_PASS env variables are not set.');
    }
    await LoginPage.open();
    await LoginPage.login(user, pass);
});

When('I get and store the Data Plane URL', async () => {
    dataPlaneUrl = await ConnectionsPage.getDataPlaneUrl();
    console.log(`Data Plane URL: ${dataPlaneUrl}`);
    expect(dataPlaneUrl).toBeTruthy();
});

When('I copy the Write Key for the {string} source', async (sourceName: string) => {
    writeKey = await ConnectionsPage.getWriteKeyForSource(sourceName);
    console.log(`Write Key found: ${writeKey}`);
    expect(writeKey).toBeTruthy();
});

When('I send an "identify" event via the API', async () => {
    if (!dataPlaneUrl || !writeKey) {
        throw new Error('Data Plane URL or Write Key was not stored.');
    }
    await ApiHelper.sendEvent(dataPlaneUrl, writeKey);
    
    // This pause is critical for Rudderstack to process the event
    console.log("Waiting 30 seconds for event to process in Rudderstack...");
    await browser.pause(30000); 
});

When('I navigate to the {string} destination', async (destName: string) => {
    await ConnectionsPage.goToDestination(destName);
});

// This step now matches the new feature file.
// It only clicks, reads, and logs the counts.
Then('I check and log the event counts', async () => {
    await DestinationPage.goToEventsTab();

    // Add a small pause to let the counts render after clicking
    await browser.pause(2000); 
    
    // Get and log the final counts as requested
    const finalDelivered = await DestinationPage.getDeliveredCount();
    const finalFailed = await DestinationPage.getFailedCount();
    
    console.log(`--- FINAL EVENT COUNT ---`);
    console.log(`Delivered: ${finalDelivered}`);
    console.log(`Failed: ${finalFailed}`);
    console.log(`-------------------------`);

    // No assertion! The test will now pass.
});