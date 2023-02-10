import toast from "./toastMes.js";
import animTab from "./calendar.js";
import form from "./formHtml.js";
import features from "./features.js";
import "https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";

import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,
    updateProfile, updateEmail, setPersistence, browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    updateDoc,
    getDoc,
    addDoc,
    getDocs,
    onSnapshot,
    query,
    orderBy,
    limit,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-messaging.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-performance.js";
import htmls from "./html.js";

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
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
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

let signIn = false;
let inforCurrentUser = {};
let usersInApp = []
let hasUser = false;
const timeStart = document.querySelector('.time-start');
const timeEnd = document.querySelector('.time-end');
const loadingSpan = document.querySelector('.row-loading');
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
                document.querySelector('.main').innerHTML += htmls.chat
                chat()
                signIn = true;
            }
            // New sign-in will be persisted with session persistence.
        })
        .catch(() => {
        });

}
firstIn().then(() => {
    // lắng nghe database
    const unsubscribe2 = onSnapshot(collection(db, `users`), () => reRenderApp());
    const unsubscribe = onSnapshot(collection(db, `${date.getFullYear()}`), () => GetYearDate(), (e) => console.log(e));

})
async function reRenderApp() {
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
    const x = []
    const querrySnapshot = await getDocs(collection(db, "users"));
    querrySnapshot.forEach(doc => {
        x.push(doc.data());
    })
    usersInApp = [...x]
    hasUser = true;
    renderFullUser()
    handleFullUser()
}

