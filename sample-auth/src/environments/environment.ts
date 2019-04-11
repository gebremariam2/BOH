export const environment = {
  production: false,
  server: 'http://localhost:3000', // path to your backend server
  firebase: { // copy from your Firebase project (from the 'Add Firebase to your web app' script block)
    apiKey: 'stingofcharacters',
    authDomain: 'your-app-name.firebaseapp.com',
    databaseURL: 'https://your-app-name.firebaseio.com',
    projectId: 'your-app-name',
    storageBucket: 'your-app-name.appspot.com',
    messagingSenderId: 'stringofdigits'
  }
};
