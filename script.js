let allElem=document.querySelectorAll('.elem')
let allFUllElems =document.querySelectorAll('.fullElem')

allElem.forEach(function(elem){

    elem.addEventListener('click',function(){
        allFUllElems[elem.id].style.display='block'
    })
})