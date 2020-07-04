# Natalia Shevcun's Resume Back-End API

Welcome to **Natalia's Resume**! To test this API, simply clone it
locally from GitHub.

1) To install all the dependencies this app requires, run the following command:

`npm install`

(You may find the full list of dependencies used in `package.json` under *'dependencies'* and *'devDependencies'*)

2) The following command will start the API on a high port that you should specify locally in a `.env` file or on **default port 3000**:

`npm start`

You should create a `.env` file locally as per example (see `.env.example` attached). You may do this by removing the `.example` from the `.env.example` in your download, and change the values to the ones suitable for your environment.

3) If you would like to start the API via `Nodemon`, please run the following command:

`npm run dev`

4) To check whether your connection established successfully, go to *http://localhost:PORT* (where *PORT* is the port specified in your `.env` file; or, if none is specified, it is the default port *3000*).

There, you should see the following line: **"Congratulations! Connection established successfully."**
