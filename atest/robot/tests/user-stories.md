# Admin Console (64)

## 1. Admin Application Access and Setup (3)

- [ ] 1. As a System Administrator, I want to **log in to the Admin application using my username and password**, so that I can access and manage Camunda 7 users, groups, and authorizations.
- [ ] 2. As a System Administrator, I want to **be a member of the 'camunda-admin' group or have appropriate application authorization for Admin**, so that I can access administrator privileges and manage the engine's configuration.
- [ ] 3. As a System Administrator, I want to **be presented with an initial administrator setup screen on first access if no administrator account exists**, so that I can configure an initial admin user for the process engine.

## 2. User Management (8)

- [ ] 1. As a System Administrator, I want to **add new user profiles**, so that I can onboard new users to the Camunda platform.
- [ ] 2. As a System Administrator, I want to **edit existing user profiles, including name and email address**, so that I can keep user information up-to-date.
- [ ] 3. As a System Administrator, I want to **delete user profiles**, so that I can remove users who no longer require access to the system.
- [ ] 4. As a System Administrator, I want to **manage group memberships for users**, so that I can control user access and permissions based on their assigned roles.
- [ ] 5. As a System Administrator, I want to **change user passwords**, so that I can assist users with password resets or enforce security policies.
- [ ] 6. As a System Administrator, I want to **unlock user accounts**, so that users can regain access after being locked out.
- [ ] 7. As a System Administrator, I want to **view user profiles and their associated group memberships**, so that I can understand their current access rights and roles.
- [ ] 8. As a System Administrator, I want to **be aware that user management functionalities are read-only when Camunda 7 is connected to an LDAP system**, so that I know to manage users externally in such configurations.

## 3. Group Management (5)

- [ ] 1. As a System Administrator, I want to **add new user groups**, so that I can define roles and organizational structures within Camunda.
- [ ] 2. As a System Administrator, I want to **edit existing user groups**, so that I can update group details or properties.
- [ ] 3. As a System Administrator, I want to **delete user groups**, so that I can remove obsolete roles or restructure the organization.
- [ ] 4. As a System Administrator, I want to **view the members of a specific group**, so that I can understand which users belong to particular roles.
- [ ] 5. As a System Administrator, I want to **be aware that group management functionalities are read-only when Camunda 7 is connected to an LDAP system**, so that I know to manage groups externally in such configurations.

## 4. Tenant Management (6)

- [ ] 1. As a System Administrator, I want to **create new tenants by specifying a Tenant ID and Tenant Name**, so that I can isolate data and processes for different organizational units or customers.
- [ ] 2. As a System Administrator, I want to **edit existing tenants**, so that I can update tenant details or configuration.
- [ ] 3. As a System Administrator, I want to **delete tenants**, so that I can remove discontinued or unused tenant configurations.
- [ ] 4. As a System Administrator, I want to **add users to a tenant from their user account settings**, so that I can grant individual users access to specific tenant data.
- [ ] 5. As a System Administrator, I want to **add groups to a tenant from their group settings**, so that I can grant entire groups access to specific tenant data.
- [ ] 6. As a System Administrator, I want to **view which users or groups are members of a tenant**, so that I can understand tenant access configurations at a glance.

## 5. Authorization Management (10)

- [ ] 1. As a System Administrator, I want to **access the Authorization Management menu**, so that I can configure and manage permissions for various resources across users and groups.
- [ ] 2. As a System Administrator, I want to **grant or revoke access to Camunda web applications (Admin, Cockpit, Tasklist)** for specific users or groups, so that I can control who can use each application.
- [ ] 3. As a System Administrator, I want to **grant READ access to specific Tasklist filters** for users or groups, so that they can view relevant task lists.
- [ ] 4. As a System Administrator, I want to **configure member visibility for users and groups in Tasklist**, so that users can see their colleagues and group information based on defined authorizations.
- [ ] 5. As a System Administrator, I want to **define application-specific permissions (e.g., READ-only access in Cockpit)** for resources like Process Definitions, Process Instances, and Tasks, so that I can fine-tune access within applications.
- [ ] 6. As a System Administrator, I want to **restrict user or group access to specific process definitions and process instances**, so that I can control who can view and manage particular processes.
- [ ] 7. As a System Administrator, I want to **create an administrator account with ALL permissions for every possible resource**, so that I can ensure comprehensive administrative control over the system.
- [ ] 8. As a System Administrator, I want to **grant permissions (READ, CREATE_INSTANCE for process definition; CREATE for process instances) to users or groups to start processes from Tasklist**, so that they can initiate new process instances.
- [ ] 9. As a System Administrator, I want to **grant permissions for individual process instances**, so that specific users or groups can manage particular running processes.
- [ ] 10. As a System Administrator, I want to **grant permissions for individual tasks**, so that specific users or groups can interact with particular tasks.

## 6. Auditing (Operation Log) (6)

- [ ] 1. As a System Administrator, I want to **access the Operation Log in the System submenu of Admin**, so that I can audit activities performed by users within the Admin application.
- [ ] 2. As a System Administrator, I want to **view details about logged operations, including which user performed it, when, which entities were involved, and what changes were made**, so that I can understand the history of administrative actions.
- [ ] 3. As a System Administrator, I want to **filter the Operation Log by User ID**, so that I can track actions performed by a specific user.
- [ ] 4. As a System Administrator, I want to **filter the Operation Log by Timestamp (before/after a specific time)**, so that I can inspect operations within a particular time period.
- [ ] 5. As a System Administrator, I want to **filter the Operation Log by Entity Type (e.g., Authorizations)**, so that I can focus on changes related to specific resource types.
- [ ] 6. As a System Administrator, I want to **add and remove columns in the Operation Log table**, so that I can customize the displayed information for better auditing and analysis.

