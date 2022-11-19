# The F2E WEEK2 - E Signature

## Features

- guest
  - [x] create new file
    - [x] upload
    - [x] signature
    - [x] download
    - [ ] google drive (optional)
    - [ ] dropbox (optional)
- [ ] authenticated
  - [ ] create new file
    - [ ] upload
      - [ ] snapshot
      - [ ]upload
      - [ ] create new page (optional)
      - [ ] history (optional)
    - [ ] signature
    - [ ] invite
    - [ ] download
    - [ ] share (optional)
  - [ ] file manager
    - [ ] filter
      - [ ] date
      - [ ] title
      - [ ] signer
    - [ ] signed
    - [ ] draft
    - [ ] pending
  - [ ] setting
    - [ ] config
    - [ ] list of common signer
  - [ ] integration (optional)
    - [ ] colleague
    - [ ] cooperator

## What's in the stac

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)

- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)

- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments

- Styling with [Tailwind](https://tailwindcss.com/)

- End-to-end testing with [Cypress](https://cypress.io)

- Local third party request mocking with [MSW](https://mswjs.io)

- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)

- Code formatting with [Prettier](https://prettier.io)

- Linting with [ESLint](https://eslint.org)

- Static Types with [TypeScript](https://typescriptlang.org)

- A practical functional library with [Ramda](https://ramdajs.com/)

- PDF related:

  - [pdfjs](https://github.com/mozilla/pdf.js/): PDF reader
  - [jspdf](https://github.com/parallax/jsPDF): array-buffer to PDF
  - [pdf-merger-js](https://github.com/nbesli/pdf-merger-js): for merge multiple pdf into one

- Canvas Control with [Konva](https://konvajs.org/)

## Development

- This step only applies if you've opted out of having the CLI install dependencies for you:

```bash
npx remix init
```

- Initial setup: If you just generated this project, this step has been done for you.

```bash
npm run setup
```

- Start dev server:

```bash
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Now that everything is set up you can commit and push your changes to your repo.

Every commit to your `main` branch will trigger a deployment to your production environment,
and every commit to your `dev` branch will trigger a deployment to your staging environment.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment.
Anything that gets into the `main` branch will be deployed to production after running tests/build/etc.
Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory.
As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`.
We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript.
It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project.
It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
