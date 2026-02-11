
function openFeatures(){
let allElems=document.querySelectorAll('.elem')
let fullElemPage =document.querySelectorAll('.fullElem')
let fullElemPageBackBtn=document.querySelectorAll('.fullElem .back')

allElems.forEach(function(elem){

    elem.addEventListener('click',function(){
        fullElemPage[elem.id].style.display='block'
    })
})

fullElemPageBackBtn.forEach(function(back){
        back.addEventListener('click',function(){
            fullElemPage[back.id].style.display='none'
        })
})

}
openFeatures();



let form=document.querySelector('.addTask form')
let taskInput=document.querySelector('.addTask form input')
let taskDetailsInput=document.querySelector('.addTask form textarea')
let taskCheckBox=document.querySelector('.addTask form #check')

var currTask=[]



var allTaskList =localStorage.getItem('allTaskList')

function renderTask(){
    let allTask=document.querySelector('.allTask')

let sum =''

currTask.forEach(function(elem){

     if (!elem.task || !elem.details) {
            return;
        }
    sum=sum+` <div class="task">
                        <h5>${elem.task}<span class=${elem.imp}>imp</span></h5>
                        <button>Mark as completed</button>
                    </div>`
})
allTask.innerHTML=sum
}
renderTask();

form.addEventListener('submit',function(e){
    e.preventDefault()
    console.log(taskInput.value);
     console.log(taskDetailsInput.value);
        console.log(taskCheckBox.checked);

         if (taskInput === "" ||taskDetailsInput === "") {
        alert("Please enter both Task and Details!");
        return;   // stops here, nothing will be added
    }
        currTask.push(
            {
             task:taskInput.value,
             details:taskDetailsInput.value,
             imp:taskCheckBox.checked
            })
            taskInput.value=''
            taskDetailsInput.value=''
            taskCheckBox.checked=false;
             renderTask()
        
})