## 7. Configuration (11)

- [ ] 1. As a System Administrator, I want to **configure Admin to integrate with an LDAP identity service**, so that user and group management can be handled externally and synchronized.
- [ ] 2. As a System Administrator, I want to **customize the Admin logo and header color via `user-styles.css`**, so that I can align the application's appearance with corporate branding guidelines.
- [ ] 3. As a System Administrator, I want to **change the application name and vendor displayed in Admin via `config.js`**, so that I can brand the application appropriately.
- [ ] 4. As a System Administrator, I want to **configure available locales and a fallback locale for Admin via `config.js`**, so that users can experience the application in their preferred language.
- [ ] 5. As a System Administrator, I want to **create and add new localization files for Admin**, so that I can support additional languages for the user interface.
- [ ] 6. As a System Administrator, I want to **include custom JavaScript files (frontend modules) in Admin via `config.js`**, so that I can extend its functionality with custom code or integrations.
- [ ] 7. As a System Administrator, I want to **change the CSRF cookie name in `config.js` and on the server-side**, so that I can prevent conflicts with other applications running within the same origin.
- [ ] 8. As a System Administrator, I want to **disable the welcome message for new users on the Admin login page via `config.js`**, so that I can control the initial user experience and onboarding flow.
- [ ] 9. As a System Administrator, I want to **configure the maximum length of user operation log annotations in Admin via `config.js`**, so that I can accommodate specific database limits or internal auditing requirements.
- [ ] 10. As a System Administrator, I want to **enable or disable the default display of task worker metrics on the Admin metrics page via `config.js`**, so that I can control the visibility of performance-related data.
- [ ] 11. As a System Administrator, I want to **perform advanced style customization using LESS files and Grunt compilation**, so that I can deeply modify the overall appearance and theme of Admin.

## 8. Plugins (5)

- [ ] 1. As a System Administrator, I want to **add custom plugins to Admin**, so that I can extend its functionality without modifying the core application code.
- [ ] 2. As a System Administrator, I want to **publish Admin plugins by placing the class name in `META-INF/services/org.camunda.bpm.admin.plugin.spi.AdminPlugin`**, so that Admin can discover and load them.
- [ ] 3. As a System Administrator, I want to **add new routes or pages to Admin via the `admin.route` plugin point**, so that I can integrate custom views or functionalities directly into the navigation.
- [ ] 4. As a System Administrator, I want to **add new sections to the Admin dashboard via the `admin.dashboard.section` plugin point**, so that I can display custom information or quick links.
- [ ] 5. As a System Administrator, I want to **be aware that Admin plugins do not support additional SQL queries via MyBatis mappings**, so that I can design plugins appropriately within technical constraints.

## 9. Shared Security Configuration (10)

- [ ] 1. As a System Administrator, I want to **configure CSRF prevention settings (e.g., `targetOrigin`, `denyStatus`, `entryPoints`, cookie flags) for Admin**, so that I can protect against Cross-Site Request Forgery attacks.
- [ ] 2. As a System Administrator, I want to **enable the `Secure` cookie flag for both session and CSRF cookies**, so that tokens are only transmitted over secure HTTPS connections, enhancing overall security.
- [ ] 3. As a System Administrator, I want to **enable the `HttpOnly` flag for session cookies**, so that these cookies cannot be accessed via client-side JavaScript, mitigating Cross-Site Scripting (XSS) attacks.
- [ ] 4. As a System Administrator, I want to **configure the `SameSite` attribute for session and CSRF cookies (e.g., 'Lax' or 'Strict')**, so that I can control cookie behavior for cross-site requests and enhance protection.
- [ ] 5. As a System Administrator, I want to **be aware that the `HttpOnly` flag is intentionally absent and not configurable for the CSRF cookie**, so that I understand its fundamental design requirement for JavaScript readability.
- [ ] 6. As a System Administrator, I want to **be aware that the `SameSite` property for session cookies might be absent by default on certain Java containers (e.g., JBoss EAP/WildFly)**, so that I can account for platform-specific cookie behaviors.
- [ ] 7. As a System Administrator, I want to **configure XSS Protection headers for Admin**, so that I can enable browser-side mechanisms to detect and mitigate cross-site scripting attacks.
- [ ] 8. As a System Administrator, I want to **define and enforce a Content Security Policy (CSP) for Admin**, so that I can prevent cross-site scripting and code injection attacks and control which resources the browser is allowed to load.
- [ ] 9. As a System Administrator, I want to **configure Content-Type Options headers for Admin**, so that browsers correctly interpret resource MIME types and prevent MIME sniffing attacks.
- [ ] 10. As a System Administrator, I want to **enable and configure Strict Transport Security (HSTS) headers for Admin when using HTTPS**, so that browsers enforce secure connections and protect against man-in-the-middle attacks by automatically redirecting HTTP requests to HTTPS.


# Tasklist (47)

## 1. General Interaction & Accessibility (5)

