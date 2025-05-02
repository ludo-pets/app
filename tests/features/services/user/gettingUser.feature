Feature: Getting user

Scenario: Getting user by valid existing email
    Given I have a valid user email
        And the user email exists

    When I request the user details by email

    Then I should receive the correct user information
        And the response should contain all required fields

Scenario: Getting user by valid non-existing email
    Given I have a valid user email
        And the user email does not exist

    When I request the user details by email

    Then I should receive a null response

Scenario: Getting user by invalid email format
    Given I have an invalid user email

    When I request the user details by email 

    Then I should receive a null response