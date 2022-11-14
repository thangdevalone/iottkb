import toast from "./toastMes.js";
import animTab from "./calendar.js";
import form from "./formHtml.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,
    updateProfile, updateEmail
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs,onSnapshot } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
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
let nowYear=date.getFullYear();
let signIn = false;
let formInforCurrentUser={};

const timeStart = document.querySelector('.time-start');
const timeEnd = document.querySelector('.time-end');







// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);
// Create a root reference
const db = getFirestore(app)
const storage = getStorage();

let usersInApp = []


// update DateDate
GetYearDate()
async function GetYearDate() {
    dataDate=[]
    const querrySnapshot = await getDocs(collection(db, `${date.getFullYear()}`));
    querrySnapshot.forEach(doc => {
        dataDate.push(doc.data());
    })
    preLoad()


}


const accountName = document.querySelector(".account")
const containerForm = document.querySelector(".branch-container");
containerForm.style.display = "none";


accountName.addEventListener('click', () => {
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
    colorUser=colorUserCurrent
}

//login------------------------------------------

function loginForm() {
    containerForm.innerHTML = form.login
    document.querySelector(".span-dk").onclick = () => registerForm();
    const loginForm = document.querySelector("#login");
    const input = document.querySelectorAll(".group input");
    const exitForm = document.querySelector('.exit-form')
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
                formInforCurrentUser=user;
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
                signIn = true;
                success("Bạn đã đăng nhập tài khoản thành công.")

                const html = `
          <img style="width: 50px;
          height: 50px;
          border-radius: 50%;border:2px solid black;" src="${user.photoURL}" atl="avt"/>
        `
                accountName.innerHTML = html
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
                color:colorUser
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

    async function addDocument(data,idx) {
        try {
            await setDoc(doc(db, `${date.getFullYear()}`,`${data.date}-${data.id_month}-${date.getFullYear()}`), data);
            if(idx===2){
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
                dataDate[i].authors.findIndex(x=>x.author===data.author)===-1?dataDate[i].authors.push({
                    author:data.author,
                    color:data.color
                }):()=>{return false;}
                addDocument(dataDate[i],1)
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
            authors:[]
        }
        dataDay.data.push(data);
        // ngày hôm đó chưa có thì add thêm author vào ngày đó rồi ko cần thêm nữa
        dataDay.authors.push({
                author:data.author,
                color:data.color

            })
        addDocument(dataDay,2)
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
                colorRequests[index].innerHTML="";
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
    if(date.getFullYear()===nowYear){
        preLoad()
    }
    else{
        GetYearDate();
        nowYear==date.getFullYear();
    }
}
nxtBtn.onclick = () => {
    animTab(where);
    preLoad()
    if(date.getFullYear()===nowYear){
        preLoad()
    }
    else{
        GetYearDate();
        nowYear==date.getFullYear();

    }

}
btnToday.onclick = () => {
    animTab(where);
    if(date.getFullYear()===nowYear){
        preLoad()
    }
    else{
        GetYearDate();
        nowYear==date.getFullYear();

    }

}
cal_days.onclick = (e) => {
    if (e.target.classList.contains('daysInMonth')) {
        animTab(where);
        if(date.getFullYear()===nowYear){
            preLoad()
        }
        else{
            GetYearDate();
            nowYear==date.getFullYear();
        }

    }

}
btnView.addEventListener('click', () => {
    view.forEach((item) => {
        item.addEventListener('click', () => {
            if(date.getFullYear()===nowYear){
                preLoad()
            }
            else{
                GetYearDate();
                nowYear==date.getFullYear();
            }
        });
    });
});