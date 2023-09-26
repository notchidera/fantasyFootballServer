<h1>Fantasy Football Team Builder</h1>

---

<h2>What this project is about</h2>

**README** this app is built around Italian fantasy football, Classic mode

The server and the client are in two different repositories.

Visit this repo in order to access to the **backend code** : <a href="https://github.com/ViRuss0/fantasyFootballServer.git">https://github.com/ViRuss0/fantasyFootballServer.git</a></br>
Visit this repo in order to access to the **client code** : <a href="https://github.com/ViRuss0/fantasyFootballClient.git">https://github.com/ViRuss0/fantasyFootballClient.git</a></br>

---

<p>Are you a fantasy football addicted? Do you ever feel like you're unprepared for the fantasy football auction? You know most of the players, you have some valid options in your mind, but can't manage your budget properly? </br> Well, I've felt like several times, so I felt the need to have a support that I can use to get ready for the auction</p>

<p>Will, this alone, turn you into the champion of your league? Not exactly, but it can help you organize your thoughts and make some useful considerations</p>

<h3>What this App is</h3>
<ul>
  <li>A useful tool that you can use before your auction</li>
  <li>A way to make some team drafts, considering different scenarios</li>
  <li>A way to force you to really think about the whole players pool and what the prices will look like</li>
</ul>
<h3>What this App is not</h3>
<ul>
  <li>A tool that can be used to manage auctions</li>
  <li>A tool that tells you exactly what to do - every league is different and every player attending the league has its own preferences and biases</li>
  <li>A tool that gives you insights about the best line-ups during the championship</li>
</ul>

<h3>What you can do within the app</h3>
<ul>
  <li>Create a user</li>
  <li>Upload an XLSX file with the players pool, taken from <a href="https://www.fantacalcio.it/quotazioni-fantacalcio" target="_blank">fantacalcio.it</a> website</li>
  <li>Filter or sort the players based on their roles or attributes</li>
  <li>The app sets a price prediction for each player, based on fantacalcio.it evalutations. However, the user can set its own customized price prediction, set a "previous year price" and a "price treshold" (a price under which the user will most likely bid for that player, considering the absolute value of the player)</li>
  <li>Set a custom budget and number of human players - the price prediction will change according with the new budget, the rank (slot) of the players will change according to the number of human players (default values - Budget: 500, Players: 10)</li>
  <li>Create one or more draft teams that can help you handling your budget</li>
</ul>

---

<h2>How the project is structured</h2>

I've used a **MERN stack** for this project, using client-side rendering and client-side routing (react-router-dom), since there are just a few pages and features.
For Authentication I've used JWT tokens, passed through HttpOnly cookies.

The backend (Node + Express) exposes a few endpoints to the client:

- /api/players - Handles players CRUD operations
- /api/teams - Handles teams CRUD operations
- /api/users - Handles both user CRUD and authentication

For the forntend (React - Tailwind for CSS) I've mainly used React Context for state management - There are not a billion of components at the moment, but I'll consider moving to Redux if the app should grow in the future.

The server and the client are in two different repositories.</br>
Visit this repo in order to access to the **backend code** : <a href="https://github.com/ViRuss0/fantasyFootballServer.git">https://github.com/ViRuss0/fantasyFootballServer.git</a></br>
Visit this repo in order to access to the **client code** : <a href="https://github.com/ViRuss0/fantasyFootballClient.git">https://github.com/ViRuss0/fantasyFootballClient.git</a></br>

---

<h2>How to run the project</h2> 
<h3>Quick access</h3>

There is an **already running app**, hosted on Render (it's not superfast due to the hosting plan, but it does its job): <a href="https://fantasquadbuilder.onrender.com/" target="_blank">https://fantasquadbuilder.onrender.com/</a>.
I suggest using that App if you want to play around.

There is also a **test user that you can use** to test the app:

<ul>
<li>testuser@gmail.com</li>
<li>Pass1234!!</li>
</ul>

<h3>Dev access</h3>
In order to make it run, you should:
<ul>
  <li>get both the backend and the frontend code</li>
  <li>On the server, install nodemon (a global installation is preferred) <code>npm i nodemon -g</code></li>
<li>install Docker for your OS via the official website OR create a new MongoDB server and get the URI code for connection (I've used Atlas) in case you want full control over your dev DB or want to work in a production enviroment</li>
  <li>add a config.env in the server root folder (you can find a config_example.env file in the root folder as a template) -  it should hold the following eviroment variables:
    <ul>
      <li> DBURL (here you should put the URI code to connect the server to your DB)</li> 
      <li>PASSWORD (used to store db connection password)</li>
      <li>PORT</li>
      <li>JWT_SECRET (used to encode JWT tokens)</li>
      <li>JWT_EXPIRES_IN (set JWT token expiration date)</li>
      <li>JWT_COOKIE_EXPIRES_IN (set JWT HttOnly cookie expiration date)</li>
      <li>NODE_ENV</li>     
    </ul></li>
  <li>install all the dependencies both on the server and on the client</li>
</ul>

<h4>Running DB via Docker container</h4>

On MacOS or Linux (and some Windows users), run:

<ul>
  <li><code>npm run start:container</code> to start a new Mongo DB container - <b>In case you're having issues, the first time you might need to run <code>npm run init:container</code></b></li>
  <li><code>npm run start:dev</code> to run the server</li>
  <li><code>npm start</code> on the client</li>
</ul>

On Windows, run:

<ul>
  <li><code>npm run start:container-w</code> to start a new Mongo DB container - <b>In case you're having issues, the first time you might need to run <code>npm run init:container</code></b></li>
  <li><code>npm run start:dev-w</code> to run the server</li>
  <li><code>npm start</code> on the client</li>
</ul>

If you want to use your own DB via Atlas, run:

<ul>
  <li><code>npm run start:test</code> (or <code>npm run start:test-w</code> on Windows) on the server</li>
  <li><code>npm start</code> on the client</li>
</ul>

<h4>In production enviroment</h4>
Make sure to set your enviroment viariables on your hosting platform, if needed, and then just run:
<ul>
  <li><code>npm install</code> and<code>NODE_ENV=production node server.js</code> (or node server.js) on the server</li>
  <li><code>npm install && npm run build</code> on the client</li>
</ul>
