const quotes = [
  "You are stronger than you think.",
  "Keep going, don’t give up.",
  "Small steps lead to big success.",
  "Discipline creates freedom.",
  "Today is your chance to improve."
];

const images = [
  "moti-1.jpg",
  "moti-2.jpg",
  "moti-3.jpg",
  "moti-4.jpg",
  "moti-5.jpg"
];

let index = 0;
let interval;

function speak(text){

  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = 1;
  speech.pitch = 1;
  speech.lang = "en-US";

  speechSynthesis.speak(speech);

}

function showMotivation(){

  const quote = quotes[index % quotes.length];
  const img = images[index % images.length];

  document.getElementById("quote").innerText = quote;

  const imgEl = document.getElementById("motivationImg");
  imgEl.src = img;
  imgEl.style.display = "block";

  speak(quote);

  index++;

}

function startMotivation(){

  showMotivation();

  interval = setInterval(showMotivation, 5000); // every 5 sec

}

function skipMotivation(){

  clearInterval(interval);

  document.getElementById("quote").innerText =
    "Motivation paused 😴";

  speechSynthesis.cancel();

}

function goHome(){
  window.location.href = "home.html";
}