function handleFullUser() {
    const users = document.querySelectorAll(".username-app");
    users.forEach((user, idx) => {
        user.addEventListener('click', () => {
            const modal = document.querySelector('.modal-features')
            const userClick = usersInApp[idx]
            modal.style.display = "flex";
            modal.classList.add('on')
            modal.innerHTML = `
            <div class="modal infor-user">
            <div class="modal-header" style="background-color:${userClick.color}">
            <span class="exit-feature cursor-pointer" "><i class="fa-solid fa-xmark"></i></span>
            </div>
            <h4 class="text-center  mt-2 mb-3" >Thông tin tài khoản</h4>
            <div class="wrap-content">
            <div><strong>Tên: </strong> ${userClick.name}</div>
            <div><strong>Gmail: </strong> ${userClick.email}</div>
            <div><strong>Mã giáo viên: </strong> ${userClick.mgv}</div>
            <div><strong>Liên hệ: </strong> ${userClick.phoneNumber || "Chưa có"}</div>
            <div><strong>Ảnh đại diện: </strong><img style="width:100px;height:100px" src="${userClick.avt}" alt="avt"/></div>

            </div>
            </div>
            `
            const exit = modal.querySelector('.exit-feature')
            exit.onclick = () => {
                modal.style.display = "none";
                modal.classList.remove('on')
                modal.innerHTML = ""
            }
            console.log(usersInApp[idx])
        })
    })
}
function renderFullUser() {
    const fullUserBox = document.querySelector('.all-user ul');
    const html = usersInApp.map((user, idx) => {
        return `
        <li class="pd-10 cursor-pointer feature feature-flex username-app" id="user${idx}">
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
    document.getElementById('logDataWareHouse').addEventListener('click', async () => {
        onLoadSpan()
        const docSnap = await getDoc(doc(db, `data`, `${inforCurrentUser.userID}`));
        onLoadSpan()
        dataWareHouse(docSnap.data()?.data || [])
    });
    document.getElementById('logDataAnalystics').addEventListener('click', () => { dataAnalystic() });
    document.getElementById('logCreateAccount')?.addEventListener('click', () => {
        containerForm.style.display = "flex";
        containerForm.innerHTML = form.register;
        registerForm()
    });

}
const dataAnalystic = async () => {
    console.log("Bạn đang muốn phân tích dữ liệu")
    const modal = document.querySelector('.modal-features')
    modal.style.display = "flex";
    modal.classList.add('on')
    modal.innerHTML = features.feature_chart
    const exit = modal.querySelector('.exit-feature')
    exit.onclick = () => {
        modal.style.display = "none";
        modal.classList.remove('on')
        modal.innerHTML = ""
    }
    const baseData = [
        { thang: 'Tháng 1', count: 0 },
        { thang: 'Tháng 2', count: 0 },
        { thang: 'Tháng 3', count: 0 },
        { thang: 'Tháng 4', count: 0 },
        { thang: 'Tháng 5', count: 0 },
        { thang: 'Tháng 6', count: 0 },
        { thang: 'Tháng 7', count: 0 },
        { thang: 'Tháng 8', count: 0 },
        { thang: 'Tháng 9', count: 0 },
        { thang: 'Tháng 10', count: 0 },
        { thang: 'Tháng 11', count: 0 },
        { thang: 'Tháng 12', count: 0 },
    ]
    const authorsInMonth = [new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set()];

    for (let i = 0; i < dataDate.length; i++) {
        dataDate[i].authors.forEach((x) => {

            authorsInMonth[Number(dataDate[i].id_month) - 1].add(x.author)

        })

    }
    authorsInMonth.forEach((x, idx) => {
        baseData[idx] = { ...baseData[idx], count: x.size };
    })
    Chart.defaults.global.defaultFontColor = '#021C43';
    async function renderChart() {
        const data = [...baseData];

        new Chart(
            document.getElementById('chartMain'),
            {
                type: 'line',
                data: {
                    labels: data.map(row => row.thang),
                    datasets: [
                        {
                            label: "Lượng người",
                            data: data.map(row => row.count),
                            fill: false,
                            enabled: false,
                            borderColor: '#021C43',
                            tension: 0.2,
                            pointStyle: 'circle',
                            pointRadius: 10,
                            pointHoverRadius: 15

                        }
                    ],
                },
                options: {
                    title: {
                        display: true,
                        text: `Lượng người khác nhau đăng kí theo tháng trong năm ${checkYear}`,
                        fontSize: 20
                    },

                }
            }
        );
    };
    renderChart()

}


const dataWareHouse = async (data = [], df = 1) => {

    let init = [...data || []]
    let dataUser = [...data || []];
    const modal = document.querySelector('.modal-features')
    modal.style.display = "flex";
    modal.classList.add('on')
    modal.innerHTML = features.feature_wareHouse
    const exit = modal.querySelector('.exit-feature')
    exit.onclick = () => {
        modal.style.display = "none";
        modal.classList.remove('on')
        modal.innerHTML = ""
    }
    const dataMain = document.querySelector('.data-main')
    const myData = document.getElementById("myData")
    const allData = document.getElementById("allData")
    function handleFindData(titleFind) {
        if (titleFind && data) {
            dataUser = data.filter(x => {
                return x.title.toLowerCase().includes(titleFind.toLowerCase())
            })
        }
        else {
            dataUser = [...data || []]
        }
        renderDataHouse(dataUser, dataMain)

    }
    if (df === 1) {
        myData.checked = true
    renderDataHouse(dataUser, dataMain)

    }
    if (df === 2) {
        allData.checked = true
    renderDataHouse(dataUser, dataMain,1)

    }
    const allDataList = document.querySelectorAll('.data-list')
    const deleteBtn = document.querySelectorAll('.del-list')
    let tools = document.querySelector('.tools');
    const baseTools = tools.innerHTML

    const filter = document.querySelector("#filter")
    const filterContainer = document.querySelector("#filterContainer")

   
    const reData = {
        renderMyData: () => {
            myData.addEventListener("change", (e) => {
                if (e.target.checked) {
                    onLoadSpan();
                    (async () => {
                        const docSnap = await getDoc(doc(db, `data`, `${inforCurrentUser.userID}`));
                        onLoadSpan()
                        dataWareHouse(docSnap.data()?.data || [])
                    })()

                }
            })
        },
        renderAllData: () => {
            allData.addEventListener("change", (e) => {
                if (e.target.checked) {
                    dataUser = [];
                    onLoadSpan();
                    (async () => {
                        try {
                            const querySnapshot = await getDocs(collection(db, `data`));
                            onLoadSpan();
                            querySnapshot.forEach((doc) => {

                                dataUser = [...dataUser, ...doc.data().data]

                            })
                            dataWareHouse(dataUser, 2)


                        } catch (error) {
                            console.log(error);
                        }
                    })()
                }
            })
        }
    }
    reData.renderAllData()
    reData.renderMyData()

    filter.addEventListener('change', () => {
        if (filter.value === "date") {
            filterContainer.innerHTML = `
            <form id="filterForm">
            <input type="number" name="day" placeholder="Ngày" /> 
            <input type="number" name="thang" placeholder="Tháng"/> 
            <input type="number" name="nam" placeholder="Năm"/> 
            <button type="submit" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.3201 19.07C14.3201 19.68 13.92 20.48 13.41 20.79L12.0001 21.7C10.6901 22.51 8.87006 21.6 8.87006 19.98V14.63C8.87006 13.92 8.47006 13.01 8.06006 12.51L4.22003 8.47C3.71003 7.96 3.31006 7.06001 3.31006 6.45001V4.13C3.31006 2.92 4.22008 2.01001 5.33008 2.01001H18.67C19.78 2.01001 20.6901 2.92 20.6901 4.03V6.25C20.6901 7.06 20.1801 8.07001 19.6801 8.57001" stroke="#FFF" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.07 16.52C17.8373 16.52 19.27 15.0873 19.27 13.32C19.27 11.5527 17.8373 10.12 16.07 10.12C14.3027 10.12 12.87 11.5527 12.87 13.32C12.87 15.0873 14.3027 16.52 16.07 16.52Z" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.87 17.12L18.87 16.12" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
     Filter
            </button>
            </form>
        `
        }
        if (filter.value === "name") {
            filterContainer.innerHTML = ` <input class="input-simple" id="findTitle" type="text" placeholder="Tìm kiếm theo tiêu đề">`
        }
    })
    filterContainer.addEventListener('click', (e) => {
        const target = e.target
        if (target.closest('#findTitle')) {
            const inputFind = filterContainer.querySelector("#findTitle")
            inputFind.addEventListener('input', debounce(() => handleFindData(inputFind.value), 1000))
        }
        if (target.closest("#filterForm")) {
            const filterForm = filterContainer.querySelector("#filterForm")
            filterForm.onsubmit = (e) => {
                e.preventDefault();
                const dayValue = Number(e.target[0].value) || ""
                const monthValue = Number(e.target[1].value) || ""
                const yearValue = Number(e.target[2].value) || ""
                console.log(dayValue, monthValue, yearValue)
                if (dayValue < 0 || monthValue < 0 || yearValue < 0 || dayValue > 32 || monthValue > 12) {
                    fail("Hãy nhập đúng dữ liệu")
                    return;
                }

                dataUser = init.filter(x => {
                    const arrayDate = x.date.split("-")
                    console.log(arrayDate)
                    if (dayValue === "" && monthValue === "" && yearValue === "") {
                        return true;
                    }
                    if (arrayDate[0] == dayValue && monthValue === "" && yearValue === "") {
                        return true;
                    }
                    if (arrayDate[0] == dayValue && arrayDate[1] === monthValue && yearValue === "") {
                        return true;
                    }
                    if (dayValue === "" && arrayDate[1] == monthValue && yearValue === "") {
                        return true;
                    }
                    if (dayValue === "" && arrayDate[1] == monthValue && arrayDate[2] == yearValue) {
                        return true;
                    }
                    if (dayValue === "" && monthValue === "" && arrayDate[2] == yearValue) {
                        return true;
                    }
                    if (arrayDate[0] == dayValue && monthValue === "" && arrayDate[2] == yearValue) {
                        return true;
                    }
                    if (arrayDate[0] == dayValue && arrayDate[1] == monthValue && arrayDate[2] == yearValue) {
                        return true;
                    }
                    return false;
                })

                renderDataHouse(dataUser, dataMain)

            }
        }
    })
    deleteBtn.forEach((item, i) => {
        item.addEventListener('click', () => {
            const day = dataUser[i].date.split('-')
            del(dataUser[i].idData, 0, { _thisDay: day[0], _thisMonth: day[1], _thisYear: day[2] })
                .then(() => {
                    success('Xóa thành công!');
                    if (df === 1) {
                        (async () => {
                            const docSnap = await getDoc(doc(db, `data`, `${inforCurrentUser.userID}`));
                            dataWareHouse(docSnap.data()?.data || [])
                        })()
                    }

                    if (df === 2) {
                        dataUser = [];
                        (async () => {
                            try {
                                const querySnapshot = await getDocs(collection(db, `data`));

                                querySnapshot.forEach((doc) => {

                                    dataUser = [...dataUser, ...doc.data().data]

                                })
                                dataWareHouse(dataUser, 2)


                            } catch (error) {
                                console.log(error);
                            }
                        })()
                    }
                })
                .catch((e) => {
                    fail('Xóa không thành công!')
                    console.log(e)
                })
        })
    })
    tools.addEventListener('click', (e) => {
        const target = e.target
        if (target.closest("#select")) {
            const select = tools.querySelector("#select")

            const allSelect = document.querySelectorAll('.select-list')
            select.classList.toggle('active-tool')
            if (select.classList.contains('active-tool')) {
                tools.innerHTML += `
            <div class="tool" id="delAll"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.81 2L5.19 5.63" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15.19 2L18.81 5.63" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 7.84998C2 5.99998 2.99 5.84998 4.22 5.84998H19.78C21.01 5.84998 22 5.99998 22 7.84998C22 9.99998 21.01 9.84998 19.78 9.84998H4.22C2.99 9.84998 2 9.99998 2 7.84998Z" stroke="#292D32" stroke-width="1.5"/>
          <path d="M9.76001 14V17.55" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M14.36 14V17.55" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
           <span>Xóa dữ liệu đã chọn</span> 
          </div>
          <div class="tool" id="selectAll">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.1V6.9C22 3.4 20.6 2 17.1 2H12.9C9.4 2 8 3.4 8 6.9V8H11.1C14.6 8 16 9.4 16 12.9V16H17.1C20.6 16 22 14.6 22 11.1Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 17.1V12.9C16 9.4 14.6 8 11.1 8H6.9C3.4 8 2 9.4 2 12.9V17.1C2 20.6 3.4 22 6.9 22H11.1C14.6 22 16 20.6 16 17.1Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.08008 15L8.03008 16.95L11.9201 13.05" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Chọn tất cả</span> 
          </div>
            `;
                const selectAll = document.querySelector('#selectAll');
                const deleteAll = document.querySelector('#delAll');

                deleteAll.addEventListener('click', () => {
                    (async () => {
                        for (let i = 0; i < allSelect.length; i++) {

                            if (allSelect[i].checked) {
                                const day = dataUser[i].date.split('-')
                                await del(dataUser[i].idData, 0, { _thisDay: day[0], _thisMonth: day[1], _thisYear: day[2] })
                            }
                        }
                    })()
                        .then(() => {
                            success('Xóa thành công!');
                            if (df === 1) {
                                (async () => {
                                    const docSnap = await getDoc(doc(db, `data`, `${inforCurrentUser.userID}`));
                                    dataWareHouse(docSnap.data()?.data || [])
                                })()
                            }

                            if (df === 2) {
                                dataUser = [];
                                    (async () => {
                                        try {
                                            const querySnapshot = await getDocs(collection(db, `data`));
                                      
                                            querySnapshot.forEach((doc) => {

                                                dataUser = [...dataUser, ...doc.data().data]

                                            })
                                            dataWareHouse(dataUser, 2)


                                        } catch (error) {
                                            console.log(error);
                                        }
                                    })()
                            }

                        })
                        .catch((e) => {
                            fail('Xóa không thành công!')
                            console.log(e)
                        })

                })
                selectAll.addEventListener('click', () => {
                    selectAll.classList.toggle('active-tool')

                    if (selectAll.classList.contains('active-tool')) {
                        for (let i = 0; i < allSelect.length; i++) {
                            if (!allSelect[i].checked) {
                                allDataList[i].classList.toggle('active-list')
                                allSelect[i].checked = true
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < allSelect.length; i++) {
                            if (allSelect[i].checked) {
                                allDataList[i].classList.toggle('active-list')
                                allSelect[i].checked = false
                            }
                        }
                    }

                })
                allDataList.forEach((item, idx) => {
                    item.style.cursor = 'pointer'
                    item.addEventListener('click', (e) => {
                   
                        const tg = e.target.closest('.data-list')
                        if (e.target.tagName == 'INPUT' || tg.getAttribute("data-author")!==inforCurrentUser.userID) return;
                        console.log(tg)
                        if (tg) {
                            allSelect[idx].checked = !allSelect[idx].checked
                            tg.classList.toggle('active-list')
                        }

                    })
                })

                allSelect.forEach((select, index) => {
                    if (!select.classList.contains('d-block'))
                        select.classList.add('d-block')
                    select.onclick = () => {
                        allDataList[index].classList.toggle('active-list')
                    }
                })
            }
            else {
                tools.innerHTML = baseTools
                select.classList.toggle('active-tool')
                allSelect.forEach((select) => {
                    if (select.classList.contains('d-block'))
                        select.classList.remove('d-block')
                })

            }
        }
        if (target.closest("#export")) {
            let configData=[]
            let resuilt=[]
            if(df==1){
                configData = dataUser.map((item) => {
                    return [
                        item.title,
                        item.bodyTitle,
                        item.date,
                        item.timeStart,
                        item.timeEnd,
                    ]
                })
                resuilt = [["Tiêu đề", "Mô tả", "Ngày", "Giờ bắt đầu", "Giờ kết thúc"], ...configData]
            }
            if(df==2){
                configData = dataUser.map((item) => {
                    return [
                        item.name_author,
                        item.title,
                        item.bodyTitle,
                        item.date,
                        item.timeStart,
                        item.timeEnd,
                    ]
                })
                resuilt = [["Tên người đăng kí","Tiêu đề", "Mô tả", "Ngày", "Giờ bắt đầu", "Giờ kết thúc"], ...configData]
            }


            var workbook = XLSX.utils.book_new(),
                worksheet = XLSX.utils.aoa_to_sheet(resuilt);
            XLSX.utils.book_append_sheet(workbook, worksheet, "WebCalendar")

            XLSX.writeFile(workbook, "Calendar.xlsx", { numbers: XLSX_ZAHL_PAYLOAD, compression: true });
        }
    })

}
function renderDataHouse(data = {}, element, cf = 0) {
    const html = data.map(doc => {
        return `
        <div class="data-list" id=${doc.idData} data-author=${doc.author}>
        ${inforCurrentUser.userID === doc.author ? `<input type="checkbox" class="select-list" id=${doc.idData}/>` : `<input type="checkbox" class=" none select-list" id=${doc.idData}/>`}
            <div class="del-list ${inforCurrentUser.userID === doc.author ? "":"none"}" id=${doc.idData}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.81 2L5.19 5.63" stroke="#000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.19 2L18.81 5.63" stroke="#000" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 7.84998C2 5.99998 2.99 5.84998 4.22 5.84998H19.78C21.01 5.84998 22 5.99998 22 7.84998C22 9.99998 21.01 9.84998 19.78 9.84998H4.22C2.99 9.84998 2 9.99998 2 7.84998Z" stroke="#292D32" stroke-width="1.5"/>
      <path d="M9.76001 14V17.55" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M14.36 14V17.55" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
            </div>
            ${cf === 1 ? `<div class="data-des">${doc.name_author}</div>` : ""}
            <div class="data-des">${doc.title}</div>
            <div class="data-des">${doc.timeStart}<i class="fa-solid fa-minus"></i>${doc.timeEnd}</div>
            <div class="data-des">${doc.date}</div>
     
            
        </div>
        `
    })
    element.innerHTML = html.join('')
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
        onLoadSpan()
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


                async function repair() {
                    await getAllUser()
                    accountSignIn.innerHTML = renderUser(user)
                    handleFeatures()
                    signOut()
                }
                repair()
                onLoadSpan()
                success('Sửa thông tin thành công!')
            } catch (e) {
                onLoadSpan()
                console.error("Error adding document: ", e);
                fail("Sửa thông tin thất bại")
            }
        }

    }
}



// update DateDate
async function GetYearDate(cf=1) {
    if(cf==1){
        dataDate = []
        const x = []
        const querrySnapshot = await getDocs(collection(db, `${date.getFullYear()}`));
        querrySnapshot.forEach(doc => {
            x.push(doc.data());
        })
        dataDate = [...x]
    }
    
    
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
        onLoadSpan()
        const email = loginForm.querySelector('#emailLogin').value;
        const password = loginForm.querySelector('#passLogin').value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                handleUser(user)
                // Signed in 
                onLoadSpan()
                success("Bạn đã đăng nhập tài khoản thành công.")
                document.querySelector('.modal-chat').innerHTML = htmls.chat
                chat()
                signIn = true;
                console.log(containerForm)
                setTimeout(() => {
                    preLoad()
                    containerForm.style.display = "none"
                    containerForm.innerHTML = ""
                    sessionStorage.setItem('baseUser', sessionStorage.getItem('firebase:authUser:AIzaSyCzjVkgJF4mxzUbBtNM6he0A20lvOpdg3k:[DEFAULT]'))
                }, 500)

            })
            .catch((e) => {
                onLoadSpan()
                console.log(e.code)
                if (e.code === "auth/wrong-password") {
                    fail("Sai mật khẩu! Vui lòng nhập lại")
                }
                else if (e.code === "auth/user-not-found") {
                    fail("Tài khoản không tồn tại")
                } else {
                    fail("Đăng nhập không thành công!")

                }
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
        onLoadSpan()
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
                    onLoadSpan()
                    addfile()
                }
                else {
                    photoURL = img_preview ? img_preview.src : "https://ik.imagekit.io/TLIT/avt.png?ik-sdk-version=javascript-1.4.3&updatedAt=1668321852760";
                    addDocument(photoURL, user.uid);
                    onLoadSpan()
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
                onLoadSpan()
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
            document.querySelector('.modal-chat').innerHTML = ""

            sessionStorage.removeItem('baseUser');
            accountSignIn.innerHTML = `<span  class="account-name btn btn-outline-primary btn-signIn ">Đăng nhập</span>`
            inforCurrentUser = {}
            preLoad()
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
function onLoadSpan() {
    if (loadingSpan.classList.contains('d-block')) {
        loadingSpan.classList.remove('d-block');
    }
    else {
        loadingSpan.classList.add('d-block');
    }
}

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
        onLoadSpan()
        renderRegister();
    }
    else {

        fail("Bạn phải đăng nhập để tạo")
    }

}
function generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
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
        onLoadSpan()
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
                idData: generateString(20),
                author: inforCurrentUser.userID,
                title: headerText !== '' ? headerText : 'No title',
                bodyTitle: bodyText !== '' ? bodyText : 'No Description',
                timeStart: timeStartText,
                timeEnd: timeEndText,
                capacity: Array.apply(null, Array(end - start)).map((x, idx) => (start + idx - 1)),
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
                        onLoadSpan()
                        timeStart.style.border = '2px solid red';
                        timeEnd.style.border = '2px solid red';
                        break;
                    }
                }

            }

            // nếu chưa đăng kí thì add 
            (async () => {
                if (flag) {
                    // dien pos dk true
                    if (findIndex !== -1) {
                        for (let i = start - 1; i < end - 1; i++) {
                            (dataDate[findIndex].registerTime)[i] = true;
                        }
                        await pushDay(data, dataDate[findIndex].registerTime)

                    }
                    else {
                        const registerTime = new Array(24);
                        registerTime.fill(false);
                        for (let i = start - 1; i < end - 1; i++) {
                            registerTime[i] = true;
                        }
                        await pushDay(data, registerTime)
                    }
                    document.querySelector('#title-form').value = "";
                    document.querySelector('#description-form').value = "";
                    timeStart.innerHTML = "--:-- AM"
                    timeEnd.innerHTML = "--:-- AM"
                    const calenBD = document.querySelector('.calendar-table-body')
                    if (calenBD)
                        calenBD.scrollTo(0, (start - 1) * height)

                }
                else {
                    warning();
                }

            })()

        }
    }
}



async function pushDay(data, registerTime) {
    const dayCheck = cal_days.querySelector(".active");
    const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();
    const dayIndex = dayCheck !== null ? dayCheck.dataset.index : sevenDays[date.getDay()]
    const index = sevenDays.findIndex(x => {
        return x === dayIndex;
    })
    try {
        const docSnap = await getDoc(doc(db, `data`, `${inforCurrentUser.userID}`));
        const response = docSnap.data()
        const response_data = response ? response.data : []
        const refreshData = {
            idData: data.idData,
            author: data.author,
            name_author: inforCurrentUser.name,
            timeStart: data.timeStart,
            timeEnd: data.timeEnd,
            bodyTitle: data.bodyTitle,
            title: data.title,
            color: data.color,
            date: `${day}-${date.getMonth() + 1}-${date.getFullYear()}`
        }
        response_data.push(refreshData)
        const resuilt = response_data
        const newData = { data: resuilt }
        await setDoc(doc(db, `data`, `${inforCurrentUser.userID}`), newData);
    }
    catch (e) {
        console.log(e)
    }

    let find = false;
    async function addDocument(data, idx) {
        try {
            await setDoc(doc(db, `${date.getFullYear()}`, `${data.date}-${data.id_month}-${date.getFullYear()}`), data);
            if (idx === 2) {
                dataDate.push(data);
            }
            onLoadSpan()
            success();
            preLoad();
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
    const allPopup = document.querySelectorAll('.popupTime')
    for (let i = 0; i < allPopup.length; i++) {
        allPopup[i].outerHTML = ""
    }
    //đang ở view ngày

    if (where == 1) {
        handleScroll()
        const dayCheck = cal_days.querySelector(".active");
        const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();
        const findIndex = dataDate.findIndex(x => (x.id_month == date.getMonth() + 1 && x.date == day));
        if (findIndex !== -1) {
            const arrayData = dataDate[findIndex].data;
            for (let i = 0; i < arrayData.length; i++) {
                renderPopupTime(arrayData[i]);
            }
        }
        listenRepairPopUp()

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
            if (dataDate[i].data.length > 0) {
                const dayCheck = document.querySelectorAll(`#cal__days${dataDate[i].id_month} .daysInMonth`)[dataDate[i].date - 1]

                dayCheck.style.border = "2px solid red";
            }

        }
    }
}
const repairPopUp = (id) => {
    return `
        <div id="${id}" class="repairPopUp-container">
            <div id="${id}" class="edit-container cursor-pointer repair-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div id="${id}" class="delete-container cursor-pointer repair-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.81 2L5.19 5.63" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.19 2L18.81 5.63" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 7.84998C2 5.99998 2.99 5.84998 4.22 5.84998H19.78C21.01 5.84998 22 5.99998 22 7.84998C22 9.99998 21.01 9.84998 19.78 9.84998H4.22C2.99 9.84998 2 9.99998 2 7.84998Z" stroke="#292D32" stroke-width="1.5"/>
                    <path d="M9.76001 14V17.55" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M14.36 14V17.55" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M3.5 10L4.91 18.64C5.23 20.58 6 22 8.86 22H14.89C18 22 18.46 20.64 18.82 18.76L20.5 10" stroke="#292D32" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
    `
}
function listenRepairPopUp() {
    const allRepairTools = document.querySelectorAll('.repairPopUp-container')
    allRepairTools.forEach((item) => {
        item.addEventListener('click', (e) => {
            const target = e.target
            if (target.closest('.edit-container')) {
                const element = target.closest('.edit-container')
                editPopUp(element)
            }
            if (target.closest('.delete-container')) {
                const element = target.closest('.delete-container')
                delPopUp(element)
            }
        })
    })
}

