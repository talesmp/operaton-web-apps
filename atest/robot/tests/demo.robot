*** Settings ***
Resource    %{FRONTEND_TYPE}/browser.resource

*** Test Cases ***
Demo
    Open Web Apps    %{FRONTEND_URL}
