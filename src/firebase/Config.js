import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage' 
import {getFirestore} from 'firebase/firestore'



const firebaseConfig = {
    apiKey: "AIzaSyC63adHVJRTghZEFJN72EmcSKqbDvMaFcw",
    authDomain: "ileri-react-redux-19d68.firebaseapp.com",
    projectId: "ileri-react-redux-19d68",
    storageBucket: "ileri-react-redux-19d68.appspot.com",
    messagingSenderId: "14294570421",
    appId: "1:14294570421:web:bd680f57280c6759b5f5fc"
  };



  const app = initializeApp(firebaseConfig);

  export const auth=getAuth(app);
  export const storage=getStorage(app);
  export const db=getFirestore(app);