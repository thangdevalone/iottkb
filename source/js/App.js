import toast from "./toastMes.js";
import animTab from "./calendar.js";
import form from "./formHtml.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,
    updateProfile, updateEmail, setPersistence, browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCzjVkgJF4mxzUbBtNM6he0A20lvOpdg3k",
    authDomain: "iotsoup01.firebaseapp.com",
    databaseURL: "https://iotsoup01-default-rtdb.firebaseio.com",
    projectId: "iotsoup01",
    storageBucket: "iotsoup01.appspot.com",
    messagingSenderId: "164608737270",
    appId: "1:164608737270:web:85c6f8bc44a860700ad1d7",
    measurementId: "G-MSDY7XR424"
};

//--------------------------------------------------------------------------------

const success = (s = "Bạn đã đăng ký thành công tại IOTCALENDAR.") => {
    toast({
        title: "Thành công!",
        message: s,
        type: "success",
        duration: 2500
    });
}

const fail = (s = "Bạn đã đăng ký thất bại tại IOTCALENDAR.") => {
    toast({
        title: "Thất bại!",
        message: s,
        type: "error",
        duration: 2500
    });
}
const warning = (s = "Lịch đang kí bị trùng vui lòng kiểm tra lại.") => {
    toast({
        title: "Cảnh báo!",
        message: s,
        type: "warning",
        duration: 2500
    });
}

//-----------------------------------------------------------------------------------------------
const height = 50;
const time = [
    "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 AM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 PM",
]
const prevBtn = document.querySelector('.calender-arrow-l');
const nxtBtn = document.querySelector('.calender-arrow-r');
const btnToday = document.querySelector('.btn-today');
const view = document.querySelectorAll(".view-list");
const calTable = document.querySelector(".calendar-table")
const cal_days = document.querySelector('.cal__days')
const btnView = document.querySelector('.btn-view');
let dataDate = [];
let colorUser;
let nowYear = date.getFullYear();
let signIn = false;
let formInforCurrentUser = {};

const timeStart = document.querySelector('.time-start');
const timeEnd = document.querySelector('.time-end');







// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);
// Create a root reference
const db = getFirestore(app)
const storage = getStorage();


setPersistence(auth, browserSessionPersistence)
    .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        const user=auth.currentUser
        if(user){
            formInforCurrentUser = user;
            async function GetAllUser() {
                usersInApp = []
                const querrySnapshot = await getDocs(collection(db, "users"));
    
                querrySnapshot.forEach(doc => {
                    usersInApp.push(doc.data());
                })
                handleUserCurrent(usersInApp, user.uid)
            }
            // get all dataa user
            GetAllUser()
            // New sign-in will be persisted with session persistence.
            signIn = true;
    
            const html = `
            <img style="width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border:2px solid black;" 
                src="${user.photoURL}" atl="avt"/>
            <div id='accout-infor'>
                <div class='userInfor'>
                    <img style="width: 100px;
                                height: 100px;
                                border-radius: 50%;
                                border:2px solid black;" 
                        src="${user.photoURL}" atl="avt"/>
                    <div style="margin:10px;0;font-weight:bold;font-size:20px">${user.displayName}</div>
                    <div style="font-size:16px; font-weight:400px;color:var(--color-text-default)">${user.email}</div>
                </div>
                <div style='width:350px;height:1px;background-color:var(--color-text-default)'></div>
                <div style="width:100%">
                    <ul>
                        <li class="pd-10 cursor-pointer feature feature-flex" id="logUserInfor">
                        <div>Thông tin tài khoản</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 8H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15 12H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17 16H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8.49994 11.2899C9.49958 11.2899 10.3099 10.4796 10.3099 9.47992C10.3099 8.48029 9.49958 7.66992 8.49994 7.66992C7.50031 7.66992 6.68994 8.48029 6.68994 9.47992C6.68994 10.4796 7.50031 11.2899 8.49994 11.2899Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 16.33C11.86 14.88 10.71 13.74 9.26 13.61C8.76 13.56 8.25 13.56 7.74 13.61C6.29 13.75 5.14 14.88 5 16.33" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </div>
                        </li>
                        <li class="pd-10 cursor-pointer feature feature-flex" id="logDataWareHouse">
                        <div>Kho dữ liệu</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.02 2.83992L3.63 7.03992C2.73 7.73992 2 9.22992 2 10.3599V17.7699C2 20.0899 3.89 21.9899 6.21 21.9899H17.79C20.11 21.9899 22 20.0899 22 17.7799V10.4999C22 9.28992 21.19 7.73992 20.2 7.04992L14.02 2.71992C12.62 1.73992 10.37 1.78992 9.02 2.83992Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10.5 18H13.5C15.15 18 16.5 16.65 16.5 15V12C16.5 10.35 15.15 9 13.5 9H10.5C8.85 9 7.5 10.35 7.5 12V15C7.5 16.65 8.85 18 10.5 18Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 9V18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M7.5 13.5H16.5" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </div>
                        </li>
                        <li class="pd-10 cursor-pointer feature feature-flex" id="logDataAnalystics">
                        <div>Phân tích dữ liệu</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2V19C2 20.66 3.34 22 5 22H22" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5 17L9.59 11.64C10.35 10.76 11.7 10.7 12.52 11.53L13.47 12.48C14.29 13.3 15.64 13.25 16.4 12.37L21 7" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </div>
                        </li>
                    </ul>
                </div>
                
                <button class='btn btn-outline-primary btn-signOut' style="width:80%;height:50px;font-size:18px;">Đăng xuất tài khoản</button>  
            </div>
            `
            accountSignIn.innerHTML = html
            signOut()
    
        }
        
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });

