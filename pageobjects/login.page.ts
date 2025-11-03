import Page from './page.ts';

class LoginPage extends Page {

    // --- Selectors ---
    private get inputEmail() { return $('#text-input-email'); }
    private get inputPassword() { return $('#text-input-password'); }
    private get btnSubmit() { return $('button=Log in'); }

    // Selector for 2FA page
    private get linkDoThisLater() { return $('a[href="/addmfalater"]'); }
    private get btnGoToDashboard() { return $('button=Go to dashboard'); }
    
    // Selector for Connections page (h3)
    private get connectionsHeading() { return $('h3=Connections'); }

    /**
     * This function handles the login, including the "fork in the road"
     * where either the 2FA flow or the Connections page might appear.
     */
    public async login(email: string, password: string) {
        
        // --- PAGE 1: /login ---
        console.log("On /login page. Waiting for email input...");
        await this.inputEmail.waitForExist({ timeout: 10000 });
        await this.inputEmail.setValue(email);
        await this.inputPassword.setValue(password);
        
        console.log("Clicking 'Log in' button...");
        await this.btnSubmit.click();

        // --- Wait for EITHER 2FA or Connections ---
        console.log("Waiting for next page (2FA or Connections) to load...");
        try {
            await browser.waitUntil(
                async () => {
                    // Check if either the 2FA link or the Connections heading is present
                    const is2FAPage = await this.linkDoThisLater.isDisplayed();
                    const isConnectionsPage = await this.connectionsHeading.isDisplayed();
                    return is2FAPage || isConnectionsPage;
                },
                {
                    timeout: 30000, 
                    timeoutMsg: "Failed to load 2FA or Connections page after 30s"
                }
            );
        } catch (error) {
            console.error("Login failed. Neither 2FA nor Connections page loaded.", error);
            throw error;
        }

        // --- Now, check which page we are on ---
        if (await this.linkDoThisLater.isDisplayed()) {
            // --- 2FA FLOW ---
            console.log("2FA page found. Clicking 'I'll do this later'...");
            const link = await this.linkDoThisLater;
            await browser.execute((el) => el.click(), link);

            console.log("Waiting for 'Go to dashboard' page...");
            await this.btnGoToDashboard.waitForExist({ timeout: 10000 });
            
            console.log("Forcing click on 'Go to dashboard' button...");
            const button = await this.btnGoToDashboard;
            await browser.execute((el) => el.click(), button);
        } else {
            // --- 2FA WAS SKIPPED ---
            console.log("2FA page was skipped. Already on Connections page.");
        }

        // --- NO FINAL VERIFICATION ---
        // We will let the *next* step handle verification.
        console.log("Login flow complete. Proceeding to next step...");
    }

    /**
     * Overwrite the base 'open' method
     */
    public open() {
        return super.open('login');
    }
}

export default new LoginPage();