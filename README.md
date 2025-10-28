# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

my-app/
│
├── public/
│ ├── index.html
│ ├── favicon.ico
│ └── ...
│
├── src/
│ ├── api/ # API service calls, json-server interfaces
│ │ └── jsonServer.js # json-server API setup or fetch utils
│ │
│ ├── app/ # Redux store setup, global state
│ │ └── store.ts
│ │
│ ├── assets/ # Static assets like images, fonts, icons
│ │
│ ├── components/ # Reusable UI Components (buttons, inputs)
│ │ ├── common/ # Generic components used throughout app
│ │ └── layout/ # Header, Footer, Sidebar components
│ │
│ ├── features/ # Feature-specific components and logic
│ │ └── featureName/
│ │ ├── FeatureComponent.tsx
│ │ ├── featureSlice.ts # Redux Toolkit slice for this feature
│ │ └── featureAPI.ts # API calls related to feature
│ │
│ ├── hooks/ # Custom React hooks
│ │
│ ├── pages/ # Route components / pages
│ │ ├── Home.tsx
│ │ ├── About.tsx
│ │ └── ...
│ │
│ ├── routes/ # React Router routes, route configs
│ │ └── AppRoutes.tsx
│ │
│ ├── styles/ # Global styled-components, themes, style utils
│ │ ├── theme.ts
│ │ └── globalStyles.ts
│ │
│ ├── utils/ # Utility functions/helpers
│ │
│ ├── index.tsx # React app entry point
│ └── react-app-env.d.ts # TypeScript environment declarations
│
├── db.json # JSON file for json-server mock data
├── package.json
├── tsconfig.json
├── .eslintrc.json # ESLint config
└── README.md
