const button = document.getElementById("button");
const label1 =document.getElementById("label1");
const label2 =document.getElementById("label2");
const label3 =document.getElementById("label3");
const min =1;
const max=100;
let roll1;
let roll2;
let roll3;

button.onclick=function(){
    roll1=Math.floor(Math.random() * max) +min;
    roll2=Math.floor(Math.random() * max) +min;
    roll3=Math.floor(Math.random() * max) +min;
    label1.textContent=roll1;
    label2.textContent=roll2;
    label3.textContent=roll3;
}