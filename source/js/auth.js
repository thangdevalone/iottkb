
const input=document.querySelectorAll(".group input");

input.forEach(x=>{
  x.addEventListener('blur',()=>{
    if(x.value!==''){
      x.classList.add('used'); 
    }
    else{
      x.classList.remove('used')
    }
  })
  
})
  
  // // Import the functions you need from the SDKs you need
  // import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
  // import {getAuth, GoogleAuthProvider,signInWithRedirect,getRedirectResult,signInWithPopup} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
  // // TODO: Add SDKs for Firebase products that you want to use
  // // https://firebase.google.com/docs/web/setup#available-libraries

  // // Your web app's Firebase configuration
  // // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // const firebaseConfig = {
  //   apiKey: "AIzaSyCzjVkgJF4mxzUbBtNM6he0A20lvOpdg3k",
  //   authDomain: "iotsoup01.firebaseapp.com",
  //   databaseURL: "https://iotsoup01-default-rtdb.firebaseio.com",
  //   projectId: "iotsoup01",
  //   storageBucket: "iotsoup01.appspot.com",
  //   messagingSenderId: "164608737270",
  //   appId: "1:164608737270:web:85c6f8bc44a860700ad1d7",
  //   measurementId: "G-MSDY7XR424"
  // };

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const provider =new GoogleAuthProvider(app);
  // const auth=getAuth(app);

  // const login=document.querySelector('#ggLogin');
  // login.addEventListener('click',(e)=>{
  //   e.preventDefault();
  //   signInWithPopup(auth, provider)
  //   .then((result) => {
  //     // This gives you a Google Access Token. You can use it to access the Google API.
  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential.accessToken;
  //     // The signed-in user info.
  //     const user = result.user;
  //     // photho =photoURL
  //     alert(user.displayName,user);
  //     // ...
  //   }).catch((error) => {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.customData.email;
  //     // The AuthCredential type that was used.
  //     const credential = GoogleAuthProvider.credentialFromError(error);
  //     // ...
  //   });
  // })
