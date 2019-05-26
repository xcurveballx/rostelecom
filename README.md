# rostelecom
Test task for front-end developer position with Rostelecom.

Folders&files:

- /assets: sass & js source files
- /public: compiled css&js files
- gulpfile.js: entry point to compile source files

What is used:
-------------

Node.js, npm, gulp & plugins and Promise polyfill by @lahmatiy
https://github.com/lahmatiy/es6-promise-polyfill

How to check:
-------------

1) Download this repo called "rostelecom"

2) To view the result only "/public" folder's content is needed. Place it in the root directory of your web-server and open it like http://localhost/. In case you don't have a web-server installed, just download "/public" folder, go there and then open index.html with the browser of your choice. Note, that in this case you will have to fix paths to js/css - remove "/" from resources' paths in index.html.

3) If you want to be able to edit the source code and then view the results, you need to install first Node.js and then type in "npm install" in the console to set up the package. For further details go to https://nodejs.org/en/
