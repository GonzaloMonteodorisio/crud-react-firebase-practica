import firebase from 'firebase/app';
import 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCG1ubNBWtgasrBYMfmOhMXfbksMXxU-zk",
    authDomain: "crud-practica-react.firebaseapp.com",
    projectId: "crud-practica-react",
    storageBucket: "crud-practica-react.appspot.com",
    messagingSenderId: "647836658437",
    appId: "1:647836658437:web:2aa29b6c24919671be656c"
};
  
// Initialize Firebase con el método initializeApp de Firebase
firebase.initializeApp(firebaseConfig);

export { firebase };

