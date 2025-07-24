# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Packages Used

### Dependencies
* **@prisma/client:** ^5.21.0
* **dompurify:** ^3.0.6
* **marked:** ^9.1.5
* **nodemailer:** ^6.9.7

### Dev Dependencies
* **@sveltejs/adapter-auto:** ^2.0.0
* **@sveltejs/kit:** ^1.20.4
* **prettier:** ^3.6.2
* **prettier-plugin-svelte:** ^3.4.0
* **prisma:** ^5.21.0
* **svelte:** ^4.0.5
* **svelte-check:** ^3.4.3
* **typescript:** ^5.0.0
* **vite:** ^4.4.2