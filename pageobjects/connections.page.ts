import Page from './page.ts';

class ConnectionsPage extends Page {
    
    // --- Selectors ---
    private get aiPopup() {
        return $(`//div[contains(text(), "Have a question? Ask AI")]`);
    }
    private get pageBody() {
        return $('body');
    }
    private get dataPlaneUrl() { 
        return $(`//span[contains(text(), "dataplane.rudderstack.com")]`); 
    }

    /**
     * This function dismisses the popup and then gets the URL.
     */
    public async getDataPlaneUrl(): Promise<string> {
        
        try {
            await this.aiPopup.waitForDisplayed({ timeout: 5000 });
            console.log("Found AI popup overlay. Clicking <body> to dismiss.");
            await this.pageBody.click();
            await this.aiPopup.waitForDisplayed({ reverse: true, timeout: 5000 });
            console.log("Popup dismissed.");
        } catch (error) {
            console.log("AI popup not found, proceeding.");
        }

        await this.dataPlaneUrl.waitForExist();
        const urlText = await this.dataPlaneUrl.getText();
        console.log(`Data Plane URL found: ${urlText}`);
        return urlText;
    }

    // --- THIS IS THE FIX ---
    /**
     * Finds the write key for a specific source on the Connections page.
     * @param sourceName The name of the source (e.g., "Sparsh")
     */
    public async getWriteKeyForSource(sourceName: string): Promise<string> {
        // This XPath is correct and finds the parent div
        const keyElement = await $(
            `//div[contains(@id, 'source-') and .//*[text()='${sourceName}']]//span[contains(text(), 'Write key')]/..`
        );
        
        await keyElement.waitForExist();
        let keyText = await keyElement.getText(); 
        
        // --- DEBUGGING LOGS ---
        console.log(`DEBUG: Raw text from element: [${keyText}]`);
        
        // New robust logic:
        let key = keyText.replace('Write key', ''); // Remove the "Write key" part
        key = key.trim(); // Remove any surrounding newlines or spaces
        
        console.log(`DEBUG: Parsed key: [${key}]`);
        // --- END DEBUGGING ---

        return key; // This will be just the key: "34v60FS8tm5..."
    }

    public async goToDestination(destName: string) {
        // This selector finds the "Webhook" link under the "Destinations" list.
        const destLink = await $(`//div[@id='destinations-list']//*[text()='${destName}']`);
        console.log(`Navigating to destination: ${destName}`);
        await destLink.click();
    }

    public open() {
        return super.open('connections');
    }
}

export default new ConnectionsPage();