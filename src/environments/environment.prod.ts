declare const process: any;

export const environment = {
  production: true,
  firebase: {
    apiKey: process.env['FIREBASE_TOKEN'],
    authDomain: "olov-mya-pa.firebaseapp.com",
    databaseURL: "https://olov-mya-pa.firebaseio.com",
    projectId: "olov-mya-pa",
    storageBucket: "olov-mya-pa.firebasestorage.app",
    messagingSenderId: process.env['messagingSenderId'],
    appId: "1:832784592959:web:105a45beab65d4d568488a"
  },
  firebaseFunctionsBaseUrl: "https://us-central1-olov-mya-pa.cloudfunctions.net",
  
  // Add your Google Calendar ID here
  calendarId: process.env['calendarId'],
  googleClientId: process.env['googleClientId'],
  test: process.env['NODE_VERSION'] 
};