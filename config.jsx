import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyCRtH_0IwCIvliyLWF8bJb1FYpJV2ev1OE",
  authDomain: "textit-365aa.firebaseapp.com",
  projectId: "textit-365aa",
  storageBucket: "textit-365aa.appspot.com",
  messagingSenderId: "165934772596",
  appId: "1:165934772596:web:da026115e4f2c5e121bc21",
  measurementId: "G-MZ0TDG3HSB"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  
  export const firebaseAuth = firebaseApp.auth();
  export const firestore = firebaseApp.firestore(); 
  
  export default firebaseApp;
