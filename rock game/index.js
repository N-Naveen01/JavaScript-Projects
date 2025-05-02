

const choices =["rock", "paper", "scissors"];
const player = document.getElementById("player");
const computer = document.getElementById("computer");
const resultcon = document.getElementById("result");
const playerscore= document.getElementById("playerscore");
const computerscore = document.getElementById("computerscore");
let playerscores =0;
let computerscores=0;

function playgame(playerchoice){

    const computerchoice = choices [Math.floor(Math.random()*3)];
    let result ="";

    if(playerchoice===computerchoice){
        result+="IT'S A TIE";
    }

    else{
        switch(playerchoice){

            case "rock":
               result= (computerchoice=== "scissors") ? "YOU WIN!": "YOU LOSE!";
               break;

            case "paper":
               result= (computerchoice=== "rock") ? "YOU WIN!": "YOU LOSE!";
               break;  
               
            case "scissors":
               result= (computerchoice=== "paper") ? "YOU WIN!": "YOU LOSE!";
               break;               
        }
    }

    player.textContent=`PLAYER ${playerchoice}`;
    computer.textContent=`COMPUTER ${computerchoice}`;
    resultcon.textContent=result;
    
    resultcon.classList.remove("greenText","redText");

    switch(result){

        case "YOU WIN!":
            resultcon.classList.add("greenText");
            playerscores++;
            playerscore.textContent=playerscores;
            break;

        case "YOU LOSE!":
            resultcon.classList.add("redText");  
            computerscores++;
            computerscore.textContent=computerscores;
            break;  
    }
}