const editPopUp = async (e) => {
    const sDays = [
        'Chủ nhật',
        'Thứ hai',
        'Thứ ba',
        'Thứ tư',
        'Thứ năm',
        'Thứ sáu',
        'Thứ bảy',

    ]
    const getThu = (data) => {
        const idx = Number(data[-1])
        if (idx) {
            return sDays[idx - 1]
        }
        else {
            return sDays[0]
        }
    }
    const dayCheck = cal_days.querySelector(".active");
    const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();
    const dayIndex = dayCheck !== null ? getThu(dayCheck.dataset.index) : sDays[date.getDay()]
    onLoadSpan()


    const id_edit = e.id;
    const modal = document.querySelector('.modal-features')
    modal.style.display = "flex";
    modal.classList.add('on')
    modal.innerHTML = htmls.modalEdit
    const exit = modal.querySelector('.exit-feature')
    exit.onclick = () => {
        modal.style.display = "none";
        modal.classList.remove('on')
        modal.innerHTML = ""
    }
    document.onclick = (e) => {
        if (e.target.classList.contains('modal-features')) {
            exit.click();
        }
    }


    async function getData() {
        const docSnap1 = await getDoc(doc(db, `${date.getFullYear()}`, `${day}-${date.getMonth() + 1}-${date.getFullYear()}`));
        const docSnap2 = await getDoc(doc(db, `data`, `${inforCurrentUser.userID}`));
        return [docSnap1.data(), docSnap2.data()]
    }

    document.querySelector('.update-event .thu-ngay-thang').innerHTML = `${dayIndex}, ${day} Tháng ${date.getMonth() + 1}`
    const title = document.querySelector('.update-event #title-form');
    const timeStart = document.querySelector('.update-event .time-start');
    const timeEnd = document.querySelector('.update-event .time-end');
    const timeTable = document.querySelector('.update-event .timing-table');
    const descripion = document.querySelector('.update-event #description-form');
    const btnUpdate = document.querySelector('.update-event .btn-update');
    timeEnd.style.pointerEvents = "none";
    timeStart.style.pointerEvents = "none";
    document.addEventListener('click', () => {
        timeTable.classList.remove('d-block');
    })
    const response = await getData()
    onLoadSpan()
    const [data1, data2] = response;
    const dataList1 = data1.data
    const dataList2 = data2.data
    const findData1 = dataList1.filter(x => { return x.idData === id_edit })[0]
    const findData2 = dataList2.filter(x => { return x.idData === id_edit })[0]

    title.value = findData1.title;
    descripion.value = findData1.bodyTitle;
    timeStart.innerHTML = findData1.timeStart;
    timeEnd.innerHTML = findData1.timeEnd;

    async function pushData() {
        const newData2 = dataList2.map((item) => {
            if (item.idData === id_edit) {

                return { ...findData2, title: title.value, bodyTitle: descripion.value }
            }
            else {
                return item;
            }
        })
        const newData = dataList1.map((item) => {
            if (item.idData === id_edit) {

                return { ...findData1, title: title.value, bodyTitle: descripion.value }
            }
            else {
                return item;
            }
        })

        const resuilt = { ...data1, data: newData }
        const resuilt2 = { data: newData2 }

        await updateDoc(doc(db, `${date.getFullYear()}`, `${day}-${date.getMonth() + 1}-${date.getFullYear()}`), resuilt);
        await updateDoc(doc(db, `data`, `${inforCurrentUser.userID}`), resuilt2);

        onLoadSpan()
        preLoad()
        exit.click()

    }
    btnUpdate.onclick = (e) => {
        e.preventDefault()
        onLoadSpan()
        pushData()
            .then(() => {
                success('Sửa thành công!')
            })
            .catch((e) => {
                fail('Sửa không thành công!')
            })
    }
}



