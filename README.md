# Anti Bubble App 

### Folder structure

+ **/src**: *Angular app created using ```angular/cli```.*
+ **/database**: *Contains mongoose Schemas*
+ **/server**: *Files to be used on server-side*
    * **/routes**: *Declared routes to be imported on ```index.js```*
+ **/license**: *Feel free to use. Repo comes with MIT license* 
+ **/index.js**: *File that is used to start the node server*


### Prerequisites


+ **[Node.js & npm](https://nodejs.org/en/download/)**: *Please be sure you have installed Node.js and npm module on your computer before running the application*
+ **[MongoDB](https://www.mongodb.com/download-center)**: *Download & Install MongoDB, and make sure it's running on the default port (27017).*
+ **[AngularCLI](https://cli.angular.io/)**: *Is used to build front-end application. Use [npm install @angular/cli] to install this*


### First time usage

+ Clone repository from https://git.science.uu.nl/breaking-bubbles/anti-bubble-app.git
    + Can be done by using the *git clone [url]* function with **[Git](https://git-scm.com/)**
+ Be sure you have started MongoDB service before running the application
+ Navigate to project folder 
+ Run ```ng build``` on here to generate Angular necessary files. Output files are by default created on ```/dist``` subfolder
+ Now run ```node index.js``` This is the last step and if everything goes right, server will start listening for requests
+ You can open your browser and navigate to localhost:3000 to see if application works

### Normal usage
+ Be sure you have started MongoDB
+ Navigate to project folder
+ Run ```node index.js```
+ Open browser and navigate to localhost:3000

### Running MongoDB
+ ```mongod --dbpath /System/Volumes/Data/data/db```



Template by Agon Gashi (agonxgashi)