- [ ] 1. As an **End User**, I want to navigate the Tasklist using only my keyboard (TAB and ENTER), so that I can interact with the application efficiently without a mouse.
- [ ] 2. As an **End User**, I want to use keyboard shortcuts to quickly jump to specific sections (like the filter list, task list, or embedded form) or perform operations (like claiming a task or opening the start process dialog), so that I can work more efficiently and reduce repetitive actions.
- [ ] 3. As an **End User**, I want to access a list of all available keyboard shortcuts, so that I can discover and utilize them to enhance my productivity.
- [ ] 4. As an **End User**, I want to easily switch between different dashboard views (e.g., focusing on filters, results, the task view, or the full dashboard), so that I can optimize my workspace for my current task or preference.
- [ ] 5. As an **End User**, I want the Tasklist application to display content in my preferred language, so that I can understand and interact with the application comfortably.

## 2. Task Viewing & Navigation (10)

- [ ] 1. As a **Team Member**, I want to see an overview of my pending tasks on the Tasklist dashboard, so that I can quickly assess my current workload.
- [ ] 2. As a **Team Member**, I want to view tasks within a selected filter, sorted by specified criteria (e.g., creation date), so that I can prioritize and manage my work effectively.
- [ ] 3. As a **Team Member**, I want to change the sorting order of tasks (e.g., ascending or descending), so that I can arrange my task list according to my immediate needs.
- [ ] 4. As a **Team Member**, I want to sort tasks by multiple properties in a hierarchical manner, so that I can refine the organization of my task list.
- [ ] 5. As a **Team Member**, I want to sort tasks by the values of specific variables, so that I can prioritize tasks based on their associated business data (e.g., sorting invoices by amount).
- [ ] 6. As a **Team Member**, I want to select a task from the filter results, so that I can open its details and begin working on it.
- [ ] 7. As a **Team Member**, I want to view detailed task information, including the task form, history, process diagram, and description, via dedicated tabs, so that I have all necessary context to complete the task.
- [ ] 8. As a **Team Member**, I want to review the history of a task, including its assignment changes, updates to due and follow-up dates, and comments, so that I can understand its past progression.
- [ ] 9. As a **Team Member**, I want to see the process diagram with the current task highlighted, so that I can understand the task's position and context within the overall business process.
- [ ] 10. As a **Team Member**, I want to inspect the description of a User Task, so that I can fully understand its purpose and requirements.

## 3. Task Filtering & Search (13)

- [ ] 1. As a **Team Member**, I want to create new filters, so that I can define and view specific collections of tasks relevant to my work.
- [ ] 2. As a **Team Member**, I want to specify the name, description, color, and priority for my filters, so that I can easily identify and organize them on the dashboard.
- [ ] 3. As a **Team Member**, I want to configure a filter to automatically refresh its results, so that I always see the most current tasks without manual intervention.
- [ ] 4. As a **Team Member**, I want to set permissions for a filter, making it accessible to all users or specific groups, so that I can share relevant task lists with my colleagues.
- [ ] 5. As a **Team Member**, I want to define specific criteria (e.g., Process Instance ID, Assignee, Due Date) for a filter, so that only tasks matching these criteria are displayed.
- [ ] 6. As a **Team Member**, I want to use expressions (like JUEL or the dateTime class) in filter criteria, so that I can create dynamic and advanced task filters (e.g., "tasks due today").
- [ ] 7. As a **Team Member**, I want to specify which variables are displayed directly in the filter results section, so that I can quickly view key data about tasks without opening each one individually.
- [ ] 8. As a **Team Member**, I want to search for tasks within the currently selected filter results, so that I can quickly pinpoint a specific task.
- [ ] 9. As a **Team Member**, I want to use various search parameters and operators (like 'like' or 'in') when searching for tasks, so that I can perform flexible and precise queries.
- [ ] 10. As a **Team Member**, I want to search for tasks based on their associated process, task, or case variables, so that I can find tasks linked to specific data.
- [ ] 11. As a **Team Member**, I want to perform case-insensitive searches for variable values, so that I don't miss tasks due to capitalization differences.
- [ ] 12. As a **Team Member**, I want to copy a link to my current search query, so that I can easily share or revisit complex searches.
- [ ] 13. As a **Team Member**, I want to save and retrieve frequently used search queries, so that I can quickly apply them without re-entering criteria.

## 4. Task Actions (Claim, Assign, Dates, Comments) (6)

- [ ] 1. As a **Team Member**, I want to claim an unassigned task, so that I can take ownership and begin working on it.
- [ ] 2. As a **Team Member**, I want to unclaim a task I have previously claimed, so that it becomes available for other team members to take over.
- [ ] 3. As a **Team Member**, I want to reassign a task to a different user or user group, so that the appropriate person or team is made responsible for its completion.
- [ ] 4. As a **Team Member**, I want to set a due date for a task, so that I can ensure it is completed by a specific deadline.
- [ ] 5. As a **Team Member**, I want to set a follow-up date for a task, so that I can receive a reminder or monitor its progress at a later time.
- [ ] 6. As a **Team Member**, I want to add comments to a task, so that I can communicate important context, updates, or questions to other team members.

## 5. Task Forms & Completion (2)

- [ ] 1. As a **Team Member**, I want to interact with a task using its embedded, generated, or generic task form, so that I can provide the necessary input and data for the process.
- [ ] 2. As a **Team Member**, I want to complete a task by submitting its form, so that the workflow can progress to its next stage.

## 6. Process Initiation (4)

