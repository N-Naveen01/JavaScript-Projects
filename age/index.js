

const text= document.getElementById("text");
const submit =document.getElementById("button");
const para = document.getElementById("para");
let age;

submit.onclick = function(){

    age=text.value;
    age=Number(age);
    if(age>=100){
        para.innerHTML=`Age limit exeeded`;
    }
    else if(age<18){
        para.innerHTML=`Age is lower`;
    }
    else if(age>=18){
        para.innerHTML=`Age is valid`;
    }
    else{
        para.innerHTML=`enter valid age`;
    }

}