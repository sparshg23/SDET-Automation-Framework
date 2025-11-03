import Page from './page.ts';

class DestinationPage extends Page {
    
    // Selector for the "Events" tab
    private get eventsTab() { 
        return $(`//div[@data-node-key='Events']`); 
    }
    
    // --- THIS IS THE FIX ---
    // This selector finds the "Delivered" span, then finds its
    // *sibling* div, and gets the count from the span inside.
    private get deliveredCount() { 
        return $(`//span[normalize-space(text())='Delivered']/following-sibling::div[1]//h2/span`); 
    }

    // --- THIS IS THE FIX ---
    // This selector finds the "Failed" span, then finds its
    // *sibling* div, and gets the count from the span inside.
    private get failedCount() { 
        return $(`//span[normalize-space(text())='Failed']/following-sibling::div[1]//h2/span`); 
    }

    public async goToEventsTab() {
        await this.eventsTab.waitForClickable();
        console.log("Navigating to Events tab...");
        await this.eventsTab.click();
    }

    public async getDeliveredCount(): Promise<string> {
        // Wait for the count to be visible
        await this.deliveredCount.waitForExist({ timeout: 5000 });
        const count = await this.deliveredCount.getText();
        return count;
    }

    public async getFailedCount(): Promise<string> {
        // Wait for the count to be visible
        await this.failedCount.waitForExist({ timeout: 5000 });
        const count = await this.failedCount.getText();
        return count;
    }
}

export default new DestinationPage();