- [ ] 1. As a **Team Member**, I want to start a new process instance directly from Tasklist, so that I can initiate a new business workflow.
- [ ] 2. As a **Team Member**, I want to select from a list of available process definitions when starting a new process, so that I can choose the correct workflow to initiate.
- [ ] 3. As a **Team Member**, I want to fill out a start form when initiating a process, so that I can provide all necessary initial data for the process instance.
- [ ] 4. As a **Team Member**, I want to add variables to a new process instance if no specific start form is defined, so that I can still provide essential initial data.

## 7. Standalone Task Management (3)

- [ ] 1. As a **Team Member**, I want to create a standalone task, define its name, assignee, and description, so that I can manage ad-hoc work that is not part of a formal business process.
- [ ] 2. As a **Team Member**, I want to add variables to a standalone task, so that I can include relevant data for its completion.
- [ ] 3. As a **Team Member**, I want to complete a standalone task, so that its status reflects its finished state and it no longer appears in my active task list.

## 8. User Profile Management (4)

- [ ] 1. As an **End User**, I want to access my user profile settings from any Camunda web application, so that I can manage my personal account details.
- [ ] 2. As an **End User**, I want to edit my name and email address in my profile, so that my contact information is accurate and up-to-date.
- [ ] 3. As an **End User**, I want to change my password in my profile, so that I can maintain the security of my account.
- [ ] 4. As an **End User**, I want to view my group memberships in my profile, so that I understand my roles and associated access rights within the system.



# Cockpit (139)

## 1. General Monitoring & Dashboard (19)

### 1.1. Cockpit Dashboard Overview (5)
- [ ] 1. As a **Process Operator**, I want to see a quick overview of **running process instances, open incidents, and open human tasks** on the dashboard, so that I can immediately identify areas requiring attention.
- [ ] 2. As a **Process Operator**, I want to click on a pie chart section or number to be **forwarded to a filtered search**, so that I can investigate specific issues faster.
- [ ] 3. As a **Business Analyst**, I want to see an overview of **deployed process, decision, and case definitions**, so that I can understand the available processes in the system.
- [ ] 4. As a **Business Analyst**, I want to view **metrics graphs for executed activity instances, evaluated decision instances, and executed jobs** for different timeframes (day, week, month) (Enterprise Feature), so that I can analyze performance trends over time.
- [ ] 5. As a **Process Operator**, I want to **select a desired engine via a dropdown** if working with multiple engines, so that I can monitor and operate on the correct process data.

### 1.2. Processes Dashboard (8)
- [ ] 1. As a **Process Operator**, I want to **observe the state of deployed process definitions**, with visual indicators (green and red dots) signaling running and failed jobs, so that I can quickly identify processes with unresolved incidents.
- [ ] 2. As a **Process Operator**, I want to **search for deployed processes by their name or key** using the 'like' operator, so that I can easily find specific process definitions.
- [ ] 3. As a **Process Operator**, I want to **search for process instances and incidents** using various criteria and operators (e.g., 'like', 'IN', 'NOT IN') (Enterprise Feature for incident search and some operators), so that I can locate specific issues or sets of instances for investigation.
- [ ] 4. As a **Process Operator**, I want to **perform batch operations on process instances matching search criteria**, so that I can efficiently manage multiple instances.
- [ ] 5. As a **Process Operator**, I want to **export affected process instances and their process variable values as CSV spreadsheets** (Enterprise Feature), so that I can communicate incident details efficiently with other system owners.
- [ ] 6. As a **Process Operator**, I want to **copy the IDs of selected process instances**, so that I can use them for further filtering or operations.
- [ ] 7. As a **Business Analyst**, I want to **view a preview tab of deployed process models**, along with information on running instances and process state, so that I can quickly understand the process flow and its current activity.
- [ ] 8. As a **Process Operator**, I want to **delete all versions of a process definition** (Enterprise Feature), with options to skip custom listeners and cascade deletion if instances are running, so that I can manage outdated or erroneous process definitions.

### 1.3. Decisions Dashboard (3)
- [ ] 1. As a **Business Analyst**, I want to see a **list of deployed decision definitions and decision requirements definitions**, so that I can easily access them for detailed analysis.
- [ ] 2. As a **Business Analyst**, I want to **search for decision instances** based on various criteria (Enterprise Feature), so that I can analyze specific decision outcomes or identify trends.
- [ ] 3. As a **Business Analyst**, I want to **add additional columns to search results**, so that I can view more relevant details for decision instances.

### 1.4. Open Tasks Dashboard (3)
- [ ] 1. As a **Business Analyst**, I want to see how **open tasks are distributed by type and by group**, so that I can understand the workload and identify potential bottlenecks.
- [ ] 2. As a **Process Operator**, I want to **search for all tasks** using predefined or custom search parameters (Enterprise Feature), so that I can quickly locate specific tasks for action.
- [ ] 3. As a **Process Operator**, I want to **jump to the corresponding process instances** from the task search results (either runtime or historic view), so that I can investigate the context of a task.

## 2. Process Definition & Instance Management (24)

