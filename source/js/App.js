import toast from "./toastMes.js";
import animTab from "./calendar.js";
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

const dataDate = []



const timeStart = document.querySelector('.time-start');
const timeEnd = document.querySelector('.time-end');



timeStart.addEventListener('click', () => {
    timeStart.style.border = 'none';
    timeEnd.style.border = 'none';

})
timeEnd.addEventListener('click', () => {
    timeEnd.style.border = 'none';
    timeStart.style.border = 'none';


})
const fail = () => {
    toast({
        title: "Thất bại!",
        message: "Bạn đã đăng ký thất bại tại IOTCALENDAR.",
        type: "error",
        duration: 2500
    });
}

const success = () => {
    toast({
        title: "Thành công!",
        message: "Bạn đã đăng ký thành công tại IOTCALENDAR.",
        type: "success",
        duration: 2500
    });
}
const warning = () => {
    toast({
        title: "Cảnh báo!",
        message: "Lịch đang kí bị trùng vui lòng kiểm tra lại.",
        type: "warning",
        duration: 2500
    });
}
const form = document.querySelector('#createTime');
form.onsubmit = (e) => {
    e.preventDefault();
    renderRegister();

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
                author: 'Thắng',
                title: headerText !== '' ? headerText : 'No title',
                bodyTitle: bodyText !== '' ? bodyText : 'No Description',
                timeStart: timeStartText,
                timeEnd: timeEndText,
                lengthDiv: length * height - 5 + 'px',
                pos: (start - 1) * height + 'px'
            }

            const dayCheck = cal_days.querySelector(".active");
            
            const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();

            // kiểm tra vị trí đó đã đăng kí chưa
            const findIndex = dataDate.findIndex(x => (x.id_month == date.getMonth() + 1 && x.date === day))
            
            if(findIndex!==-1){
                
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
                success();
                // dien pos dk true
                if(findIndex!== -1) {
                    for (let i = start - 1; i < end - 1; i++) {
                        (dataDate[findIndex].registerTime)[i] = true;
                    }
                    pushDay(data, dataDate[findIndex].registerTime)

                }
                else{
                    const registerTime=new Array(24);
                    registerTime.fill(false);
                    for (let i = start - 1; i < end - 1; i++) {
                        registerTime[i] = true;
                    }
                    pushDay(data, registerTime)
                }
                preLoad()

            }
            else {
                warning();
            }

        }
    }
}

function pushDay(data,registerTime) {
    const dayCheck = cal_days.querySelector(".active");
    const day = dayCheck !== null ? Number(dayCheck.innerHTML) : date.getDate();
    const dayIndex = dayCheck !== null ? dayCheck.dataset.index : sevenDays[date.getDay()]
    const index = sevenDays.findIndex(x => {
        return x === dayIndex;
    })
    let find = false;
    // tim kiem neu co thi push
    for (let i = 0; i < dataDate.length; i++) {
        // tim thay thang
        if (dataDate[i].id_month == date.getMonth() + 1) {
            if (dataDate[i].date == day) {
                find = true;
                dataDate[i].data.push(data);
                dataDate[i].registerTime = registerTime;
                dataDate[i].authors.findIndex(x => x===data.author)===-1?dataDate[i].authors.push(data.author):'';
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
            authors:[

            ]
        }
        dataDay.data.push(data);
        dataDay.authors.push(data.author)
        dataDate.push(dataDay);
        console.log(dataDate)
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
        const week_day=Array.from(document.querySelectorAll('.weekdays_days .days')).map(x=>Number(x.innerHTML));
        const findIndex =week_day.map(day=>dataDate.findIndex(x => (x.id_month == date.getMonth() + 1 && x.date == day)))
        findIndex.forEach((item)=>{
            if (item !== -1) {
                const arrayData = dataDate[item].data;
                for (let i = 0; i < arrayData.length; i++) {
                    renderPopupTime(arrayData[i],dataDate[item].thuIndex);
                }
            }
        }) 
    }
    // đang ở view tháng
    if (where == 3) {
        const month_day=Array.from(calTable.querySelectorAll('.table-day')).filter(x=>x.querySelector('.dayInNowMonth')===null?false:true);
        month_day.forEach(x=>x.style.cursor='pointer')
        const colorRequests=month_day.map(x=>x.querySelector('.color-request'))
        console.log(month_day,colorRequests);
        const findIndex =month_day.map(dayDom=>dataDate.findIndex(x => (x.id_month == date.getMonth() + 1 && x.date == (dayDom.querySelector('.dayInNowMonth')).innerHTML)))
        findIndex.forEach((item,index)=>{
            if (item !== -1) {
                const arrayAuthors = dataDate[item].authors;
                const percent=`${100/arrayAuthors.length}`;
                
                for(let i=0;i<arrayAuthors.length;i++){
                    console.log(index,i)
                    const colorUser=document.createElement('div');
                    colorUser.style.backgroundColor=`var(--color-user)`;
                    colorUser.style.height=`${percent}%`;            
                    colorRequests[index].appendChild(colorUser);
                 }

            }
        }) 
    }
    if (where == 4) {
       
    }
}

// render ra popup
function renderPopupTime(data,index=-1,array=[]) {
    if(where==1){
        const timeTable = document.querySelector('.time-table');

        const popupTime = `
        <div class="popupTime" style="position: absolute; height:${data.lengthDiv}; top:${data.pos};">
            <span class="headerPopupTimes">${data.title} | ${data.timeStart} <i class="fa-solid fa-minus"></i> ${data.timeEnd} | ${data.author} </span> 
            <div class="bodyPopupTimes">Des: ${data.bodyTitle}</div>
        </div>
        `
        timeTable.innerHTML = popupTime + timeTable.innerHTML;
    }
    if(where==2){
        const timeTable = document.querySelector('.time-table');

        const popupTime = `
    
        <div class="popupTime" style=" position: absolute;height:${data.lengthDiv};width:calc(14% - 2px); top:${data.pos};left:${(index*14)}%">
            <span style="width:calc(14% - 2px);" class="headerPopupTimes">${data.title} | ${data.timeStart} <i class="fa-solid fa-minus"></i> ${data.timeEnd} | ${data.author} </span> 
            <div style="width: 90%;height:" class="bodyPopupTimes">Des: ${data.bodyTitle}</div>
        </div>
        `
        timeTable.innerHTML = popupTime + timeTable.innerHTML;
    }
}
prevBtn.onclick=()=>{
    animTab(where);
    preLoad()
}
nxtBtn.onclick=()=>{
    animTab(where);
    preLoad()

}
btnToday.onclick=()=>{
    animTab(where);
    preLoad()

}
cal_days.onclick=(e)=>{
    if(e.target.classList.contains('daysInMonth')){
        animTab(where);
        preLoad()

    }
    
}
btnView.addEventListener('click',()=>{
    view.forEach((item) => {
        item.addEventListener('click',() => {
            preLoad()
        });
    });
});