const delPopUp = (e) => {
    const id_del = e.id
    const modal = document.querySelector('.modal-features')
    modal.style.display = "flex";
    modal.classList.add('on')
    modal.innerHTML = htmls.modalDel
    const exit = modal.querySelector('.exit-feature')
    exit.onclick = () => {
        modal.style.display = "none";
        modal.classList.remove('on')
        modal.innerHTML = ""
    }
    const noBtn = document.querySelector('.choose-no')
    const yesBtn = document.querySelector('.choose-yes')
    noBtn.onclick = () => {
        exit.click()
    }
    document.onclick = (e) => {

        if (e.target.classList.contains('modal-features')) {
            exit.click()
        }
    }
    yesBtn.onclick = () => {
        const dayCheck = cal_days.querySelector(".active");
        const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();
        del(id_del, modal, { _thisDay: day, _thisYear: date.getFullYear(), _thisMonth: date.getMonth() + 1 })
            .then(() => {
                success('Xóa thành công!')
            })
            .catch((e) => {
                fail('Xóa không thành công!')
                console.log(e)
            })
    }
}

async function del(id_del, modal = 0, { _thisDay = 0, _thisMonth = 0, _thisYear = 0 }) {
    onLoadSpan()
    console.log(id_del, modal, { _thisDay, _thisMonth, _thisYear })
    async function getData() {
        const docSnap1 = await getDoc(doc(db, `${_thisYear}`, `${_thisDay}-${_thisMonth}-${_thisYear}`));
        const docSnap2 = await getDoc(doc(db, `data`, `${inforCurrentUser.userID}`));
        return [docSnap1.data(), docSnap2.data()]
    }
    async function editData() {
        const [data1, data2] = await getData()
        const [dataList1, dataList2] = [data1.data, data2.data];

        const findData = dataList1.filter(x => { return x.idData === id_del })[0]
        const capacity = [...findData?.capacity || []]
        // change mang time
        const newRegisterTime = data1.registerTime.map((x, idx) => {
            if (capacity.findIndex(x => x === idx) !== -1) {
                return !x;
            }
            else {
                return x;
            }
        })
        const newData = dataList1.filter(x => { return x.idData !== id_del })
        const newData2 = dataList2.filter(x => { return x.idData !== id_del })

        const newAuthors = [];
        newData.forEach(data => {
            newAuthors.findIndex(x => x.author === data.author) === -1 ? newAuthors.push({
                author: data.author,
                color: data.color
            }) : () => { return false; }
        })

        newData2.forEach(x => {
            if (newAuthors.forEach(item => item))
                newAuthors.push({
                    author: x.author,
                    color: x.color

                })
        })
        const resuilt = { ...data1, data: newData, registerTime: newRegisterTime, authors: newAuthors }
        const resuilt2 = { ...data2, data: newData2 }
        return [resuilt, resuilt2];

    }
    async function pushData() {
        const [data, data2] = await editData();
        await updateDoc(doc(db, `${_thisYear}`, `${_thisDay}-${_thisMonth}-${_thisYear}`), data);
        await updateDoc(doc(db, `data`, `${inforCurrentUser.userID}`), data2);

        onLoadSpan()
        if (modal) {
            modal.style.display = "none";
            modal.classList.remove('on')
            modal.innerHTML = ""
        }
    }
    await pushData()


}
// render ra popup

