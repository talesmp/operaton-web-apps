*** Settings ***
Resource    operaton/browser.resource

*** Test Cases ***
Demo
    Open Web Apps    https://example.com

View Process Model
    Upload A Process Model
    Open Web Apps    https://example.com/process-model
