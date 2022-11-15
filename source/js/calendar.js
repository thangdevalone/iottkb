
const prevBtn = document.querySelector('.calender-arrow-l');
const nxtBtn = document.querySelector('.calender-arrow-r');
const btnToday = document.querySelector('.btn-today');

const calTable = document.querySelector(".calendar-table")
const btnView = document.querySelector(".btn-view");
const allDates = document.querySelector('.cal__days');
const modal = document.querySelector('.modal');
const calMonth = document.querySelector('#cal__month');
const headerDate = document.querySelector('#header__date');


const nowMonth = date.getMonth();
const nowYear = date.getFullYear();

import htmls from "./html.js"
// calTable.innerHTML=htmls.day




var mappingMonth = []

function mapping(data) {
	mappingMonth = []
	const lastDay = 32 - new Date(data.getFullYear(), data.getMonth(), 32).getDate();
	const firstDay = new Date(data.getFullYear(), data.getMonth(), 1).getDate();
	var firstDayThu = new Date(data.getFullYear(), data.getMonth(), 1).getDay();
	for (var i = firstDay; i <= lastDay; i++) {

		const day = {
			day: i,
			thu: sevenDays[firstDayThu],
			month: data.getMonth() + 1,
			"year": data.getFullYear(),
			flag: ((data.getDate() == i) && (data.getMonth() == nowMonth) && (data.getFullYear() == nowYear)) ? "today" : "not-today"
		}
		mappingMonth.push(day)
		firstDayThu = (firstDayThu + 1) % 7;
	}
}
mapping(date);
//khoi tao calendar
function glassCalendar() {

	const emptyDates = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

	var htmls = ""
	let dateIndex = 0;

	for (let x = emptyDates; x > 0; x--) {

		htmls += `<span data-index="${sevenDays[dateIndex]}" class="not"></span>`;
		dateIndex++;

	}

	for (let i = 0; i < mappingMonth.length; i++) {
		dateIndex = dateIndex >= 7 ? dateIndex % 7 : dateIndex

		if (mappingMonth[i].flag === "today") {
			htmls += `<span class="daysInMonth today" data-index="${sevenDays[dateIndex]}" >${mappingMonth[i].day}</span>`;
		} else {
			htmls += `<span class="daysInMonth" data-index="${sevenDays[dateIndex]}">${mappingMonth[i].day}</span>`;
		}
		dateIndex++;

	}
	allDates.innerHTML = htmls;

}
glassCalendar()




// render display
function display(today=-1) {
	const monthIndex = date.getMonth();
	const yearNow = date.getFullYear();
	const dayCheck = allDates.querySelector(".active");
	const day = dayCheck !== null ? dayCheck.innerHTML : date.getDate();
	calMonth.innerHTML = twelveMonths[monthIndex][0].toUpperCase() + twelveMonths[monthIndex].slice(1);
	calMonth.innerHTML += `, ${yearNow}`;
	if(today===-1){
		headerDate.innerHTML = `${day} ${twelveMonths[monthIndex]}, ${yearNow} `
	}
	else{
		headerDate.innerHTML = `${date.getDate()} ${twelveMonths[monthIndex]}, ${yearNow} `
	}
}
display()


// // Added event listener to buttons for
prevBtn.addEventListener('click', () => {
	date.setMonth(date.getMonth() - 1);
	display()
	mapping(date);
	glassCalendar();
	handleNP();
	if(modal.classList.contains('d-block')){
    	handleCreate();
	}
	//animation

	
});

