*** Settings ***
Library    Browser

*** Keywords ***
Open Web Apps
    [Arguments]    ${url}
    New Browser    headless=%{BROWSER_HEADLESS=False}
    New Page    ${url}
    Set Browser Timeout    30s