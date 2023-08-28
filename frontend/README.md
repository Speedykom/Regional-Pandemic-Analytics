This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Scope-Based Permissions using keycloak

Once authenticated, the API will return the access and refresh tokens as well as the permissions. These credentials are stored in the state using Redux Toolkit as well as the secure local storage. The hook `usePermission()`, which is located in `common/hooks` folder, allows the developer to display component depending on the available authorization scopes.

Example :

```react
export const Users = () => {
  const { hasPermission } = usePermission();
  return (
    <DashboardFrame>
      {hasPermission('user:read') ? <UserList /> : <Unauthorized />}
    </DashboardFrame>
  );
};
```

### Formatting rules

- Adding a semicolon at the end of every statement.
- Trailing commas where valid in ES5 (objects, arrays, etc.). No trailing commas in type parameters in TypeScript.
- Using single quotes instead of double quotes.
- Using 2 spaces per indentation-level.
- No indent lines with tabs instead of spaces.
- 80 as a line length where Prettier will try wrap.
- Printing spaces between brackets in object literals.

  for more details please visit "https://prettier.io/docs/en/options.html".

### Eslint rules

- No unused variables, functions, and function parameters are allowed.
- No calls or assignments to methods of the console object are allowed.
- No require statements except in import statements are allowed.

  for more details please visit:
  "https://nextjs.org/docs/pages/building-your-application/configuring/eslint#eslint-plugin",
  "https://typescript-eslint.io/rules/".

please run "npm run pre-commit" under the frontend directory to check your code.

### Husky Setup

For setting up Husky please run "prepare:husky" under Regional-Pandemic-Analytics directory
