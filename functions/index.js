const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const request = require('request');

const app = express();

//Since cloud functions uses Node 6, which don't seem to support async and
//await
var async = require('asyncawait/async');
var await = require('asyncawait/await');

const FIREBASE_API_KEY = 'AIzaSyDV0WYoQANoZG-ufHvnAmHVJKJ4AVunoOs';

admin.initializeApp();
const db = admin.database();

const credentials = {
  client: {
    id: '640c99b26db74e5f8184c92c5a568ed0',
    secret: functions.config().spotify.client_secret,
  },
  auth: {
    tokenHost: 'https://accounts.spotify.com',
    tokenPath: '/api/token',
    authorizePath: '/authorize'
  }
};

const oauth2 = require('simple-oauth2').create(credentials);

// Automatically allow cross-origin requests
app.use(cors({
  origin: true
}));

app.get('/redirect', (req, res) => {
  const redirectUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `${req.protocol}://${req.get('host')}/auth/spotify-callback`,
    scope: 'user-modify-playback-state user-read-currently-playing user-read-playback-state streaming',
  });
  // Redirect to Spotify's authorization page
  res.redirect(redirectUri);
});

app.get('/spotify-callback', (req, res) => {
  // Exchange the auth code for an access token.
  console.log('code', req.query.code);
  if (req.query.error) {
    console.error(req.query.error);
  }
  // Exchange the given access code for a access token from Spotify
  return oauth2.authorizationCode.getToken({
    code: req.query.code,
    redirect_uri: `${req.protocol}://${req.get('host')}/auth/spotify-callback`
  }).then(results => {
    console.log('results', results);
    // Update the token information in the database
    return updateToken(results.access_token, results.refresh_token);
  }).then(token => {
    // Send a response to the user
    return res.send(signInFirebaseTemplate(token));
  });
});

function updateToken(accessToken, refreshToken) {
  // Fetch the user profile from Spotify, to create a Firebase User
  const options = {
    url: 'https://api.spotify.com/v1/me',
    json: true,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    }
  }
  let token;
  let spotifyUser;
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return reject(error);
      }
      return resolve(body);
    })
  }).then(user => {
    console.log('Spotify User', user);
    spotifyUser = user;

    // Create a custom token based on the users id from Spotify
    return admin.auth().createCustomToken(user.id);
  }).then(customToken => {
    console.log('Created custom token ' + customToken);
    token = customToken;

    // Update the access and refresh token in the database
    return db.ref(`/users/${spotifyUser.id}`).set({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }).then(() => token)
}

function signInFirebaseTemplate(token) {
  // Returns a html template, that also authenticates the user with Firebase
  return `
    <script src="https://www.gstatic.com/firebasejs/3.6.0/firebase.js"></script>
    <script>
      var token = '${token}';
      var config = {
        apiKey: '${FIREBASE_API_KEY}'
      };
      var app = firebase.initializeApp(config);
      app.auth().signInWithCustomToken(token).then(function() {
        window.close();
      });
    </script>`;
}

// Expose Express API as a single Cloud Function:
exports.auth = functions.https.onRequest(app);