let usersInApp = []


// update DateDate
GetYearDate()
async function GetYearDate() {
    dataDate = []
    const querrySnapshot = await getDocs(collection(db, `${date.getFullYear()}`));
    querrySnapshot.forEach(doc => {
        dataDate.push(doc.data());
    })
    preLoad()


}


const accountSignIn = document.querySelector(".account")
const containerForm = document.querySelector(".branch-container");


accountSignIn.addEventListener('click', () => {
    if (signIn === false) {
        containerForm.style.display = "flex";
        loginForm()
    }
    else {
        handleWhenSignIn();
    }
})

// handle when signIn 
function handleWhenSignIn() {

}
// handle user current 
function handleUserCurrent(userMap, currentUserID) {
    const userCurrentIndex = userMap.findIndex(x => x.userID === currentUserID);
    const colorUserCurrent = userMap[userCurrentIndex].color
    document.querySelector(':root').style.setProperty('--color-user', `${colorUserCurrent}`);
    colorUser = colorUserCurrent
}

//login------------------------------------------

function loginForm() {
    containerForm.innerHTML = form.login
    document.querySelector(".span-dk").onclick = () => registerForm();
    const loginForm = document.querySelector("#login");
    const input = document.querySelectorAll(".group input");
    const exitForm = document.querySelector('.exit-form');
    const eye=document.querySelector('#passEyeLogin')

    eye.addEventListener('click', ()=>{
        if(eye.classList.contains('show')){
            loginForm.querySelector('#passLogin').type="password";
            eye.classList.remove('show');
            eye.innerHTML=`
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.53 9.47004L9.47004 14.53C8.82004 13.88 8.42004 12.99 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C12.99 8.42004 13.88 8.82004 14.53 9.47004Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.82 5.76998C16.07 4.44998 14.07 3.72998 12 3.72998C8.46997 3.72998 5.17997 5.80998 2.88997 9.40998C1.98997 10.82 1.98997 13.19 2.88997 14.6C3.67997 15.84 4.59997 16.91 5.59997 17.77" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.42004 19.5301C9.56004 20.0101 10.77 20.2701 12 20.2701C15.53 20.2701 18.82 18.1901 21.11 14.5901C22.01 13.1801 22.01 10.8101 21.11 9.40005C20.78 8.88005 20.42 8.39005 20.05 7.93005" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.47 14.53L2 22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L14.53 9.47" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
            `
        }
        else{
            loginForm.querySelector('#passLogin').type="text";
            eye.classList.add('show');
            eye.innerHTML=`
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>            

            `
        }
    })

    exitForm.onclick = () => {
        containerForm.style.display = "none"
    }
    input.forEach(x => {
        x.addEventListener('blur', () => {
            if (x.value !== '') {
                x.classList.add('used');
            }
            else {
                x.classList.remove('used')
            }
        })
    })

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const email = loginForm.querySelector('#emailLogin').value;
        const password = loginForm.querySelector('#passLogin').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                formInforCurrentUser = user;
                async function GetAllUser() {
                    usersInApp = []
                    const querrySnapshot = await getDocs(collection(db, "users"));

                    querrySnapshot.forEach(doc => {
                        usersInApp.push(doc.data());
                    })
                    handleUserCurrent(usersInApp, user.uid)
                }
                // get all dataa user
                GetAllUser()
                // Signed in 

                success("Bạn đã đăng nhập tài khoản thành công.")
                signIn = true;

                const html = `
        <img style="width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border:2px solid black;" 
            src="${user.photoURL}" atl="avt"/>
        <div id='accout-infor'>
            <div class='userInfor'>
                <img style="width: 100px;
                            height: 100px;
                            border-radius: 50%;
                            border:2px solid black;" 
                    src="${user.photoURL}" atl="avt"/>
                <div style="margin:10px;0;font-weight:bold;font-size:20px">${user.displayName}</div>
                <div style="font-size:16px; font-weight:400px;color:var(--color-text-default)">${user.email}</div>
            </div>
            <div style='width:350px;height:1px;background-color:var(--color-text-default)'></div>
            <div style="width:100%">
                <ul>
                    <li class="pd-10 cursor-pointer feature feature-flex" id="logUserInfor">
                    <div>Thông tin tài khoản</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21H7C3 21 2 20 2 16V8C2 4 3 3 7 3H17C21 3 22 4 22 8V16C22 20 21 21 17 21Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 8H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 12H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 16H19" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.49994 11.2899C9.49958 11.2899 10.3099 10.4796 10.3099 9.47992C10.3099 8.48029 9.49958 7.66992 8.49994 7.66992C7.50031 7.66992 6.68994 8.48029 6.68994 9.47992C6.68994 10.4796 7.50031 11.2899 8.49994 11.2899Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16.33C11.86 14.88 10.71 13.74 9.26 13.61C8.76 13.56 8.25 13.56 7.74 13.61C6.29 13.75 5.14 14.88 5 16.33" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
                    </li>
                    <li class="pd-10 cursor-pointer feature feature-flex" id="logDataWareHouse">
                    <div>Kho dữ liệu</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.02 2.83992L3.63 7.03992C2.73 7.73992 2 9.22992 2 10.3599V17.7699C2 20.0899 3.89 21.9899 6.21 21.9899H17.79C20.11 21.9899 22 20.0899 22 17.7799V10.4999C22 9.28992 21.19 7.73992 20.2 7.04992L14.02 2.71992C12.62 1.73992 10.37 1.78992 9.02 2.83992Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.5 18H13.5C15.15 18 16.5 16.65 16.5 15V12C16.5 10.35 15.15 9 13.5 9H10.5C8.85 9 7.5 10.35 7.5 12V15C7.5 16.65 8.85 18 10.5 18Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 9V18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7.5 13.5H16.5" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
                    </li>
                    <li class="pd-10 cursor-pointer feature feature-flex" id="logDataAnalystics">
                    <div>Phân tích dữ liệu</div><div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2V19C2 20.66 3.34 22 5 22H22" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 17L9.59 11.64C10.35 10.76 11.7 10.7 12.52 11.53L13.47 12.48C14.29 13.3 15.64 13.25 16.4 12.37L21 7" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </div>
                    </li>
                </ul>
            </div>
            
            <button class='btn btn-outline-primary btn-signOut' style="width:80%;height:50px;font-size:18px;">Đăng xuất tài khoản</button>  
        </div>
        `
                accountSignIn.innerHTML = html
                signOut()
                setTimeout(() => {
                    containerForm.style.display = "none"
                }, 1000)

            })
            .catch((e) => {
                fail("Đăng nhập không thành công!")
            });
    })

}



