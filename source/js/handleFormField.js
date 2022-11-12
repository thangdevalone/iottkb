const nextStep= document.querySelector(".nextForm");
const prevStep= document.querySelector(".prevForm");
const formField= document.querySelectorAll(".register-form fieldset");
const colorInput= document.querySelector("#colorInput");
const progresStep2= document.querySelector('#progress2')



nextStep.addEventListener("click",(e)=>{
    e.preventDefault()
    progresStep2.classList.toggle("active-li")
    formField[0].classList.toggle("d-flex");
    formField[1].classList.toggle("d-flex");
    if(!formField[1].classList.contains("trans-l-active"))
    formField[1].classList.add("trans-l-active");
    

})
prevStep.addEventListener("click",(e)=>{
    e.preventDefault()
    progresStep2.classList.toggle("active-li")

    formField[0].classList.toggle("d-flex");
    formField[1].classList.toggle("d-flex");
    if(!formField[0].classList.contains("trans-l-active"))
    formField[0].classList.add("trans-r-active");
   
})

const setColorForm = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor = "#" + randomColor;
    const maMau= "#" + randomColor;
    colorInput.value=maMau;
    document.querySelector(".form").style.borderTop=`5px solid ${maMau}`;
    document.querySelector(".form").style.borderBottom=`5px solid ${maMau}`;
}
colorInput.addEventListener('input',()=>{
    document.querySelector(".form").style.borderTop=`5px solid ${colorInput.value}`;
    document.querySelector(".form").style.borderBottom=`5px solid ${colorInput.value}`;
})