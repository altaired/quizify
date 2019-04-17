# Quizify
A quiz app for the Spotify API, With a main device connecting to the API getting
songs and such from the spotify API that it will play and display questions about. The players
will use their mobile devices (or at least a different browser to the Host otherwise the authentication will not work) to answers the questions. The main game mode has a category picked before each song, then a song plays from the Spotify SDK but controlled by the API so we pick the song. The answers will then be presented to the players, together with their responses. When the game is over the players can choose to save the played tracks as a playlist and/or continute the game. 

Warning, requires one Spotify Premium account to use! However it's safe to use it, authentication is done by Spotify over OAuth2. (Only the host need a premium subscription). 

The application is hosted on [https://quizify-pro.firebaseapp.com/](https://quizify-pro.firebaseapp.com/)


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Hosting
The project is hosted on firebase on the following [domain](https://quizify-pro.firebaseapp.com). To deploy the project use `firebase deploy --only hosting`. 

## Setup

To setup run `npm install`  to install all dependencies. Then follow the instructions for angular on how to setup the dev server below. For more information check out the [Angular CLI](https://cli.angular.io/) 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Cloud Functions

The authentication is handled using oauth on Cloud Functions.

The following config variables is required to deploy:
`auth.callback` and `spotify.client_secret`.

All functions are available [here](./functions/index.js).

## Authors
* Simon Persson, simon@akep.se, siper@kth.se
* Oskar Norinder, Oskar.Norinder@gmail.com, onorin@kth.se


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
