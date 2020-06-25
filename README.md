# Anti Bubble App 

### Folder structure

+ **/src**: *Angular app created using ```angular/cli```.*
+ **/database**: *Contains mongoose Schemas*
+ **/server**: *Files to be used on server-side*
    * **/routes**: *Declared routes to be imported on ```index.js```*
+ **/index.js**: *File that is used to start the node server*


### Prerequisites

+ **[Node.js & npm](https://nodejs.org/en/download/)**: *Please be sure you have installed Node.js and npm module on your computer before running the application*
+ **[MongoDB](https://www.mongodb.com/download-center)**: *Download & Install MongoDB, and make sure it's running on the default port (27017).*
+ **[AngularCLI](https://cli.angular.io/)**: *Is used to build front-end application. Use [npm install -g @angular/cli] to install this*


### First time usage

+ Clone repository from https://git.science.uu.nl/breaking-bubbles/anti-bubble-app.git
    + Can be done by using the *git clone [url]* function with **[Git](https://git-scm.com/)**
+ Be sure you have started MongoDB service before running the application
+ Navigate to project folder
+ Run ```npm install``` on your folder
+ Run ```ng build``` on here to generate Angular necessary files. Output files are by default created on ```/dist``` subfolder
+ Now run ```node index.js``` This is the last step and if everything goes right, server will start listening for requests
    + You can also install **[nodemon]** (```npm install -g nodemon```) to have auto refresh when working on the backend
    + When you work on the frontend and you want auto refresh use ```npm start```
+ You can open your browser and navigate to localhost:4200 to see if application works

### Normal usage
+ Be sure you have started MongoDB
+ Navigate to project folder
+ Run ```npm start```
+ Open browser and navigate to localhost:4200


### Running test locally
+ Run ng test --code-coverage --browsers=Chrome
+ Updates automatically on save

### Branches

#### Hot Fix
+ git checkout master
+ git checkout -b hotfix_branch

** work is done commits are added to the hotfix_branch*

+ git checkout develop
+ git merge hotfix_branch
+ git checkout master
+ git merge hotfix_branch

#### Feature
+ git checkout master
+ git checkout -b develop
+ git checkout -b feature_branch

** work happens on feature branch *

+ git checkout develop
+ git merge feature_branch
+ git checkout master
+ git merge develop
+ git branch -d feature_branch

# This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)