### 2.1. Process Definition View (11)
- [ ] 1. As a **Process Operator**, I want to **survey all versions of a process definition and their running instances**, with incidents displayed and an instance counter label, so that I can easily locate failed activities within the process.
- [ ] 2. As a **Process Operator**, I want to **navigate through the process diagram** by panning and zooming, so that I can examine different parts of the process visually.
- [ ] 3. As a **Process Operator**, I want to **view all running process instances in a tabular list**, and be able to navigate to their individual process instance views, so that I can drill down into specific instances.
- [ ] 4. As a **Process Operator**, I want to **view the job definitions linked to the process definition**, including their name, type, configuration, and state, so that I can monitor and manage automated tasks.
- [ ] 5. As a **Process Operator**, I want to **suspend and reactivate job definitions**, so that I can control their processing.
- [ ] 6. As a **Process Operator**, I want to **set the priority of jobs**, and optionally include existing jobs, so that I can influence their execution order.
- [ ] 7. As a **Process Operator**, I want to **filter process instances by variables, business keys, activity IDs, and date/time** in both runtime and history views (Enterprise Feature for history view filters), so that I can pinpoint specific instances for investigation.
- [ ] 8. As a **Process Operator**, I want to **delete multiple running process instances at once** (Enterprise Feature), with the option to provide a reason and apply filters, so that I can efficiently clean up erroneous instances.
- [ ] 9. As a **Process Operator**, I want to **delete the current process definition version** (Enterprise Feature), with options to skip custom listeners and cascade if instances are running, so that I can manage the process lifecycle.
- [ ] 10. As a **Business Analyst**, I want to **inspect BPMN documentation** for process elements (Enterprise Feature), so that I can understand the business context and details of activities.
- [ ] 11. As a **Business Analyst**, I want to **navigate from a Call Activity to its respectively called process definitions**, so that I can understand hierarchical process structures.

### 2.2. Process Instance View (7)
- [ ] 1. As a **Process Operator**, I want to **explore running activities, variables, tasks, and jobs** of a single process instance through an interactive diagram and an activity instance tree view, so that I can understand its current execution state.
- [ ] 2. As a **Process Operator**, I want to **drill down into called process instances** from a Call Activity overlay, so that I can investigate sub-processes.
- [ ] 3. As a **Process Operator**, I want to **view and edit process variables** within the detailed information panel, including adding new ones and changing data types, so that I can correct or update process data as needed.
- [ ] 4. As a **Process Operator**, I want to **access stacktraces for incidents and increment retries for failed jobs**, so that I can diagnose and attempt to resolve issues directly.
- [ ] 5. As a **Process Operator**, I want to **manage users and groups for selected user tasks**, so that I can reassign tasks if needed.
- [ ] 6. As a **Process Operator**, I want to **edit due dates for active jobs and suspend/activate jobs**, so that I can manage scheduled job execution.
- [ ] 7. As a **Process Operator**, I want to **cancel a single process instance**, with options to skip custom listeners and I/O mappings, so that I can terminate erroneous instances.

### 2.3. Failed Jobs Management (2)
- [ ] 1. As a **Process Operator**, I want to **identify unresolved incidents indicated as failed jobs** and drill down to them using process status dots, so that I can quickly pinpoint problem areas.
- [ ] 2. As a **Process Operator**, I want to **retry a failed job** individually or in bulk (Enterprise Feature for bulk), so that I can attempt to resolve transient errors and resume process execution.

### 2.4. Process Suspension (2)
- [ ] 1. As a **Process Operator**, I want to **suspend and reactivate a process definition**, with options to apply this to all instances and define an instant or scheduled time, so that I can control when new instances can be started.
- [ ] 2. As a **Process Operator**, I want to **suspend and reactivate a process instance**, so that I can pause or resume its execution and included tasks.

### 2.5. Message Correlation (2)
- [ ] 1. As a **Process Operator**, I want to **correlate messages to process instances** via a batch operation, specifying message name, variables, and selecting instances, so that I can continue execution in message-catching flow nodes.
- [ ] 2. As a **Process Operator**, I want to **open the message correlation dialog from a process action button or diagram overlays**, so that I can quickly configure message correlation for specific processes or flow-nodes.

## 3. Advanced Process Operations (Enterprise Features) (19)

### Process Instance Modification (Enterprise Feature) (8)
- [ ] 1. As a **Process Operator**, I want to **modify a process instance's execution state** by starting execution before/after an activity, starting a transition, or canceling activity instances (Enterprise Feature), so that I can correct errors, adapt processes on the fly, or test specific segments.
- [ ] 2. As a **Process Operator**, I want to **drag an instance badge from one activity to another to create a "move token" operation** (Enterprise Feature), so that I can visually and intuitively re-route process execution.
- [ ] 3. As a **Process Operator**, I want to **configure new variables when starting new activity instances** (Enterprise Feature), so that I can provide necessary data for the modified flow.
- [ ] 4. As a **Process Operator**, I want to **perform batch modifications on multiple process instances** (Enterprise Feature), so that I can apply changes to many instances efficiently.
- [ ] 5. As a **Process Operator**, I want to **execute modifications asynchronously** (Enterprise Feature), so that I can process large numbers of instances without blocking the application.
- [ ] 6. As a **Process Operator**, I want to **add an annotation to a modification** (Enterprise Feature), so that I can provide an audit trail and context for the changes made.
- [ ] 7. As a **Process Operator**, I want to **select an ancestor activity instance when starting a new activity** (Enterprise Feature), so that I can control the scope in which the new activity instance is created.
- [ ] 8. As a **Process Operator**, I want to **modify multi-instance activity instances**, either by starting an entire multi-instance body or a single inner activity instance (Enterprise Feature), so that I can adjust parallel or sequential executions.

