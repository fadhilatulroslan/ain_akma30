const alarmData = JSON.parse(
  localStorage.getItem('assignifyCurrentAlarm')
);

if(!alarmData){

  window.location.href = "home.html";

}

document.getElementById(
  'alarmTitle'
).innerText =
  "⏰ " + alarmData.title;

document.getElementById(
  'alarmText'
).innerText =
  "Due Date: " + alarmData.dueDate;

// =========================
// PLAY TONE
// =========================

const selectedTone =
  localStorage.getItem(
    'assignifyAlarmTone'
  ) || "Classic Beep";

let soundFile = "classicbeep.mp3";

if(selectedTone === "Soft Ring"){
  soundFile = "softring.mp3";
}

if(selectedTone === "Morning Alarm"){
  soundFile = "morningalarm.mp3";
}

if(selectedTone === "Digital Tone"){
  soundFile = "digitaltone.mp3";
}

if(selectedTone === "Gentle Wake"){
  soundFile = "gentlewake.mp3";
}

if(selectedTone === "Beep Fast"){
  soundFile = "beepfast.mp3";
}

const audio = new Audio(soundFile);

audio.loop = true;

audio.play();

// =========================
// STOP
// =========================

function stopAlarm(){

  audio.pause();

  localStorage.removeItem(
    'assignifyCurrentAlarm'
  );

  window.location.href =
    "home.html";

}

setTimeout(() => {
  audio.play();
}, 300);