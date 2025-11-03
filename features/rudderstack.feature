Feature: Rudderstack Event Flow Verification

  Scenario: Verify an event is sent from an HTTP source to a Webhook destination
    Given I log in to the Rudderstack application
    And I get and store the Data Plane URL
    And I copy the Write Key for the "Sparsh" source
    And I send an "identify" event via the API
    And I navigate to the "Webhook" destination
    Then I check and log the event counts