// regiser--------------------------------------------- 
function registerForm() {
    containerForm.innerHTML = form.register
    document.querySelector(".span-dn").onclick = () => loginForm();
    const sourceBase = document.querySelector(".source-base");
    const sourceBaseImgs = document.querySelector(".source-base_imgs");
    const img_preview = document.querySelector('.img-preview');
    const sourceBtn = document.querySelector(".btn-img");
    const nextStep = document.querySelector(".nextForm");
    const prevStep = document.querySelector(".prevForm");
    const formField = document.querySelectorAll(".register-form fieldset");
    const colorInput = document.querySelector("#colorInput");
    const progresStep2 = document.querySelector('#progress2');
    const submitForm = document.querySelector('#btnSubRes');
    const input = document.querySelectorAll(".group input");
    const exitForm = document.querySelector('.exit-form');
    const eye=document.querySelector('#passEyeRegister')

    eye.addEventListener('click', ()=>{
        if(eye.classList.contains('show')){
            loginForm.querySelector('#passRegister').type="password";
            eye.classList.remove('show');
            eye.innerHTML=`
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.53 9.47004L9.47004 14.53C8.82004 13.88 8.42004 12.99 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C12.99 8.42004 13.88 8.82004 14.53 9.47004Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.82 5.76998C16.07 4.44998 14.07 3.72998 12 3.72998C8.46997 3.72998 5.17997 5.80998 2.88997 9.40998C1.98997 10.82 1.98997 13.19 2.88997 14.6C3.67997 15.84 4.59997 16.91 5.59997 17.77" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.42004 19.5301C9.56004 20.0101 10.77 20.2701 12 20.2701C15.53 20.2701 18.82 18.1901 21.11 14.5901C22.01 13.1801 22.01 10.8101 21.11 9.40005C20.78 8.88005 20.42 8.39005 20.05 7.93005" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.47 14.53L2 22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 2L14.53 9.47" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
        }
        else{
            loginForm.querySelector('#passRegister').type="text";
            eye.classList.add('show');
            eye.innerHTML=`
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>            

            `
        }
    })
    sourceBtn.onclick = (e) => {
        e.stopPropagation();

        if ((sourceBaseImgs.innerHTML).trim() === '') {
            let done = 0
            for (let i = 1; i <= 33; i++) {
                const idx = i <= 9 ? '0' + i : i;
                getDownloadURL(ref(storage, `imgBase/avtar${idx}.jpg`))
                    .then((url) => {
                        done++;

                        // Or inserted into an <img> element
                        if (done === 33) {
                            success(`Tải ảnh có sẵn thành công!`)

                        }
                        sourceBaseImgs.innerHTML += `<img src=${url} alt="avtbase${idx}"/>`
                    })
                    .catch((error) => {
                        // Handle any errors
                        fail(`Tải ảnh có sẵn thứ ${i}thất bại!`)
                    });
            }
        }

        if (sourceBase.classList.contains('d-block')) {
            sourceBase.classList.remove('d-block')
        }
        else {
            sourceBase.classList.add('d-block')
        }
    }
    sourceBase.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target.src) {
            img_preview.innerHTML = `<img src=${e.target.src} alt="preview"/>`
        }
    })
    const inputImg = document.querySelector('#form-avt')
    inputImg.addEventListener('change', () => {
        var reader = new FileReader();
        if (inputImg.files[0] !== undefined) {
            reader.readAsDataURL(inputImg.files[0]);
            reader.onload = function (e) {
                const image = new Image();
                image.src = e.target.result;
                image.onload = () => {
                    img_preview.innerHTML = `<img src=${image.src} alt="preview"/>`
                }
            }
        }
        else {
            img_preview.innerHTML = `No image upload`
        }

    })
    document.addEventListener('click', () => {
        if (sourceBase.classList.contains('d-block')) {
            sourceBase.classList.remove('d-block')
        }
    })



    exitForm.onclick = () => {
        containerForm.style.display = "none"
    }
    input.forEach(x => {
        x.addEventListener('blur', () => {
            if (x.value !== '') {
                x.classList.add('used');
            }
            else {
                x.classList.remove('used')
            }
        })
    })



    nextStep.addEventListener("click", (e) => {
        const formEmail = document.querySelector('#emailRegister').value;
        const formPass = document.querySelector('#passRegister').value;
        const formName = document.querySelector('#name').value;
        const formIdgv = document.querySelector('#idgv').value;
        if (formEmail && formPass.length >= 6 && formName && formIdgv) {
            // next step
            e.preventDefault()
            progresStep2.classList.toggle("active-li")
            formField[0].classList.toggle("d-flex");
            formField[1].classList.toggle("d-flex");
            if (!formField[1].classList.contains("trans-l-active"))
                formField[1].classList.add("trans-l-active");
        }
    })


    prevStep.addEventListener("click", (e) => {
        e.preventDefault()
        progresStep2.classList.toggle("active-li")
        formField[0].classList.toggle("d-flex");
        formField[1].classList.toggle("d-flex");
        if (!formField[0].classList.contains("trans-l-active"))
            formField[0].classList.add("trans-r-active");

    })
    const setColorForm = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const maMau = "#" + randomColor;
        colorInput.value = maMau;
        document.querySelector(".form").style.borderTop = `10px solid ${colorInput.value}`;
        document.querySelector(".form").style.borderBottom = `10px solid ${colorInput.value}`;
    }
    setColorForm()
    document.querySelector(".btn-random").onclick = () => setColorForm();
    colorInput.addEventListener('input', () => {
        document.querySelector(".form").style.borderTop = `10px solid ${colorInput.value}`;
        document.querySelector(".form").style.borderBottom = `10px solid ${colorInput.value}`;
    })

    // submit
    submitForm.addEventListener('click', (e) => {
        const formEmail = document.querySelector('#emailRegister').value;
        const formPass = document.querySelector('#passRegister').value;
        const formName = document.querySelector('#name').value;
        const formIdgv = document.querySelector('#idgv').value;
        const picture = document.querySelector('#form-avt').files[0];
        const img_preview = document.querySelector('.img-preview img');
        const colorPicker = document.querySelector('#colorInput').value;
        let photoURL = "";
        e.preventDefault();
        async function addDocument(img, userID) {
            try {
                const docRef = await setDoc(doc(db, "users", `${userID}`), {
                    userID: userID,
                    name: formName,
                    mgv: formIdgv,
                    color: colorPicker,
                    avt: img
                });

            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        createUserWithEmailAndPassword(auth, formEmail, formPass)
            .then((userCredential) => {
                const user = userCredential.user;
                // create data base

                if (picture) {
                    addfile()
                }
                else {
                    photoURL = img_preview ? img_preview.src : "https://ik.imagekit.io/TLIT/avt.png?ik-sdk-version=javascript-1.4.3&updatedAt=1668321852760";
                    addDocument(photoURL, user.uid);
                    success("Bạn đã đăng ký tài khoản thành công.")
                    updateThongTin()
                }
                function addfile() {
                    const storageRef = ref(storage, 'users/' + user.uid + '/profile.' + picture.type.slice((picture.type).indexOf('/') + 1));
                    const metadata = {
                        contentType: picture.type,
                    };
                    // 'file' comes from the Blob or File API
                    const uploadTask = uploadBytesResumable(storageRef, picture, metadata);

                    // Listen for state changes, errors, and completion of the upload.
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded


                            switch (snapshot.state) {
                                case 'paused':
                                    warning('Upload is paused!')
                                    break;
                            }
                        },
                        (error) => {
                            // A full list of error codes is available at
                            switch (error.code) {
                                case 'storage/unauthorized':
                                    // User doesn't have permission to access the object
                                    warning('Upload is unauthorized!')

                                    break;
                                case 'storage/canceled':
                                    // User canceled the upload
                                    warning('Upload is canceled!')

                                    break;

                                // ...

                                case 'storage/unknown':
                                    // Unknown error occurred, inspect error.serverResponse
                                    warning('Upload is unknown!')

                                    break;
                            }
                        },
                        () => {
                            // Upload completed successfully, now we can get the download URL
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                addDocument(downloadURL, user.uid);
                                photoURL = downloadURL;
                                success("Bạn đã đăng ký tài khoản thành công.")
                                updateThongTin()
                            });
                        }
                    );
                }
                function updateThongTin() {
                    updateProfile(auth.currentUser, {
                        displayName: formName, photoURL: photoURL,
                    }).then(() => {
                        // Profile updated!
                        success("Update thông tin thành công.")

                        // ...
                    }).catch((e) => {
                        // An error occurred
                        fail("Update thông tin thất bại.")

                        // ...
                    });


                    updateEmail(auth.currentUser, formEmail).then(() => {
                        // Email updated!
                        success("Update email thành công.")
                        // ...
                    }).catch((error) => {
                        // An error occurred
                        fail("Update email thất bại.")


                        // ...
                    });
                    containerForm.innerHTML = form.login
                    loginForm()
                }

            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === "auth/email-already-in-use")
                    fail("Gmail đã được đăng kí trước đó.")
                // ..
            });

    })
}

//sign out

function signOut(){
    const account= document.querySelector('.account img');
    const accoutInfor=document.querySelector('#accout-infor');
    const btnSignOut=document.querySelector('.btn-signOut');
    // đăng xuất
    btnSignOut.addEventListener('click', () =>{
        auth.signOut().then(()=>{
            success('Đăng xuất thành công');
            signIn=false;
            accountSignIn.innerHTML=`<span  class="account-name btn btn-outline-primary btn-signIn ">Đăng nhập</span>`
        })
        .catch(()=>{
            fail('Đăng xuất thất bại! Thử lại sau')
        })
    });
    account.addEventListener('click' ,(e) =>{
        e.stopPropagation();
        if(!accoutInfor.classList.contains('d-flex')){
            accoutInfor.classList.add('d-flex');
            accoutInfor.style.alignItems="center";
            accoutInfor.style.flexDirection="column";
            accoutInfor.style.justifyContent="space-between";
        }
        else{
            accoutInfor.classList.remove('d-flex');
        }
    })
    accoutInfor.addEventListener('click', (e) =>{
        e.stopPropagation();
        
    })
    document.addEventListener('click' ,() =>{
        if(accoutInfor.classList.contains('d-flex')){
            accoutInfor.classList.remove('d-flex');
        }
    })
}

//--------------------------------------------------------------------------------
//------------------------------------------------------------------------------


timeStart.addEventListener('click', () => {
    timeStart.style.border = 'none';
    timeEnd.style.border = 'none';

})
timeEnd.addEventListener('click', () => {
    timeEnd.style.border = 'none';
    timeStart.style.border = 'none';


})

const formCreate = document.querySelector('#createTime');
formCreate.onsubmit = (e) => {
    e.preventDefault();
    if (signIn === true) {
        renderRegister();
    }
    else {
        fail("Bạn phải đăng nhập để tạo")
    }

}

function renderRegister() {
    const headerText = document.querySelector('#title-form').value;
    const bodyText = document.querySelector('#description-form').value;
    let timeStartText = timeStart.innerHTML;
    let timeEndText = timeEnd.innerHTML;
    // validate FormData
    let start = time.indexOf(timeStartText) + 1;
    let end = time.indexOf(timeEndText) + 1;
    let flag = true;
    if (timeStartText.trim() === '--:-- AM') {
        flag = false;
        timeStart.style.border = '2px solid red';
    }
    if (timeEndText.trim() === '--:-- AM') {
        flag = false;
        timeEnd.style.border = '2px solid red';
    }

    if (start == end) {
        flag = false;
        timeStart.style.border = '2px solid red';
        timeEnd.style.border = '2px solid red';
    }
    if (!flag) {
        fail();
    } else {


        // push data

        if (timeStartText.trim() !== '--:-- AM' && timeEndText.trim() !== '--:-- AM') {


            if (start > end) {
                [timeEndText, timeStartText] = [timeStartText, timeEndText];
                [start, end] = [end, start];

            }
            const length = -start + end
            // data đăng kí
            const data = {
                author: formInforCurrentUser.displayName,
                title: headerText !== '' ? headerText : 'No title',
                bodyTitle: bodyText !== '' ? bodyText : 'No Description',
                timeStart: timeStartText,
                timeEnd: timeEndText,
                lengthDiv: length * height - 5 + 'px',
                pos: (start - 1) * height + 'px',
                color: colorUser
            }

            const dayCheck = cal_days.querySelector(".active");

            const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();

            // kiểm tra vị trí đó đã đăng kí chưa
            const findIndex = dataDate.findIndex(x => (x.id_month == date.getMonth() + 1 && x.date === day))

            if (findIndex !== -1) {

            }
            // nếu tìm thấy
            if (findIndex !== -1) {
                for (let i = start - 1; i < end - 1; i++) {
                    if ((dataDate[findIndex].registerTime)[i] === true) {
                        flag = false;
                        timeStart.style.border = '2px solid red';
                        timeEnd.style.border = '2px solid red';
                        break;
                    }
                }

            }

            // nếu chưa đăng kí thì add 
            if (flag) {
                // dien pos dk true
                if (findIndex !== -1) {
                    for (let i = start - 1; i < end - 1; i++) {
                        (dataDate[findIndex].registerTime)[i] = true;
                    }
                    pushDay(data, dataDate[findIndex].registerTime)

                }
                else {
                    const registerTime = new Array(24);
                    registerTime.fill(false);
                    for (let i = start - 1; i < end - 1; i++) {
                        registerTime[i] = true;
                    }
                    pushDay(data, registerTime)
                }
            }
            else {
                warning();
            }

        }
    }
}

// lắng nghe  thay đổi database
const unsubscribe = onSnapshot(collection(db, `${date.getFullYear()}`), (snapshot) => {
    GetYearDate()
});

function pushDay(data, registerTime) {
    const dayCheck = cal_days.querySelector(".active");
    const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();
    const dayIndex = dayCheck !== null ? dayCheck.dataset.index : sevenDays[date.getDay()]
    const index = sevenDays.findIndex(x => {
        return x === dayIndex;
    })
    let find = false;

    async function addDocument(data, idx) {
        try {
            await setDoc(doc(db, `${date.getFullYear()}`, `${data.date}-${data.id_month}-${date.getFullYear()}`), data);
            if (idx === 2) {
                dataDate.push(data);
            }
            success();

            preLoad()
        }
        catch (e) {
            console.log(e)
            fail("Data not updated!")
        }
    }
    // tim kiem neu co thi push
    for (let i = 0; i < dataDate.length; i++) {
        // tim thay thang
        if (dataDate[i].id_month == date.getMonth() + 1) {
            if (dataDate[i].date == day) {
                find = true;
                dataDate[i].data.push(data);
                dataDate[i].registerTime = registerTime;
                dataDate[i].authors.findIndex(x => x.author === data.author) === -1 ? dataDate[i].authors.push({
                    author: data.author,
                    color: data.color
                }) : () => { return false; }
                addDocument(dataDate[i], 1)
                break;
            }
        }
    }
    if (!find) {


        const dataDay = {
            id_month: date.getMonth() + 1,
            date: day,
            thuIndex: index,
            data: [

            ],
            registerTime: registerTime,
            authors: []
        }
        dataDay.data.push(data);
        // ngày hôm đó chưa có thì add thêm author vào ngày đó rồi ko cần thêm nữa
        dataDay.authors.push({
            author: data.author,
            color: data.color

        })
        addDocument(dataDay, 2)
    }

}
// neu co data thi in trươc khi thao tác
function preLoad() {
    //đang ở view ngày
    if (where == 1) {
        const dayCheck = cal_days.querySelector(".active");
        const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();
        const findIndex = dataDate.findIndex(x => (x.id_month == date.getMonth() + 1 && x.date == day));
        if (findIndex !== -1) {
            const arrayData = dataDate[findIndex].data;
            for (let i = 0; i < arrayData.length; i++) {
                renderPopupTime(arrayData[i]);
            }
        }
    }
    // đang ở view tuần 
    if (where == 2) {
        const week_day = Array.from(document.querySelectorAll('.weekdays_days .days')).map(x => Number(x.innerHTML));
        const findIndex = week_day.map(day => dataDate.findIndex(x => (x.id_month == date.getMonth() + 1 && x.date == day)))
        findIndex.forEach((item) => {
            if (item !== -1) {
                const arrayData = dataDate[item].data;
                for (let i = 0; i < arrayData.length; i++) {
                    renderPopupTime(arrayData[i], dataDate[item].thuIndex);
                }
            }
        })
    }
    // đang ở view tháng
    if (where == 3) {
        const month_day = Array.from(calTable.querySelectorAll('.table-day')).filter(x => x.querySelector('.dayInNowMonth') === null ? false : true);
        month_day.forEach(x => x.style.cursor = 'pointer')
        const colorRequests = month_day.map(x => x.querySelector('.color-request'))
        const findIndex = month_day.map(dayDom => dataDate.findIndex(x => (x.id_month == date.getMonth() + 1 && x.date == (dayDom.querySelector('.dayInNowMonth')).innerHTML)))
        findIndex.forEach((item, index) => {
            if (item !== -1) {
                colorRequests[index].innerHTML = "";
                const arrayAuthors = dataDate[item].authors;
                const percent = `${100 / arrayAuthors.length}`;

                for (let i = 0; i < arrayAuthors.length; i++) {
                    const colorUserDiv = document.createElement('div');
                    colorUserDiv.style.backgroundColor = `${arrayAuthors[i].color}`;
                    colorUserDiv.style.height = `${percent}%`;
                    colorRequests[index].appendChild(colorUserDiv);
                }

            }
        })
    }
    if (where == 4) {

    }
}

// render ra popup
function renderPopupTime(data, index = -1, array = []) {
    if (where == 1) {
        const timeTable = document.querySelector('.time-table');

        const popupTime = `
        <div class="popupTime" style="position: absolute; height:${data.lengthDiv}; top:${data.pos};  background-color: ${data.color};">
            <span class="headerPopupTimes">${data.title} | ${data.timeStart} <i class="fa-solid fa-minus"></i> ${data.timeEnd} | ${data.author} </span> 
            <div class="bodyPopupTimes">Des: ${data.bodyTitle}</div>
        </div>
        `
        timeTable.innerHTML = popupTime + timeTable.innerHTML;
    }
    if (where == 2) {
        const timeTable = document.querySelector('.time-table');

        const popupTime = `
    
        <div class="popupTime" style=" position: absolute;height:${data.lengthDiv};width:calc(14% - 2px); top:${data.pos};left:${(index * 14)}%; background-color: ${data.color};">
            <span style="width:calc(14% - 2px);" class="headerPopupTimes">${data.title} | ${data.timeStart} <i class="fa-solid fa-minus"></i> ${data.timeEnd} | ${data.author} </span> 
            <div style="width: 90%;height:" class="bodyPopupTimes">Des: ${data.bodyTitle}</div>
        </div>
        `
        timeTable.innerHTML = popupTime + timeTable.innerHTML;
    }
}
prevBtn.onclick = () => {
    animTab(where);
    if (date.getFullYear() === nowYear) {
        preLoad()
    }
    else {
        GetYearDate();
        nowYear = date.getFullYear();
    }
}
nxtBtn.onclick = () => {
    animTab(where);
    preLoad()
    if (date.getFullYear() === nowYear) {
        preLoad()
    }
    else {
        GetYearDate();
        nowYear = date.getFullYear();

    }

}
btnToday.onclick = () => {
    animTab(where);
    if (date.getFullYear() === nowYear) {
        preLoad()
    }
    else {
        GetYearDate();
        nowYear = date.getFullYear();

    }

}
cal_days.onclick = (e) => {
    if (e.target.classList.contains('daysInMonth')) {
        animTab(where);
        if (date.getFullYear() === nowYear) {
            preLoad()
        }
        else {
            GetYearDate();
            nowYear = date.getFullYear();
        }

    }

}
btnView.addEventListener('click', () => {
    view.forEach((item) => {
        item.addEventListener('click', () => {
            if (date.getFullYear() === nowYear) {
                preLoad()
            }
            else {
                GetYearDate();
                nowYear = date.getFullYear();
            }
        });
    });
});