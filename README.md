# PDF Hexagonal/Triangular Tiling Generator

I LOVE graph paper, but sometimes I want to plot something on a different tiling than square. 
I wrote this app to give myself the option for triangular and hexagonal grids and produce a PDF
to print and draw on. This is written in JavaScript/React using the [Material UI](https://mui.com/material-ui/) sensible defaults,
and does PDF generation entirely client-side using the [jsPDF](https://github.com/parallax/jsPDF) package. 

This uses [Basis vectors](https://en.wikipedia.org/wiki/Basis_(linear_algebra)) for computing the
grid points, and uses the [Strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern) for 
selecting the drawing method.

I was assisted in writing substantial portions of the code by [ChatGPT](https://chatgpt.com/).

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

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Built with assistance from ChatGPT

Over a series of prompts and my own tweaking, I built this app. I asked ChatGPT for a single prompt that would generate the resulting app:

```
Prompt:

"Please generate a complete React application that uses Material‑UI (MUI) components and jsPDF to create a responsive, full‑viewport tiling tool. The app should include the following features:

Responsive Canvas:

A canvas that fills the entire viewport and redraws on window resize.
The canvas displays a grid tiling that can be either triangular or hexagonal.

Grid Tiling Options:

A control to choose between 'triangular' and 'hexagonal' tiling.
For triangular tiling, use a 'triSide' value for the side length.
For hexagonal tiling, use a 'hexSize' value representing the distance from the center to a vertex.
The grid should be generated based on the canvas dimensions.

Drawing Modes:

A control to select the drawing mode: 'circles', 'lines', or 'combined'.
In 'circles' mode, draw small circles (dots) at grid points.
In 'lines' mode, connect grid points with lines.
In 'combined' mode, do both.

UI Controls in a Left‑Drawer:

Use Material‑UI’s Drawer component to create a left‑side sliding drawer.
The drawer should be toggleable via a hamburger icon (use MUI’s MenuIcon).
Inside the drawer, include controls for:
Tiling type (triangular or hexagonal) using a Select component.
Drawing mode using a Select component.
A slider for tile size (which controls either triSide or hexSize depending on the tiling type).
A slider for circle size.
A color picker for circle color.
A color picker for line color.
A button to export the drawing as a vector‑based PDF (letter size, 612 x 792 pt).
In the drawer’s footer, add text that says "© 2025. Made by Nicholas Bennett." and include icon links (using MUI icons) for:
LinkedIn (link: https://www.linkedin.com/in/nicholasrrbennett/)
GitHub project (link: https://github.com/nrrb/hex-tri-tiling)
Buy Me A Coffee (link: https://buymeacoffee.com/nrrb)

PDF Export:

Use jsPDF to generate a vector-based PDF that uses fixed American letter dimensions (612 x 792 pt).
The PDF export should generate its own grid based on those dimensions (i.e. without scaling the on‑screen canvas drawing) and “replay” the drawing commands (both lines and circles) as vector instructions.

Code Organization:

Provide a complete App.js file with the React functional component using hooks.
Also provide an App.css file with sensible default styling for a polished, mobile‑friendly UI.
Please generate the full code for both App.js and App.css."
```