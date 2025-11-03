import axios, { isAxiosError } from 'axios';

class ApiHelper {
    
    /**
     * Sends an 'identify' event to the Rudderstack HTTP API.
     * This follows the documentation at:
     * https://www.rudderstack.com/docs/api/http-api/
     */
    public async sendEvent(dataPlaneUrl: string, writeKey: string) {
        
        // 1. Create Basic Auth token (as required by docs)
        const token = Buffer.from(`${writeKey}:`).toString('base64');

        // 2. Define the API endpoint (as required by docs)
        // The dataPlaneUrl variable *already contains* "https://",
        // so we just append the event path.
        const url = `${dataPlaneUrl}/v1/identify`;
        
        console.log(`Sending API event to: ${url}`);

        // 3. Define the event payload (a standard 'identify' event)
        const payload = {
            userId: "test-user-12345",
            traits: {
                name: "Test User",
                email: "test.user@example.com"
            },
            context: {
                library: {
                    name: "automation-test-suite"
                }
            }
        };

        // 4. Send the POST request
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('API Event Sent Successfully:', response.data);
        } catch (error) {
            // Check if it's an error from Axios
            if (isAxiosError(error)) {
                console.error('Error sending API event (Axios):', error.response?.data || error.message);
            } 
            // Check if it's a standard JavaScript error
            else if (error instanceof Error) {
                console.error('Error sending API event (Standard):', error.message);
            } 
            // Handle any other unknown error
            else {
                console.error('An unknown error occurred:', error);
            }
            throw error;
        }
    }
}

export default new ApiHelper();