function renderPopupTime(data, index = -1, array = []) {

    const author = (usersInApp.filter(x => x.userID === data.author))[0].name

    if (where == 1) {
        const timeTable = document.querySelector('.time-table');

        const popupTime = `
        <div class="popupTime" id="${data.idData}" style="padding-right:90px; position: absolute; height:${data.lengthDiv}; top:${data.pos};  background-color: ${data.color};">
            <span class="headerPopupTimes">${data.title} | ${data.timeStart} <i class="fa-solid fa-minus"></i> ${data.timeEnd} | ${author} </span> 
            <div class="bodyPopupTimes">Des: ${data.bodyTitle}</div>
            ${data.author === inforCurrentUser.userID ? repairPopUp(data.idData) : ''}
        </div>
        `

        timeTable.innerHTML = popupTime + timeTable.innerHTML;
    }
    if (where == 2) {
        const timeTable = document.querySelector('.time-table');

        const popupTime = `
    
        <div class="popupTime" style=" position: absolute;height:${data.lengthDiv};width:calc(14% - 2px); top:${data.pos};left:${(index * 14)}%; background-color: ${data.color};">
            <span style="width:calc(14% - 2px)" class="headerPopupTimes">${data.title} | ${data.timeStart} <i class="fa-solid fa-minus"></i> ${data.timeEnd} | ${author} </span> 
            <div style="" class="bodyPopupTimes">Des: ${data.bodyTitle}</div>
        </div>
        `
        timeTable.innerHTML = popupTime + timeTable.innerHTML;
    }
}
let chatFetch = []
async function loadMessages() {
    chatFetch = []
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(collection(getFirestore(), 'messages'), orderBy('timestamp', 'asc'));
    const chatData = document.getElementById('chatData');
    chatData.innerHTML = "";

    const queryData = await getDocs(recentMessagesQuery)
    queryData.forEach((doc) => {

        const message = { ...doc.data(), timestamp: doc.data().timestamp?.toDate(), id: doc.id };

        chatFetch.push(message);
    })
    chatFetch.forEach(((mess, idx) => {
        if (idx - 1 >= 0) {
            if (chatFetch[idx - 1].user.userID !== mess.user.userID) {
                const htmls = `
                  <div ${inforCurrentUser.userID !== mess.user.userID ? `style="margin-top:10px"` : ""} class="${inforCurrentUser.userID === mess.user.userID ? "chat-me chat-row" : "chat-other chat-row"}"><span id="space"><strong>${dayjs(mess.timestamp).format("HH:MM")}</strong></span>
                  <div class="${inforCurrentUser.userID === mess.user.userID ? "me" : "other"}  chat-item">${inforCurrentUser.userID !== mess.user.userID ? `<div class="if-chat">${mess.user.name}</div>` : ""}${mess.text.toString()}</div>
                  ${inforCurrentUser.userID !== mess.user.userID ? `<img class="avt-chat" src="${mess.user.avt}" />` : ""}
                
                  </div></span>
                  `
                chatData.innerHTML += htmls

            }
            else {
                const htmls = `
                  <div class="${inforCurrentUser.userID === mess.user.userID ? "chat-me chat-row" : "chat-other chat-row"}"><span id="space"><strong>${dayjs(mess.timestamp).format("HH:MM")}</strong></span>
                  <div class="${inforCurrentUser.userID === mess.user.userID ? "me" : "other"}  chat-item" style="margin-left:47px">${mess.text.toString()}</div>    
                  </div>
                  `
                chatData.innerHTML += htmls
            }
        } else {
            const htmls = `
                  <div class="${inforCurrentUser.userID === mess.user.userID ? "chat-me chat-row" : "chat-other chat-row"}"><span id="space"><strong>${dayjs(mess.timestamp).format("HH:MM")}</strong></span>
                  <div class="${inforCurrentUser.userID === mess.user.userID ? "me" : "other"}  chat-item">${inforCurrentUser.userID !== mess.user.userID ? `<div class="if-chat">${mess.user.name}</div>` : ""}${mess.text.toString()}</div>
                  ${inforCurrentUser.userID !== mess.user.userID ? `<img class="avt-chat" src="${mess.user.avt}" />` : ""}
    
                  </div>
                  `
            chatData.innerHTML += htmls
        }

    }))



    // Start listening to the query.

}
const handleScroll = () => {
    const calenBD = document.querySelector('.calendar-table-body')
    if (calenBD)
        calenBD.addEventListener('wheel', findScrollDirectionOtherBrowsers, { passive: true });


    function findScrollDirectionOtherBrowsers(event) {
        var delta;
        if (event.wheelDelta) {
            delta = event.wheelDelta;
        } else {
            delta = -1 * event.deltaY;
        }
        console.log(delta);
        const btnChat = document.querySelector('.button-chat_ct')
        if (btnChat) {
            if (delta < 0) {
                btnChat.style.transform = "translateY(100px)"

            } else if (delta > 0) {
                btnChat.style.transform = "translateY(0px)"


            }
        }

    }
}
function chat() {
    const btnSend = document.getElementById('btnSend')
    const chatMain = document.getElementById('chatMain');
    const chatData = document.getElementById('chatData');
    const chatBox = document.getElementById('chatBox');

    onSnapshot(query(collection(getFirestore(), 'messages'), orderBy('timestamp', 'desc')), function (snapshot) {
        snapshot.docChanges().forEach(function (change) {

            const message = { ...change.doc.data(), timestamp: change.doc.data().timestamp?.toDate(), id: change.doc.id };
            chatFetch.push(message);
            if (inforCurrentUser.userID !== change.doc.data().user.userID) {
                let htmls = ""
                if (chatFetch.length >= 2 && chatFetch[chatFetch.length - 1].user.userID === chatFetch[chatFetch.length - 2].user.userID) {
                    htmls = `
                        <div class="chat-other chat-row"><span id="space"><strong>${dayjs(message.timestamp).format("HH:MM")}</strong>}</span>
                        <div class="other chat-item" style="margin-left:47px">${message.text.toString()}</div>    
                        </div>
                    `
                } else {
                    htmls = `
                        <div class="chat-other chat-row" style="margin-top:10px"><span id="space"><strong>${dayjs(message.timestamp).format("HH:MM")}</strong></span>
                        <div class="other  chat-item"><div class="if-chat">${message.user.name}</div>${message.text.toString()}</div>
                        <img class="avt-chat" src="${message.user.avt}" />
                        </div>
                    `
                }

                const save = Math.floor(chatMain.scrollTop)
                const base = Math.floor(chatMain.scrollHeight)
                chatData.innerHTML += htmls
                const check =
                    chatMain.offsetHeight === base - save ||
                    chatMain.offsetHeight + 1 === base - save ||
                    chatMain.offsetHeight + 2 === base - save ||
                    chatMain.offsetHeight - 1 === base - save ||
                    chatMain.offsetHeight - 2 === base - save
                if (check)
                    chatMain.scrollTo(0, chatMain.scrollHeight)



            }
        })
    });
    const handleChat = (value) => {

        const htmls = `
        <div class="chat-me chat-row"><span id="space"></span>
        <div class="me chat-item">${value.toString()}</div>
        </div>
        `
        chatData.innerHTML += htmls
        const loadCt = document.getElementById('load-ct');
        loadCt.style.display = "flex";
        (async () => {
            // Add a new message entry to the Firebase database.
            try {
                await addDoc(collection(getFirestore(), 'messages'), {
                    user: inforCurrentUser,
                    text: value.toString(),
                    timestamp: serverTimestamp(),
                });
                loadCt.style.display = "none"
            }
            catch (error) {
                console.error('Error writing new message to Firebase Database', error);
            }
        })()


        chatMain.scrollTo(0, chatMain.scrollHeight)
        chatMain.style.scrollBehavior = "smooth"

    }
    document.getElementById('collapse').addEventListener('click', () => {
        const chatContainer = document.querySelector('.chat-container')
        if (chatContainer.classList.contains('collapsed')) {
            chatContainer.classList.remove('collapsed')

        }
        else {
            chatContainer.classList.add('collapsed')
        }
    })
    const btnChat = document.querySelector('.button-chat_ct')

    document.getElementById('closeChat').addEventListener('click', () => btnChat.click())
    btnChat.addEventListener('click', async () => {
        const chatContainer = document.querySelector('.chat-container')
        if (!btnChat.classList.contains('act')) {
            chatContainer.style.display = "flex"
            btnChat.classList.add('act');
            await loadMessages()

            chatMain.scrollTo(0, chatMain.scrollHeight)

        }
        else {
            chatContainer.style.display = "none"
            btnChat.classList.remove('act')


        }

    })
    chatBox.addEventListener('keyup', (e) => {
        if (e.key === "Enter") {

            const data = chatBox.value.replace(/<[^>]+>/g, '')
            if (data === "") return
            chatBox.value = ""

            handleChat(data)
        }
        if (chatBox.value === "") {
            if (btnSend.classList.contains('act'))
                btnSend.classList.remove("act");
        }
        else {
            btnSend.classList.add("act");
        }
    })

}

