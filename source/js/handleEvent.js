const slideBarBtn=document.querySelector('.slide-bar');
const slideBarCol=document.querySelector('.slide-bar-content');
const calendarMonth=document.querySelector('.calendar-month');
const btnCreate=document.querySelector('.btn-create');
const btnView=document.querySelector('.btn-view');
const btnExit=document.querySelector('.exit');
const modal=document.querySelector('.modal');
const cal_days=document.querySelector('.cal__days')
let where = 1;
var save='';
const date = new Date();

const twelveMonths = [
	'tháng 1',
	'tháng 2',
	'tháng 3',
	'tháng 4',
	'tháng 5',
	'tháng 6',
	'tháng 7',
	'tháng 8',
	'tháng 9',
	'tháng 10',
	'tháng 11',
	'tháng 12',
];


const sevenDays = [
	'CN',
	'TH 2',
	'TH 3',
	'TH 4',
	'TH 5',
	'TH 6',
	'TH 7',

];

slideBarBtn.addEventListener('click', function() { 
    slideBarCol.classList.toggle('slide-bar-close');
    slideBarCol.classList.toggle('col-270');
    slideBarCol.classList.toggle('trans-05-ease-w-0');
    if(calendarMonth.classList.contains('trans-05-ease-l')){
        calendarMonth.classList.remove('trans-05-ease-l');
        calendarMonth.classList.add('trans-05-ease-r');
        btnCreate.classList.remove('trans-btn-05-ease-l');
        btnCreate.classList.add('trans-btn-05-ease-r');
      

    } else{
        calendarMonth.classList.add('trans-05-ease-l');
        calendarMonth.classList.remove('trans-05-ease-r');
        btnCreate.classList.add('trans-btn-05-ease-l');
        btnCreate.classList.remove('trans-btn-05-ease-r');
    }
})

cal_days.addEventListener('click', function(e){
    
    if(e.target.tagName==='SPAN' && e.target.innerHTML!==''){
        if(save!==e.target){
            if(save!==''){
                save.classList.remove('active')
            }
            e.target.classList.add('active')
        }
        save=e.target
    }
})

btnCreate.addEventListener('click',()=>handleCreate())


btnExit.addEventListener('click', function(){
    if(modal.classList.contains('d-block')){
        modal.classList.remove('d-block')
    }
})

var mousePosition;
var offset = [0,0];

var isDown = false;

var createModal= document.querySelector('.create-event');
document.body.appendChild(createModal);
var headerCreateModal=document.querySelector('.modal-header')
headerCreateModal.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = [
        createModal.offsetLeft - e.clientX,
        createModal.offsetTop - e.clientY
    ];
}, true);

document.addEventListener('mouseup', function() {
    isDown = false;
}, true);

document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown) {
        mousePosition = {
    
            x : event.clientX,
            y : event.clientY
    
        };
        createModal.style.left = (mousePosition.x + offset[0]) + 'px';
        createModal.style.top  = (mousePosition.y + offset[1]) + 'px';
    }
}, true);

function handleCreate(){

    if(!modal.classList.contains('d-block')){
        modal.classList.add('d-block');
        
    }
    const thuArray=[
        'Chủ nhật',
        'Thứ hai',
        'Thứ ba',
        'Thứ Tư',
        'Thứ năm',
        'Thứ sáu',
        'Thứ bảy'
    ]
    const dayCheck = cal_days.querySelector(".active");
    const day = dayCheck !== null ? dayCheck.innerHTML : date.getDate();
    const dayIndex=dayCheck !== null ? dayCheck.dataset.index : sevenDays[date.getDay()]
    const index=sevenDays.findIndex(x=>{
        return x===dayIndex;
    })
    const opT_N_T=document.querySelector('.thu-ngay-thang');
    opT_N_T.innerHTML=`${thuArray[index]}, ${day} ${twelveMonths[date.getMonth()]}`
    
    const timeStart=document.querySelector('.time-start'); 
    var inWhere=-1;
    const timeEnd=document.querySelector('.time-end');
    const timingTable=document.querySelector('.timing-table');
    timeStart.onclick=(e)=>{
        inWhere=1;
        e.stopPropagation();
        timingTable.classList.add('d-block')
    }
    timeEnd.onclick=(e)=>{
        inWhere=2;
        e.stopPropagation();
        timingTable.classList.add('d-block');
    }
    timingTable.addEventListener('click',(e)=>{   
            e.stopPropagation();
            if(e.target.tagName==='LI'){
                if(inWhere==1){
                    timeStart.innerHTML=e.target.innerHTML
                    inWhere=-1;
                }
                if(inWhere==2){
                    timeEnd.innerHTML=e.target.innerHTML
                    inWhere=-1;
                }
                timingTable.classList.remove('d-block')
            }
    })
    document.addEventListener('click',()=>{
        if(createModal.classList.contains('d-block')){
            timingTable.classList.remove('d-block');
        }
    })
    
}