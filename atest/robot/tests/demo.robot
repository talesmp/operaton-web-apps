*** Settings ***
Documentation       This is a demo test case how to test different webapps with different backends.
...
...                 Choosing the specific setup you have to combine the following profiles:
...                 - operaton: backend will be Operaton, frontend legacy-webapps
...                 - camunda: backend will be Camunda 7, frontend legacy-webapps
...                 - webapps: switches frontend to webapps
...
...                 Requirements: Robotcode (either extension ins VSCode or CLI)
...
...                 == On CLI ==
...
...                 Run test case against Operaton with legacy-webapps
...
...                 ``robotcode -p operaton robot demo.robot``
...
...                 Run test case against Operaton with webapps
...
...                 ``robotcode -p operaton -webapps-dev robot demo.robot``
...
...                 Run test case against Camunda 7 with legacy-webapps
...
...                 ``robotcode -p camunda robot demo.robot``
...
...                 == On VSCode ==
...
...                 There are several ways to activate profiles in VSCode.
...                 Probably easiest is to open a `.robot` file (like this one)
...                 and click on `{}` next to `Robot Framework` in the status bar
...                 (usually bottom right). In the context menu click in row
...                 `Configuration profiles` on `Select`and choose the combination
...                 of profiles you desire.

Resource            %{FRONTEND_TYPE}/keywords.resource

Test Teardown       Close Browser


*** Test Cases ***
Demo
    [Documentation]    This test case opens a browser, logs in and checks the page title.
    Open Browser and Login