### Process Instance Restart (Enterprise Feature) (5)
- [ ] 1. As a **Process Operator**, I want to **restart terminated process instances** before or after specific activities (Enterprise Feature), so that I can restore processes after erroneous cancellations or wrong decisions.
- [ ] 2. As a **Process Operator**, I want to **select specific instances or query all instances** for a restart operation (Enterprise Feature), so that I can target the correct set of processes.
- [ ] 3. As a **Process Operator**, I want to choose to restart with the **initial set of variables or without the business key** (Enterprise Feature), so that I can control the data context of the new instance.
- [ ] 4. As a **Process Operator**, I want to **skip custom listeners and I/O mappings during restart** (Enterprise Feature), so that I can avoid issues with unavailable deployments or classes.
- [ ] 5. As a **Process Operator**, I want to **execute restarts synchronously or asynchronously** (Enterprise Feature), so that I can manage performance for large numbers of instances.

### Process Instance Migration (Enterprise Feature) (6)
- [ ] 1. As a **Process Operator**, I want to **migrate running process instances from their current process definition version to another version or a different process definition** (Enterprise Feature), so that I can manage processes across lifecycle changes.
- [ ] 2. As a **Process Operator**, I want to **visually create and remove mappings between source and target activities** in the migration plan (Enterprise Feature), so that I can intuitively define how instances should transition.
- [ ] 3. As a **Process Operator**, I want to **set variables into the process instances' scope during migration** (Enterprise Feature), so that I can adapt data to the new process definition.
- [ ] 4. As a **Process Operator**, I want to **confirm migration details and select options like asynchronous execution or skipping listeners/I/O mappings** (Enterprise Feature), so that I can control the migration process and ensure stability.
- [ ] 5. As a **Process Operator**, I want to **review error messages for invalid migration plans or failed instance applications** (Enterprise Feature), so that I can troubleshoot and correct migration issues.
- [ ] 6. As a **Process Operator**, I want to **set the update event trigger flag for events** within the migration plan (Enterprise Feature), so that I can control how event triggers are handled during migration.

## 4. DMN Monitoring & Management (14)

### DMN Decisions in Cockpit (1)
- [ ] 1. As a **Business Analyst**, I want to monitor DMN Decisions, starting from the dashboard, so that I can gain insights into decision execution.

### Decision Definition View (6)
- [ ] 1. As a **Business Analyst**, I want to see the **decision table or literal expression of a deployed decision definition** and change its version, so that I can understand the decision logic across different versions.
- [ ] 2. As a **Business Analyst**, I want to **view a listing of all instances for a decision definition** and search for specific instances, so that I can analyze past executions.
- [ ] 3. As a **Business Analyst**, I want to **see the process definition and instance ID** that executed a specific decision instance, so that I can understand the context of the decision.
- [ ] 4. As a **Process Operator**, I want to **edit DMN tables directly in Cockpit** (Enterprise Feature), so that I can quickly adapt decision logic without redeploying the entire process application.
- [ ] 5. As a **Process Operator**, I want to **download changed DMN tables or upload local DMN files** (Enterprise Feature), so that I can manage DMN versions and integrate external changes.
- [ ] 6. As a **Process Operator**, I want to **review and deploy changed DMN tables** (Enterprise Feature), knowing it creates a new deployment, so that I can update decision logic in the system.

### Decision Instance View (2)
- [ ] 1. As a **Business Analyst**, I want to see the **executed decision table or literal expression with input variables and decision results**, so that I can understand how a specific decision was made.
- [ ] 2. As a **Business Analyst**, I want to see **matched rules highlighted** during decision table execution, so that I can easily identify the path taken by the decision.

### Decision Requirements Definition (DRD) View (3)
- [ ] 1. As a **Business Analyst**, I want to find a **diagram of the deployed decision requirements definition** and navigate through it (Enterprise Feature), so that I can understand the relationships between decisions.
- [ ] 2. As a **Business Analyst**, I want to **filter decision instances by selected decision definitions** within the DRD diagram (Enterprise Feature), so that I can focus on specific parts of the decision logic.
- [ ] 3. As a **Business Analyst**, I want to see a **listing of all decision instances and decision requirements definition instances** for the current definition (Enterprise Feature), so that I can analyze aggregated execution data.

### Decision Requirements Definition (DRD) Instance View (2)
- [ ] 1. As a **Business Analyst**, I want to find a **diagram of the deployed decision requirements definition** for a specific instance and navigate through it (Enterprise Feature), so that I can understand how a particular set of decisions was executed.
- [ ] 2. As a **Business Analyst**, I want to **filter decision instances in the table below by clicking on a decision definition** on the diagram (Enterprise Feature), so that I can investigate specific decision outcomes within the DRD instance.

## 5. Deployment & Batch Management (13)

### Deployment View (6)
- [ ] 1. As a **Process Operator**, I want to see an **overview of all deployments, their resources, and content**, so that I can manage process and decision models.
- [ ] 2. As a **Process Operator**, I want to **search for deployments by ID, name, time, or source** and sort the list, so that I can quickly find specific deployments.
- [ ] 3. As a **Process Operator**, I want to **delete existing deployments** with options to cascade deletion and skip listeners/I/O mappings, so that I can remove outdated or erroneous deployments.
- [ ] 4. As a **Process Operator**, I want to **redeploy an existing deployment or a single resource within it** (Enterprise Feature), so that I can update process definitions and create new versions.
- [ ] 5. As a **Process Operator**, I want to **create a new deployment by specifying a name and selecting files** (Enterprise Feature), so that I can deploy new process and decision models.
- [ ] 6. As a **Business Analyst**, I want to **preview diagrams or tables of definition resources** and see their version numbers, so that I can verify the deployed models.

