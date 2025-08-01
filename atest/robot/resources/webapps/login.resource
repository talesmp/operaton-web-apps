*** Settings ***
Library         Browser

Keyword Tags    interface    webapps


*** Keywords ***
Open Browser and Login
    Open Login Page
    Validate Welcome Page Is Shown

Validate Welcome Page Is Shown
    [Tags]    robot:private
    Get Title
    ...    ==
    ...    ${ENGINE_NAME}
    ...    message=We do not seem to be running on ${ENGINE_NAME}. Sure we are running against the correct engine?

Open Login Page
    New Browser    headless=%{BROWSER_HEADLESS=False}    slowMo=%{BROWSER_SLOWMO=0:00:00}
    New Page    %{FRONTEND_URL}