nxtBtn.addEventListener('click', () => {
	date.setMonth(date.getMonth() + 1);
	display()
	mapping(date);
	glassCalendar();
	handleNP();
	if(modal.classList.contains('d-block')){
    	handleCreate();
	}
});
btnToday.addEventListener('click', () => {
	const todayDate = new Date()
	date.setMonth(todayDate.getMonth());
	date.setFullYear(todayDate.getFullYear());
	date.setDate(todayDate.getDate());
	display(1)
	mapping(date);
	glassCalendar();
	whereAmI();
	if(modal.classList.contains('d-block')){
    	handleCreate();
	}
	//animation
	
})
allDates.addEventListener('click', function (e) {
	if(e.target.classList.contains('daysInMonth')){
		display();
		whereAmI();
		
		if(modal.classList.contains('d-block')){
			handleCreate();
		}
		//animation
	
		
	}
})
btnView.addEventListener('click',()=>{
	const popup = document.querySelector('.popup-container');
	popup.classList.toggle('d-none');
	handleViewTable()
}
)
function animTab(where){
	if(where==1){
		calTable.innerHTML = htmls.day;
		handleDay();
		
	}
	if(where==2){
		calTable.innerHTML = htmls.week;
		handleWeek();
		
	}
	if(where==3){
		calTable.innerHTML = htmls.month;
		handleMonth();
		
	}
	if(where==4){
		calTable.innerHTML = htmls.year;
		renderYear();
		
		// handleYear();
	}
	return false;
}
function handleViewTable(){
	const view = document.querySelectorAll(".view-list");
	view.forEach((item, index) => {
		
		item.addEventListener("click", () => {
			const popup = document.querySelector('.popup-container');
			if(!popup.classList.contains('d-none')){
				popup.classList.add('d-none')
			};
			for (let i = 0; i < view.length; i++) {
				if (view[i].classList.contains('viewing')) {
					view[i].classList.remove('viewing');
				}
			}
			where=index+1;
			animTab(where);
			item.classList.toggle('viewing')
			btnView.querySelector('span').innerHTML = item.innerHTML;

			if (index === 0) {
				
				

			}
			if (index === 1) {
				
				calTable.style.Animation='toLeft 0.25s  '

			}
			if (index === 2) {

				calTable.style.Animation='toLeft 0.25s'
				
			}
			if (index === 3) {

				const slideBarContent = document.querySelector('.slide-bar-content')
				if (!slideBarContent.classList.contains('slide-bar-close')) {
					slideBarBtn.click();
				}
				
			}
		})
	})
}
calTable.innerHTML = htmls.day
if (where == 1) {
	handleDay()
}
function renderYear() {
	const xDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

	calTable.innerHTML = `
		<h1 style="text-align:center;font-size:20px;color:black; font-weight:bold;">${xDate.getFullYear()}</h1>
		<div class="fullCalendar-table"> </div>
	`
	const fullTable = calTable.querySelector(".fullCalendar-table")
	for (let i = 1; i <= 12; i++) {
		fullTable.innerHTML += `
		<div class="calendar__index" id="calYear${i}">
								<div style="text-align:center;font-size:18px;">T${i}</div>
                                <div class="cal__weekdays" id="cal__weekdays">
                                    <span>Cn</span>
                                    <span>T2</span>
                                    <span>T3</span>
                                    <span>T4</span>
                                    <span>T5</span>
                                    <span>T6</span>
                                    <span>T7</span>
                                </div>
                                <div class="cal__days" id="cal__days${i}"></div>
                            </div>
		`
	}
	for (let i = 1; i <= 12; i++) {
		xDate.setMonth(i-1);
		mapping(xDate);
		const emptyDates = new Date(xDate.getFullYear(), xDate.getMonth(), 1).getDay();
		const cal_daysIndex = document.querySelector("#cal__days" + `${i}`)
		var htmls = ""
		let dateIndex = 0;


		for (let x = emptyDates; x > 0; x--) {

			htmls += `<span data-index="${sevenDays[dateIndex]}" class="not"></span>`;
			dateIndex++;

		}

		for (let i = 0; i < mappingMonth.length; i++) {
			dateIndex = dateIndex >= 7 ? dateIndex % 7 : dateIndex

			if (mappingMonth[i].flag === "today") {
				htmls += `<span class="daysInMonth today" data-index="${sevenDays[dateIndex]}" >${mappingMonth[i].day}</span>`;
			} else {
				htmls += `<span class="daysInMonth" data-index="${sevenDays[dateIndex]}">${mappingMonth[i].day}</span>`;
			}
			dateIndex++;

		}
		cal_daysIndex.innerHTML = htmls
	}
}
// xử lí where
function whereAmI() {
	if (where == 1) {
		handleDay()
	}
	if (where == 2) {
		handleWeek();
	}
	if (where == 3) {
		handleMonth();
	}

}
//xử lí phần  ngày active hay today
function handleAT(day, tabDay, check) {
	if (day == date.getDate() && date.getMonth() == check.getMonth() && check.getFullYear() == date.getFullYear()) {
		tabDay.classList.add("today")
		if (tabDay.classList.contains("active")) {
			tabDay.classList.remove("active")
		}
	}
	else {
		tabDay.classList.add("active")
		if (tabDay.classList.contains("today")) {
			tabDay.classList.remove("today")
		}
	}
}
// xử lí thao tác next và prev
function handleNP() {
	const dateArray = allDates.querySelectorAll('span')
	const thisDay = save ? save.innerHTML : date.getDate()
	for (let i = 0; i < dateArray.length; i++) {
		if (dateArray[i].innerHTML == thisDay) {
			dateArray[i].classList.add('active')
			save = dateArray[i]
			whereAmI()
			break;
		}
	}
}
// xử lí ngày
function handleDay() {
	const check = new Date()
	const dayCheck = allDates.querySelector(".active");
	const day = dayCheck !== null ? dayCheck.innerHTML : date.getDate();
	const dayText = dayCheck !== null ? dayCheck.dataset.index : sevenDays[date.getDay()];

	const tabThu = calTable.querySelector(".table__thu")
	const tabDay = calTable.querySelector('#table__date')
	tabDay.innerHTML = day
	tabThu.innerHTML = dayText
	handleAT(day, tabDay, check)
}
// xử lí tuần
function handleWeek() {

	const weekdays = document.querySelectorAll('.weekdays');
	const days = document.querySelectorAll('.days');

	const clear = () => {
		days.forEach(item => {
			if (item.classList.contains("active")) {
				item.classList.remove("active");
			}
			if (item.classList.contains("today")) {
				item.classList.remove("today");
			}
			item.innerHTML = "";
		})
		weekdays.forEach(item => {
			item.innerHTML = "";
		})
	}
	clear();
	const check = new Date()
	const dayCheck = allDates.querySelector(".active");
	const day = dayCheck !== null ? dayCheck.innerHTML : date.getDate();
	const dayIndex = dayCheck !== null ? dayCheck.dataset.index : sevenDays[date.getDay()]
	const index = sevenDays.findIndex(x => {
		return x === dayIndex;
	})
	days[index].innerHTML = day
	weekdays[index].innerHTML = sevenDays[index];
	handleAT(day, days[index], check)
	let dayNow = Number(day)
	const lengthMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	for (let i = index + 1; i < 7; i++) {
		if (dayNow + 1 <= lengthMonth) {
			days[i].innerHTML = ++dayNow;

			weekdays[i].innerHTML = sevenDays[i]
		}

	}
	dayNow = Number(day)
	for (let i = index - 1; i >= 0; i--) {

		if (dayNow - 1 >= 1) {
			days[i].innerHTML = --dayNow


			weekdays[i].innerHTML = sevenDays[i]
		}

	}
}
// xử lí tháng
function handleMonth() {
	const renderFullMonth = (monthData) => {
		let tableTest = document.querySelectorAll('.table-day');
		const start = sevenDays.findIndex(item => item === monthData[0].thu)
		const addRow = `
		<div class="row d-flex-table f-1-1 flex-direction-row table-day-row-6 pd-0 mg-0">
							<div class="table-day"></div>
							<div class="table-day"></div>
							<div class="table-day"></div>
							<div class="table-day"></div>
							<div class="table-day"></div>
							<div class="table-day"></div>
							<div class="table-day"></div>
						</div>
		`
		const base = `${htmls.base}`
		if (tableTest.length - start < monthData.length) {
			const dataTable = document.querySelector('.table');
			dataTable.innerHTML += addRow;
			tableTest = document.querySelectorAll('.table-day');
		}
		else {
			const dataTable = document.querySelector('.table');
			dataTable.innerHTML = base;
			tableTest = document.querySelectorAll('.table-day');
		}
		const table = tableTest
		var k = 0;
		for (let i = start; i < monthData.length + start; i++) {
			table[i].innerHTML += `<span class ="dayInNowMonth">${monthData[k++].day}</span> `;
		}
	}

	const clearMonth = () => {
		const tableTest = document.querySelectorAll('.table-day');
		tableTest.forEach(item => {
			item.innerHTML = ""
		})
	}
	clearMonth();
	mapping(date);

	renderFullMonth(mappingMonth)
	const dayInNowMonth = calTable.querySelectorAll('.dayInNowMonth');
	const lengthMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

	const start = sevenDays.findIndex(item => item === mappingMonth[0].thu)
	const calDates = allDates.querySelectorAll('.daysInMonth')
	for (let i = start; i < lengthMonth; i++) {
		if (calDates[i].classList.contains('active')) {

			dayInNowMonth[i].classList.add('active');
		}
		if (calDates[i].classList.contains('today')) {


			dayInNowMonth[i].classList.add('today');
		}
	}

}
export default animTab;