### Batch Operations (3)
- [ ] 1. As a **Process Operator**, I want to **execute various batch operations** like deleting instances, setting job retries, suspending/activating instances, deleting decision instances, setting removal times, or correlating messages (Enterprise Feature), so that I can perform bulk actions on process elements.
- [ ] 2. As a **Process Operator**, I want to **define the instances affected by a batch operation** using filters or selecting specific instances (Enterprise Feature), so that I can precisely target my operations.
- [ ] 3. As a **Process Operator**, I want to **review a summary of the batch operation**, including affected instance count and the underlying REST payload (Enterprise Feature), so that I can confirm the operation before execution.

### Batch View (4)
- [ ] 1. As a **Process Operator**, I want to **display the status of running and completed batches**, including details like ID, type, user, start/end time, failed jobs, and progress, so that I can monitor their execution.
- [ ] 2. As a **Process Operator**, I want to see **error messages and stacktraces for failed jobs within a batch**, and retry or delete them, so that I can resolve batch processing issues.
- [ ] 3. As a **Process Operator**, I want to **suspend, resume, or delete running batches** and delete batch history, so that I can manage batch operations through their lifecycle.
- [ ] 4. As a **Process Operator**, I want to **search for batches using various criteria**, so that I can quickly find specific batch operations.

## 6. History & Auditing(Enterprise Features) (22)

### History in Cockpit(Enterprise Feature) (9)
- [ ] 1. As a **Business Analyst**, I want to access a **history view for process definitions and instances** (Enterprise Feature), so that I can audit past process executions and understand completed workflows.
- [ ] 2. As a **Business Analyst**, I want to see a **heatmap overlay on the BPMN diagram** (Enterprise Feature), showing activity on nodes and sequence flows, so that I can identify frequently used paths in a process.
- [ ] 3. As a **Business Analyst**, I want to view a **detailed audit log of activities** within a process instance, including start/end times, activity instance IDs, and current states (Enterprise Feature), so that I can reconstruct the exact execution flow.
- [ ] 4. As a **Business Analyst**, I want to **see changes of selected variables over time** in the variable log (Enterprise Feature), so that I can track data evolution during a process instance.
- [ ] 5. As a **Process Operator**, I want to **view job logs and external tasks logs** for both process definitions and instances (Enterprise Feature), so that I can troubleshoot issues related to automated tasks.
- [ ] 6. As a **Business Analyst**, I want to view **called process instances and executed decision instances** within a process instance (Enterprise Feature), so that I can understand the interdependencies between processes and decisions.
- [ ] 7. As a **Process Operator**, I want to **view all incidents related to a process instance** (Enterprise Feature), including message type, creation time, and cause, so that I can diagnose problems.
- [ ] 8. As a **Business Analyst**, I want to see an **overview of user tasks related to a process instance**, including assignees, creation, and completion dates (Enterprise Feature), so that I can track human task execution.
- [ ] 9. As a **Process Operator**, I want to **delete historical variables** within a process instance (Enterprise Feature), so that I can manage historical data.

### Auditing of Cockpit Operations (Enterprise Feature) (4)
- [ ] 1. As a **Process Operator**, I want to **inspect which user performed which operation in Cockpit**, including when it was performed and what changes were made (Enterprise Feature), so that I can audit administrative actions and ensure compliance.
- [ ] 2. As a **Process Operator**, I want to **filter the operation log by User ID, Timespan, or Operation Type** (Enterprise Feature), so that I can efficiently find specific audit records.
- [ ] 3. As a **Process Operator**, I want to **add annotations to operation logs** (Enterprise Feature), so that I can provide context for operations performed.
- [ ] 4. As a **Process Operator**, I want to view the **User Operation Log specific to a process instance** (Enterprise Feature), so that I can see all operations affecting that particular process.

### Cleanup View (Enterprise Feature) (4)
- [ ] 1. As a **Process Operator**, I want to see the **history cleanup state and manually trigger cleanup jobs** (Enterprise Feature), so that I can manage database size and performance.
- [ ] 2. As a **Process Operator**, I want to view **statistics on cleanable process/decision/case instances and batch operations** (Enterprise Feature), so that I can assess the effectiveness of cleanup configurations.
- [ ] 3. As a **Process Operator**, I want to **modify history time to live directly from the table** for a specific definition version (Enterprise Feature), so that I can adjust data retention policies.
- [ ] 4. As a **Business Analyst**, I want to review **metrics of deleted data** for the current day, week, or month (Enterprise Feature), so that I can monitor historical data removal.

### Reports (Enterprise Feature) (5)
- [ ] 1. As a **Business Analyst**, I want to generate a **Process Instance Duration Report** (Enterprise Feature), showing average, minimum, and maximum duration for a selected process definition and version, so that I can analyze process efficiency.
- [ ] 2. As a **Business Analyst**, I want to **aggregate process duration times monthly or quarterly** (Enterprise Feature), so that I can identify long-term performance trends.
- [ ] 3. As a **Business Analyst**, I want to **export report results in CSV or JSON format** (Enterprise Feature), so that I can use the data in other analysis tools.
- [ ] 4. As a **Business Analyst**, I want to generate a **Completed Task Instance Report** (Enterprise Feature), grouped by task definition or process definition key, so that I can analyze task completion rates and workloads.
- [ ] 5. As a **Business Analyst**, I want to generate a **duration report for completed tasks** (Enterprise Feature), so that I can understand how long tasks are taking to complete.

