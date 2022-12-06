import toast from "./toastMes.js";
import animTab from "./calendar.js";
import form from "./formHtml.js";
import features from "./features.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";

import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,
    updateProfile, updateEmail, setPersistence, browserSessionPersistence,
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
let inforCurrentUser = {};
let usersInApp = []
let hasUser = false;
const timeStart = document.querySelector('.time-start');
const timeEnd = document.querySelector('.time-end');

const accountSignIn = document.querySelector(".account")
const containerForm = document.querySelector(".branch-container");




// Initialize Firebase
const app = initializeApp(firebaseConfig);


// const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);

// Create a root reference
const db = getFirestore(app)
const storage = getStorage();
sessionStorage.setItem('firebase:authUser:AIzaSyCzjVkgJF4mxzUbBtNM6he0A20lvOpdg3k:[DEFAULT]', sessionStorage.getItem('baseUser'))

async function firstIn() {
    await getAllUser()

    setPersistence(auth, browserSessionPersistence)
        .then(() => {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            if (auth.currentUser) {
                handleUser(auth.currentUser)
                signIn = true;
            }
            // New sign-in will be persisted with session persistence.
        })
        .catch(() => {
        });
    
}
firstIn().then(()=>{
    // lắng nghe database
    const unsubscribe2 = onSnapshot(collection(db, `users`), ()=>reRenderApp());
    const unsubscribe = onSnapshot(collection(db, `${date.getFullYear()}`), () => GetYearDate(), (e) => console.log(e));

})
async function reRenderApp(){
    await getAllUser();
    preLoad()
}
function renderUser(user) {
    const html = `
    <img style="width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
                border:2px solid black;" 
        src="${user.photoURL}" atl="avt"/>
    <div id='accout-infor'>
        <div class='userInfor'>
            <img style="width: 100px;
                        height: 100px;
                        object-fit: cover;
                        border-radius: 50%;
                        border:2px solid black;" 
                src="${user.photoURL}" atl="avt"/>
            <div style="margin:10px 0 5px 0;font-weight:bold;font-size:20px">${user.displayName}</div>
            <div style="font-size:16px; font-weight:400px;color:var(--color-text-default)">${user.email}</div>
        </div>
        <div style='width:350px;height:1px;background-color:var(--color-text-default)'></div>

        ${inforCurrentUser.isAdmin === true ? features.feature_admin : features.feature_user}
        <button class='btn btn-outline-primary btn-signOut' style="width:80%;height:50px;font-size:18px;">Đăng xuất tài khoản</button>  
    </div>
    `
    return html
}
function handleUser(user) {
    handleUserCurrent(usersInApp, user.uid)
    accountSignIn.innerHTML = renderUser(user)
    handleFeatures()
    signOut()
}
async function getAllUser() {

    usersInApp = []
    const x=[]
    const querrySnapshot = await getDocs(collection(db, "users"));
    querrySnapshot.forEach(doc => {
        x.push(doc.data());
    })
    usersInApp=[...x]
    hasUser = true;
    renderFullUser()

}

function renderFullUser() {
    const fullUserBox = document.querySelector('.all-user ul');
    const html = usersInApp.map((user, idx) => {
        return `
        <li class="pd-10 cursor-pointer feature feature-flex username-app" class="feature" id="user${idx}">
        <div><img class="all-user_avt" src=${user.avt} alt="avt"></div>
        <span class="all-user_name">
            ${user.name}
        </span>
        </li>
        `
    })
    fullUserBox.innerHTML = html.join('');
}
const handleFeatures = () => {
    document.getElementById('logUserInfor').addEventListener('click', () => { featureInfor() });
    document.getElementById('logDataWareHouse').addEventListener('click', () => { });
    document.getElementById('logDataAnalystics').addEventListener('click', () => { });
    document.getElementById('logCreateAccount')?.addEventListener('click', () => {
        containerForm.style.display = "flex";
        containerForm.innerHTML = form.register;
        registerForm()
    });

}


