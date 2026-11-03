# OlovPaMyaEventsWebsite

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.2.

## Run the development server

### Prerequisites

Install **Node.js LTS** (which includes npm) and **Git**:

- [Download Node.js](https://nodejs.org/)
- [Download Git](https://git-scm.com/downloads)

After installing, open a terminal and check that both are available:

```text
node --version
npm --version
git --version
```

### macOS

1. Open **Terminal**.
2. Clone the project and go into its folder (if you already have the project, just `cd` to that folder):

   ```bash
   git clone https://github.com/Sharbs10/olov-pa-mya-events-website.git
   cd olov-pa-mya-events-website
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Start the Angular development server:

   ```bash
   npx ng serve
   ```

5. Open [http://localhost:4200](http://localhost:4200) in your browser. Leave Terminal running while you use the site. Press **Control+C** in Terminal to stop the server.

### Windows

1. Open **PowerShell** (or **Windows Terminal**).
2. Clone the project and go into its folder (if you already have the project, just `cd` to that folder):

   ```powershell
   git clone https://github.com/Sharbs10/olov-pa-mya-events-website.git
   cd olov-pa-mya-events-website
   ```

3. Install the project dependencies:

   ```powershell
   npm install
   ```

4. Start the Angular development server:

   ```powershell
   npx ng serve
   ```

5. Open [http://localhost:4200](http://localhost:4200) in your browser. Leave PowerShell running while you use the site. Press **Ctrl+C** in PowerShell to stop the server.

The server automatically reloads when you modify source files. The first dependency installation may take a few minutes.

## Configure community Google Calendars

The website can use a separate Google Calendar for each community. In Google Calendar, create one calendar each for MCF, MYA, and MYO:

1. Beside **Other calendars**, select **+** and choose **Create new calendar**.
2. Name the calendar (for example, `OLOV-MYO-Events`) and create it.
3. Open that calendar's **Settings and sharing**. Under **Integrate calendar**, copy its **Calendar ID**.
4. In both `src/environments/environment.ts` and `src/environments/environment.prod.ts`, add each ID to the matching key:

   ```ts
   calendarIds: {
     mcf: "MCF_CALENDAR_ID",
     mya: "MYA_CALENDAR_ID",
     myo: "MYO_CALENDAR_ID"
   },
   ```

The Calendar ID is not the calendar's display name. It usually looks like an email address and may end in `@group.calendar.google.com`. The existing OLOV-MYA-Events calendar ID is currently configured for MYA.

The app currently reads calendars using a Google API key without signing a user in. For that to work, each calendar must be publicly accessible in Google Calendar's **Access permissions for events**. Public access can expose event details, so do not put private information in these calendars. If a calendar should remain private, the app needs an authenticated Google sign-in integration instead.

Calendar views and downloads show past, present, and future events from the selected community's calendar. The Events page shows only events happening today or later. Each community page automatically uses its configured ID. If an ID is left blank, that community's calendar reports that its ID is not configured.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
