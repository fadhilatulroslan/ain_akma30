const user = JSON.parse(localStorage.getItem('currentAssignifyUser'));

if(!user){
  window.location.href = "login.html";
}

const nameOnly = user.email.split('@')[0];

document.getElementById("greeting").innerText =
  `Hi, ${nameOnly} 👋`;

// MOTIVATION ROTATION
const quotes = [
  "Small steps every day lead to big results.",
  "Focus. Work. Achieve.",
  "Discipline is the real motivation.",
  "You are closer than you think.",
  "Start now, not tomorrow."
];

let i = 0;

function rotateQuote(){

  document.getElementById("quote").innerText =
    quotes[i];

  i = (i + 1) % quotes.length;

}

rotateQuote();
setInterval(rotateQuote, 4000);

// NAVIGATION
function goSetup(){
  window.location.href = "setup.html";
}

function skip(){
  window.location.href = "home.html";
}