const featureInfor = () => {
    const modal = document.querySelector('.modal-features')
    modal.style.display = "flex";
    modal.classList.add('on')
    modal.innerHTML = features.feature_infor
    const exit = modal.querySelector('.exit-feature')
    exit.onclick = () => {
        modal.style.display = "none";
        modal.classList.remove('on')
        modal.innerHTML = ""
    }
    document.onclick = (e) => {

        if (e.target.classList.contains('modal-features')) {
            exit.click()
        }
    }
    const formInfor = document.querySelector('#infor')
    const input = formInfor.querySelectorAll('input')

    const nameInput = formInfor.querySelector('#name')
    const idgvInput = formInfor.querySelector('#idgv')
    const emailInput = formInfor.querySelector('#email')
    const adminInput = formInfor.querySelector('#admin')
    const stdInput = formInfor.querySelector('#sdt')
    const avtview = formInfor.querySelector('#avt-preview')
    const inputImg = formInfor.querySelector('#avt-file')
    avtview.src = inforCurrentUser.avt
    nameInput.value = inforCurrentUser.name
    idgvInput.value = inforCurrentUser.mgv
    emailInput.value = inforCurrentUser.email
    adminInput.value = inforCurrentUser.isAdmin === true ? "Bạn là Admin" : "Bạn không phải là Admin"
    stdInput.value = inforCurrentUser.phoneNumber ? inforCurrentUser.phoneNumber : ""
    let photoURL
    input.forEach(x => {
        x.addEventListener('blur', () => {
            if (x.value !== '') {
                x.classList.add('used');
            }
            else {
                x.classList.remove('used')
            }
        })
        if (!x.classList.contains('used')) {
            if (x.value !== '') {
                x.classList.add('used');
            }
            else {
                x.classList.remove('used')
            }
        }

    })
    inputImg.addEventListener('change', () => {
        var reader = new FileReader();
        if (inputImg.files[0] !== undefined) {
            reader.readAsDataURL(inputImg.files[0]);
            reader.onload = function (e) {
                const image = new Image();
                image.src = e.target.result;
                image.onload = () => {
                    avtview.src = image.src
                }
            }
        }
        else {
            avtview.src = inforCurrentUser.avt
        }
    })
    formInfor.onsubmit = (e) => {
        e.preventDefault();
        const user = auth.currentUser
        if (inputImg.files[0]) {
            addfile()
        }
        else {
            photoURL = avtview.src
            repairDocument()
        }
        function addfile() {
            const picture = inputImg.files[0]
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
                        photoURL = downloadURL;
                        repairDocument()
                    });
                }
            );
        }
        async function repairDocument() {
            inforCurrentUser = { ...inforCurrentUser, mgv: idgvInput.value, phoneNumber: stdInput.value, name: nameInput.value, avt: photoURL }
            try {
                const docRef = await setDoc(doc(db, "users", `${inforCurrentUser.userID}`), inforCurrentUser);
                await updateProfile(user, {
                    displayName: nameInput.value, photoURL: photoURL,
                })
                exit.click()
                success('Sửa thông tin thành công!')
                
                async function repair() {
                    await getAllUser()
                    accountSignIn.innerHTML = renderUser(user)
                    handleFeatures()
                    signOut()
                }
                repair()
            } catch (e) {
                console.error("Error adding document: ", e);
                fail("Sửa thông tin thất bại")
            }
        }

    }
}



// update DateDate
async function GetYearDate() {
    dataDate = []
    const x = []
    const querrySnapshot = await getDocs(collection(db, `${date.getFullYear()}`));
    querrySnapshot.forEach(doc => {
        x.push(doc.data());
    })
    dataDate = [...x]
    preLoad()
}

accountSignIn.addEventListener('click', () => {
    if (signIn === false) {
        containerForm.style.display = "flex";
       
        loginForm()
    }
})

// handle user current 
function handleUserCurrent(userMap, currentUserID) {
    const userCurrentIndex = userMap.findIndex(x => x.userID === currentUserID);
    inforCurrentUser = { ...userMap[userCurrentIndex] }
    document.querySelector(':root').style.setProperty('--color-user', `${inforCurrentUser.color}`);
    colorUser = inforCurrentUser.color
}

//login------------------------------------------

function loginForm() {
    containerForm.innerHTML = form.login
    const loginForm = document.querySelector("#login");
    const input = document.querySelectorAll(".group input");
    const exitForm = document.querySelector('.exit-form');
    const eye = document.querySelector('#passEyeLogin');

    eye.addEventListener('click', () => {
        if (eye.classList.contains('show')) {
            loginForm.querySelector('#passLogin').type = "password";
            eye.classList.remove('show');
            eye.innerHTML = `
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
        else {
            loginForm.querySelector('#passLogin').type = "text";
            eye.classList.add('show');
            eye.innerHTML = `
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
                handleUser(user)
                // Signed in 
                success("Bạn đã đăng nhập tài khoản thành công.")
                signIn = true;
                setTimeout(() => {
                    containerForm.style.display = "none"
                    containerForm.innerHTML = ""
                    sessionStorage.setItem('baseUser', sessionStorage.getItem('firebase:authUser:AIzaSyCzjVkgJF4mxzUbBtNM6he0A20lvOpdg3k:[DEFAULT]'))
                }, 500)

            })
            .catch((e) => {
                fail("Đăng nhập không thành công!")
            });
    })

}



