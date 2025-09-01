*** Settings ***
Library        Browser


*** Test Cases ***
Scenario: Display of Key Metrics on Cockpit Dashboard
    [Documentation]    User Story: 1. General Monitoring & Dashboard - 1.1. Cockpit Dashboard Overview
    ...                https://docs.camunda.org/manual/7.23/webapps/cockpit/dashboard/
    ...                As a **Process Operator**,
    ...                I want to see a quick overview of **running process instances,
    ...                open incidents, and open human tasks** on the dashboard,
    ...                so that I can immediately identify areas requiring attention.
    Given I am a Process Operator logged into Camunda Cockpit
    When I navigate to the Cockpit Dashboard
    Then I should see a plugin with pie charts displaying the amount of running process instances
    And I should see the amount of open incidents
    And I should see the amount of open human tasks

Scenario: Navigating to Filtered Search for Running Process Instances
    [Documentation]    User Story: 1. General Monitoring & Dashboard - 1.1. Cockpit Dashboard Overview
    ...                https://docs.camunda.org/manual/7.23/webapps/cockpit/dashboard/
    ...                As a **Process Operator**,
    ...                I want to see a quick overview of **running process instances,
    ...                open incidents, and open human tasks** on the dashboard,
    ...                so that I can immediately identify areas requiring attention.
    Given I am a Process Operator on the Cockpit Dashboard
    And I see the pie chart displaying "running process instances"
    When I click on the number or a section of the "running process instances" pie chart
    Then I should be forwarded to the respective search with preselected query parameters for "running process instances"

Scenario: Navigating to Filtered Search for Open Incidents
    [Documentation]    User Story: 1. General Monitoring & Dashboard - 1.1. Cockpit Dashboard Overview
    ...                https://docs.camunda.org/manual/7.23/webapps/cockpit/dashboard/
    ...                As a **Process Operator**,
    ...                I want to see a quick overview of **running process instances,
    ...                open incidents, and open human tasks** on the dashboard,
    ...                so that I can immediately identify areas requiring attention.
    Given I am a Process Operator on the Cockpit Dashboard
    And I see the pie chart displaying "open incidents"
    When I click on the number or a section of the "open incidents" pie chart
    Then I should be forwarded to the respective search with preselected query parameters for "open incidents"

Scenario: Navigating to Filtered Search for Open Human Tasks
    [Documentation]    User Story: 1. General Monitoring & Dashboard - 1.1. Cockpit Dashboard Overview
    ...                https://docs.camunda.org/manual/7.23/webapps/cockpit/dashboard/
    ...                As a **Process Operator**,
    ...                I want to see a quick overview of **running process instances,
    ...                open incidents, and open human tasks** on the dashboard,
    ...                so that I can immediately identify areas requiring attention.
    Given I am a Process Operator on the Cockpit Dashboard
    And I see the pie chart displaying "open human tasks"
    When I click on the number or a section of the "open human tasks" pie chart
    Then I should be forwarded to the respective search with preselected query parameters for "open human tasks"