## 7. Configuration & Extensibility (13)

### Cockpit Configuration (11)
- [ ] 1. As a **Process Operator**, I want to **change the logo and header color of Cockpit**, so that I can customize the application's appearance to match corporate branding.
- [ ] 2. As a **Process Operator/Business Analyst**, I want Cockpit to be **localized to my browser's language settings**, with a configurable fallback, so that I can use the application in my preferred language.
- [ ] 3. As a **Process Operator/Business Analyst**, I want to be able to **create new localizations** by copying, translating, and adding locale files, so that I can add support for other languages.
- [ ] 4. As a **Process Operator**, I want to **include custom JavaScript files (frontend modules)**, so that I can extend Cockpit with custom functionality.
- [ ] 5. As a **Process Operator**, I want to **customize the BPMN diagram viewer with additional modules or moddle extensions**, so that I can enhance its functionality or display.
- [ ] 6. As a **Process Operator**, I want to **configure default values and visibility for 'skipCustomListeners', 'skipIoMappings', and 'cascade' flags**, so that I can standardize common operational settings.
- [ ] 7. As a **Process Operator**, I want to **configure the default filter for the historic process instances search**, so that I can reduce the amount of data retrieved by default.
- [ ] 8. As a **Process Operator**, I want to **configure the maximum length of User Operation Log annotations**, so that I can adjust to database limits.
- [ ] 9. As a **Process Operator**, I want to **disable the preview of embedded forms with script tags**, so that I can enhance security if I don't trust deployed HTML files.
- [ ] 10. As a **Business Analyst**, I want to configure whether **runtime activity instance statistics are displayed by default** in the process definition runtime view, so that I can control the initial information presented.
- [ ] 11. As a **Business Analyst**, I want to configure the **adjustable period and default time unit for historic activity instance metrics**, so that I can control how historical activity data is displayed.

### Cockpit Plugins (2)
- [ ] 1. As a **Process Operator/Business Analyst**, I want to **add custom functionality to Cockpit via plugins**, so that I can extend its capabilities to meet specific business needs.
- [ ] 2. As a **Process Operator**, I want to **exclude specific plugins or plugin features** from the interface, so that I can simplify the UI or remove unwanted functionality.

## 8. Security (Shared Web Application Options affecting Cockpit) (15)

### Authentication (4)
- [ ] 1. As a **Process Operator**, I want Camunda Cockpit to **verify a user’s identity against the web apps on the login page**, so that only authorized users can access the application.
- [ ] 2. As a **Process Operator**, I want authentication information (engine name, username, group/tenant memberships, authorized applications) to be **correlated against authorizations**, so that user access to data and operations is properly restricted.
- [ ] 3. As a **Process Operator**, I want the authentication information to be **cached for a configurable time**, so that performance is optimized by reducing database queries.
- [ ] 4. As a **Process Operator**, I want to be able to use **Container-Based Authentication and Single Sign-On**, so that authentication can integrate with existing enterprise security systems.

### CSRF Prevention (2)
- [ ] 1. As a **Process Operator**, I want a **CSRF filter to be enabled by default**, validating each modifying request, so that the web application is protected against Cross-Site Request Forgery attacks.
- [ ] 2. As a **Process Operator**, I want to **configure CSRF prevention parameters** like target origin, deny status, entry points, and cookie settings (Secure, SameSite, custom name), so that I can tailor security to my environment.

### Cookie Security (4)
- [ ] 1. As a **Process Operator**, I want the web applications to use **Session Cookies and CSRF Prevention Cookies**, so that user sessions are preserved and CSRF attacks are prevented.
- [ ] 2. As a **Process Operator**, I want to be able to **enable the 'Secure' flag for cookies** and use an HTTPS connection, so that cookies are not sent over insecure HTTP connections.
- [ ] 3. As a **Process Operator**, I understand that the **'HttpOnly' flag is absent for the CSRF cookie**, so that the JavaScript HTTP Client can read the token.
- [ ] 4. As a **Process Operator**, I want to understand the **default 'SameSite' property for cookies**, so that I can configure it appropriately for my browser environment.

### HTTP Header Security (5)
- [ ] 1. As a **Process Operator**, I want the HTTP Header Security mechanism to be available to **add security-related response headers**, so that browser-side security mechanisms are enabled.
- [ ] 2. As a **Process Operator**, I want **XSS Protection** to be enabled, so that cross-site scripting attacks are detected and mitigated.
- [ ] 3. As a **Process Operator**, I want to be able to **configure the Content Security Policy**, to prevent cross-site scripting and code injection attacks, while allowing custom scripts and forms.
- [ ] 4. As a **Process Operator**, I want the **Content-Type Options** header to be enabled, so that the browser correctly renders resources based on their declared mime type.
- [ ] 5. As a **Process Operator**, I want to **enable and strengthen the Strict Transport Security (HSTS) header** (disabled by default), so that the web applications are protected against man-in-the-middle attacks by enforcing HTTPS.


# Prioritization