prevBtn.onclick = () => {
    animTab(where);

    if (date.getFullYear() === checkYear) {
        preLoad()
    }
    else {
        GetYearDate();
        checkYear = date.getFullYear();
    }
}
nxtBtn.onclick = () => {
    animTab(where);
    if (date.getFullYear() === checkYear) {
        preLoad()
    }
    else {
        GetYearDate();
        checkYear = date.getFullYear();
    }
}
btnToday.onclick = () => {
    animTab(where);
    if (date.getFullYear() === checkYear) {
        preLoad()
    }
    else {
        GetYearDate();
        checkYear = date.getFullYear();

    }

}

cal_days.onclick = (e) => {
    if (e.target.classList.contains('daysInMonth')) {
        animTab(where);
        if (date.getFullYear() === checkYear) {
            preLoad()
        }
        else {
            GetYearDate();
            checkYear = date.getFullYear();

        }

    }
}
btnView.addEventListener('click', () => {
    view.forEach((item, idx) => {
        item.addEventListener('click', async () => {

            if (date.getFullYear() === checkYear) {
                preLoad()
            }
            else {
                await GetYearDate();
                checkYear = date.getFullYear();
            }
            if (idx == 3) {
                const months = document.querySelectorAll('.calendar__index')
                months.forEach((month, idx) => {
                    month.addEventListener('click', () => {
                        preLoad();
                    });
                })
            }
        });
    });
});

export default GetYearDate;

