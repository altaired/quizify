# Quizify
A quiz app for spotify API, With a main device connecting to the API getting
songs and such from the spotify API that it will play and display questions about. The players
will use their mobile devices (or at least a different browser to the Host otherwise it breaks :/) to answers the questions. The main game mode has a category picked before each song, then a song plays from the Spotify SDK but controlled by the API so we pick the song. A question with a answer or answers generated from the spotify API is presented and scored.

Warning, requires a Spotify Premium account to use! However it's safe to use it, authentication is done by Spotify over OAuth2. 


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Hosting
The project is hosted on firebase on the following [domain](https://quizify-pro.firebaseapp.com). To deploy the project use `firebase deploy --only hosting`. 

## TODO
* Implement saving of player avatar
* Implement Category picking for players
* Implement Guessing for players
* Fill the host display with relevant information
* Correct the players answers
* Add abbillity to add game tracks as a playlist
* Implement the Spotify service API calls in respective quiz questions
* Create a game logic/flow for the passive mode so an alternative for display component
## Done
* Implemented login flow with Spotify and Firebase
* Created services for keeping track of players and hosts state
* Initialized Playback SDK
* Created service for communicating with Spotifys WEB API
* Support for creation and joining of games
* One player joining is set to admin and can start game
* Shows 6 random categories when starting game

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

## File structure
The file structure is following the Angular Style Guide and more information about it can be found [here](https://angular.io/guide/file-structure)

### Components
| Component | Path | Description |
| --- |:---:| ---:|
| LoginComponent | [Component](./src/app/core/login) | Handles login of players and hosts by calling on the AuthServiceComponent and operates the JoinDialogComponent|
| CategoryListComponent | [Component](./src/app/host/category-list) | Shows the categories on the host display on gameState 'PICK_CATEGORY' decided by the gameflow |
| GameCreationComponent | [Component](./src/app/host/game-creation) | Creates a game with a desired game mode |
| HostDisplayComponent | [Component](./src/app/host/host-display) | Displays the hosts state and Host Components for a running games |
| WelcomeComponent | [Component](./src/app/host/welcome) | Shows game code and joined users on host on 'WELCOME' |
| PlaybackComponent | [Component](./src/app/playback) | Plays the music from the Spotify SDK |
| CategoryPickComponent | [Component](./src/app/player/category-pick) | Handles players picking a category |
| GuessOptionComponent | [Component](./src/app/player/guess-option) | Handles players picking an option (TODO) |
| GuessTextComponent | [Component](./src/app/player/guess-text) | Handles players entering a text ans (TODO) |
| JoinDialogComponent | [Component](./src/app/player/join-dialog) | Dialog for letting a player join a game |
| ReadyComponent | [Component](./src/app/player/ready) | Shown while in lobby on gamestate 'WAITING' for the players, enabling one player to start the game |
| DrawAvatarComponent | [Component](./src/app/player/ready/draw-avatar) | Lets the user draw an avatar |

### Services
| Service | Path | Description |
| --- |:---:| ---:|
| AuthService | [Component](./src/app/services/auth.service.ts) | Takes care of the authentication of users |
| GameHostService | [Component](./src/app/services/game-host.service.ts) | Handles everything regarding the hosts/the game session itself's state |
| GamePlayerService | [Component](./src/app/services/game-player.service.ts) | Handles everything regaring the players state within the game session |
| PlaybackService | [Component](./src/app/services/playback.service.ts) | Controls the spotify playback through API calls to the spotify API |
| SpotifyService | [Component](./src/app/services/spotify.service.ts) | Communicates with the Spotify API in everything that isn't playback |

### Guards
| Service | Path | Description |
| --- |:---:| ---:|
| HostGuard | [Component](./src/app/core/host.guard.ts) | Protects components only available to hosts |
| PlayerGuard | [Component](./src/app/core/player.guard.ts) | Protects components only available to players |


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
