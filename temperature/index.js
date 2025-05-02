
const textbox =document.getElementById("text");
const faren =document.getElementById("faren");
const celcius =document.getElementById("celcius");

const result =document.getElementById("result");
let temp;

function convert(){
    if(faren.checked){
        temp = Number(textbox.value);
        temp=temp*9 / 5 +32;
        result.innerHTML=temp+"°F";
    }
    else if(celcius.checked){
        temp = Number(textbox.value);
        temp=(temp-32)*(5/9);
        result.textContent=temp +"°C";
    }
    else{
        result.textContent="select a unit";
    }
}