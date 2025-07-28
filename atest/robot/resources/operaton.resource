*** Settings ***
Library    Browser

*** Keywords ***
Open Operaton-WebApps
    [Arguments]    ${url}
    New Browser    headless=%{BROWSER_HEADLESS=False}
    New Page    ${url}
    Set Browser Timeout    30s