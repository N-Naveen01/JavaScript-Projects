const display = document.getElementById("display");

function append(input){
    display.value+=input;
}

function cleare(){
    display.value="";
}

function calculate(){
    try{
        display.value=eval(display.value);
    }
    catch{
        display.value="Error";
    }
}