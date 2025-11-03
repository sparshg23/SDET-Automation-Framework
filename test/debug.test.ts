// This is a debug test file. We are not using Cucumber here.
// We are just using basic WebdriverIO to see if we can find the elements.

describe('Rudderstack Login Page DEBUG', () => {

    it('should find and interact with the login elements', async () => {
        
        // 1. Open the login page
        await browser.url('https://app.rudderstack.com/login');
        console.log("DEBUG: Opened login page.");
        
        // 2. Define the email input selector
        const emailInput = await $('#text-input-email');
        
        // 3. Wait for it to exist on the page
        console.log("DEBUG: Waiting for email input '#text-input-email' to exist...");
        try {
            await emailInput.waitForExist({ timeout: 15000 });
            console.log("DEBUG: SUCCESS! Email input was found.");
        } catch (e) {
            console.error("DEBUG: FAILED! Email input was NOT found after 15 seconds.");
            throw e; // Stop the test
        }

        // 4. Check if it's actually visible
        const isDisplayed = await emailInput.isDisplayed();
        console.log(`DEBUG: Is email input visible on screen? ${isDisplayed}`);

        // 5. Try to type in it
        console.log("DEBUG: Attempting to type into email input...");
        await emailInput.setValue('test@email.com');
        console.log("DEBUG: SUCCESS! Typed into email input.");

        // 6. Pause for 10 seconds so you can see it
        console.log("DEBUG: Pausing for 10 seconds. Look at the browser!");
        await browser.pause(10000);
    });
});