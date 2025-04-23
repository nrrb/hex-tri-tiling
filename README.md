# PDF Hexagonal/Triangular Tiling Generator

I LOVE graph paper, but sometimes I want to plot something on a different tiling than square. 
I wrote this app to give myself the option for triangular and hexagonal grids and produce a PDF
to print and draw on. This is written in JavaScript/React using the [Material UI](https://mui.com/material-ui/) sensible defaults,
and does PDF generation entirely client-side using the [jsPDF](https://github.com/parallax/jsPDF) package. 

This uses [Basis vectors](https://en.wikipedia.org/wiki/Basis_(linear_algebra)) for computing the
grid points, and uses the [Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern) for 
selecting the drawing method.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run build:docs`

Builds the app for Github Pages to the `docs` folder. It uses all settings of `npm run build`.