// regiser--------------------------------------------- 
function registerForm() {
    sessionStorage.setItem('baseUser', sessionStorage.getItem('firebase:authUser:AIzaSyCzjVkgJF4mxzUbBtNM6he0A20lvOpdg3k:[DEFAULT]'))
    containerForm.innerHTML = form.register
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
    const eye = document.querySelector('#passEyeRegister');
    const registerForm = document.querySelector('#register');
    eye.addEventListener('click', () => {
        if (eye.classList.contains('show')) {
            registerForm.querySelector('#passRegister').type = "password";
            eye.classList.remove('show');
            eye.innerHTML = `
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
        else {
            registerForm.querySelector('#passRegister').type = "text";
            eye.classList.add('show');
            eye.innerHTML = `
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
                    avt: img,
                    phoneNumber: "",
                    email: formEmail,
                    isAdmin: false
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


                }
                containerForm.style.display = "none";
                containerForm.innerHTML = "";

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

function signOut() {
    const account = document.querySelector('.account img');
    const accoutInfor = document.querySelector('#accout-infor');
    // đăng xuất
    const btnSignOut = document.querySelector('.btn-signOut');
    btnSignOut.addEventListener('click', () => {
        auth.signOut().then(() => {
            success('Đăng xuất thành công');
            signIn = false;
            sessionStorage.removeItem('baseUser');
            accountSignIn.innerHTML = `<span  class="account-name btn btn-outline-primary btn-signIn ">Đăng nhập</span>`
        })
            .catch(() => {
                fail('Đăng xuất thất bại! Thử lại sau')
            })
    });
    account.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!accoutInfor.classList.contains('d-flex')) {
            accoutInfor.classList.add('d-flex');
            accoutInfor.style.alignItems = "center";
            accoutInfor.style.flexDirection = "column";
            accoutInfor.style.justifyContent = "space-between";
        }
        else {
            accoutInfor.classList.remove('d-flex');
        }
    })
    accoutInfor.addEventListener('click', (e) => {
        e.stopPropagation();

    })
    document.querySelector('.main').addEventListener('click', () => {
        if (accoutInfor.classList.contains('d-flex')) {
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
                author: inforCurrentUser.userID,
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
    console.log('a')
    const allPopup = document.querySelectorAll('.popupTime')
    for (let i = 0; i < allPopup.length; i++) {
        allPopup[i].outerHTML = ""
    }
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
        for (let i = 0; i < dataDate.length; i++) {
            const dayCheck = document.querySelectorAll(`#cal__days${dataDate[i].id_month} .daysInMonth`)[dataDate[i].date - 1]
            console.log(dayCheck, dataDate[i].id_month)
            dayCheck.style.border = "2px solid red";
        }
    }
}

// render ra popup
function renderPopupTime(data, index = -1, array = []) {

    const author = (usersInApp.filter(x => x.userID === data.author))[0].name
    
    if (where == 1) {
        const timeTable = document.querySelector('.time-table');

        const popupTime = `
        <div class="popupTime" style="position: absolute; height:${data.lengthDiv}; top:${data.pos};  background-color: ${data.color};">
            <span class="headerPopupTimes">${data.title} | ${data.timeStart} <i class="fa-solid fa-minus"></i> ${data.timeEnd} | ${author} </span> 
            <div class="bodyPopupTimes">Des: ${data.bodyTitle}</div>
        </div>
        `
        timeTable.innerHTML = popupTime + timeTable.innerHTML;
    }
    if (where == 2) {
        const timeTable = document.querySelector('.time-table');

        const popupTime = `
    
        <div class="popupTime" style=" position: absolute;height:${data.lengthDiv};width:calc(14% - 2px); top:${data.pos};left:${(index * 14)}%; background-color: ${data.color};">
            <span style="width:calc(14% - 2px);" class="headerPopupTimes">${data.title} | ${data.timeStart} <i class="fa-solid fa-minus"></i> ${data.timeEnd} | ${author} </span> 
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
        preLoad()


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
            preLoad()
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