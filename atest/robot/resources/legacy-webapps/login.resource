*** Settings ***
Library         Browser

Keyword Tags    interface    legacy-webapps


*** Keywords ***
Open Browser and Login
    Open Login Page
    Login
    Validate Welcome Page Is Shown

Login
    [Tags]    robot:private
    Fill Text    form[ng-submit="login()"] input[ng-model="username"]    demo
    Fill Text    form[ng-submit="login()"] input[ng-model="password"]    demo
    Click    form[ng-submit="login()"] button[type="submit"]

Validate Welcome Page Is Shown
    [Tags]    robot:private
    Get Title
    ...    ==
    ...    ${ENGINE_NAME} Welcome
    ...    message=We do not seem to be running on ${ENGINE_NAME}. Sure we are running against the correct engine?

Open Login Page
    [Tags]    robot:private
    New Browser    headless=%{BROWSER_HEADLESS=False}
    New Page    %{FRONTEND_URL}
