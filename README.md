For Buigger Project - Have each Module have its Own Package.json and Root shoud have onwn Package.json

Common Issues With NPM Scripts
Heads up! In the next video, on Windows, the npm run watch command may not start both your client and server, depending on your shell. To solve this:

You can use an NPM package like concurrently or npm-run-all instead of the & symbol in the npm run watch command.

Or if you have the bash shell installed on your machine (for example, through Git for Windows), set the default shell used by NPM to the bash shell by typing: npm config set script-shell bash in your terminal. All commands in your package.json will now run in a bash shell.

If you're having issues with the npm install command:

Try removing package-lock.json in both the server/ and client/ folders.

Try updating to a version of Node greater than 16 with an NPM version greater than 7.11. There's a bug in previous versions of NPM that prevents the --prefix parameter from working correctly.

What we're working with here is automation and specifically DevOps, which is often a dedicated role when working in a larger team of developers. It takes lots of practice and patience to get right!

"server_alternative": "npm run watch --prefix server",
"client_alternative": "npm run --prefix client",

npm install nodemon --save-dev // Only for dev dependencies
npm install jest --save-dev // Only for dev dependencies
npm install supertest --save-dev

Setting BUILD_PATH On Windows
Friendly reminder! BUILD_PATH is an environment variable, just like PORT. On Windows, with the default shell, the way we set our BUILD_PATH variable is:

set BUILD_PATH=../server/public&& react-scripts build

Rather than the bash version:

BUILD_PATH=../server/public react-scripts build

Important! Copy the set command exactly, making sure there's no space between the word public and the && symbols. If you add a space, Windows will add that space to the name of the build folder, and our front end dashboard will never load.

All good? Alright, onwards with the project!

Node Js good practice - https://github.com/goldbergyoni/nodebestpractices


Space X rest api = https://github.com/r-spacex/SpaceX-API

npm install axios - Use as Rest api client 
//Cheat sheet for Node js security

https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html