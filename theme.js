// =========================
// THEME SYSTEM
// =========================

document.addEventListener("DOMContentLoaded", function () {

  const savedTheme = localStorage.getItem('assignifyTheme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // MUSIC INIT
  initMusic();
});

// =========================
// ALARM TONE
// =========================

function playAlarmTone(){

  const selectedTone =
    localStorage.getItem('assignifyAlarmTone') || 'Classic Beep';

  let soundFile = 'classicbeep.mp3';

  if(selectedTone === 'Soft Ring'){
    soundFile = 'softring.mp3';
  }

  if(selectedTone === 'Morning Alarm'){
    soundFile = 'morningalarm.mp3';
  }

  if(selectedTone === 'Digital Tone'){
    soundFile = 'digitaltone.mp3';
  }

  if(selectedTone === 'Gentle Wake'){
    soundFile = 'gentlewake.mp3';
  }

  if(selectedTone === 'Beep Fast'){
    soundFile = 'beepfast.mp3';
  }

  const audio = new Audio(soundFile);
  audio.play();
}

// =========================
// BACKGROUND MUSIC SYSTEM
// =========================

let bgMusic = new Audio("bg-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

let isMuted = localStorage.getItem("assignifyMute") === "true";

// INIT MUSIC
function initMusic(){

  if(!isMuted){
    bgMusic.play().catch(()=>{});
  }

  updateMusicButton();
}

// TOGGLE MUSIC (USED BY HOME BUTTON)
function toggleMusic(){

  isMuted = !isMuted;

  localStorage.setItem("assignifyMute", isMuted);

  if(isMuted){
    bgMusic.pause();
  } else {
    bgMusic.play().catch(()=>{});
  }

  updateMusicButton();
}

// UPDATE BUTTON IN HOME PAGE
function updateMusicButton(){

  const btn = document.getElementById("musicToggleBtnHeader");

  if(!btn) return;

  btn.innerText = isMuted ? "🔇" : "🔊";
}