Feature: Fetching user

Scenario: Fetching user by valid existing email
    Given I have a valid user email
        And the user email exists

    When I request the user details by email

    Then I should receive the correct user information
        And the status code should be 200
        And the response should contain all required fields

Scenario: Fetching user by valid non-existing email
    Given I have a valid user email
        And the user email does not exist

    When I request the user details by email

    Then I should receive an error response
        And the status code should be 404
        And the error message should indicate user not found

Scenario: Fetching user by invalid email format
    Given I have an invalid user email

    When I request the user details by email 

    Then I should receive an error response
        And the status code should be 400
        And the error message should indicate invalid email format