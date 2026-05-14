const tones = [

  {

    name: "Classic Beep",

    image: "im-1.png",

    audio: "classicbeep.mp3"

  },

  {

    name: "Soft Ring",

    image: "im-2.png",

    audio: "softring.mp3"

  },

  {

    name: "Morning Alarm",

    image: "im-3.png",

    audio: "morningalarm.mp3"

  },

  {

    name: "Digital Tone",

    image: "im-4.png",

    audio: "digitaltone.mp3"

  },

  {

    name: "Gentle Wake",

    image: "im-5.png",

    audio: "gentlewake.mp3"

  },

  {

    name: "Beep Fast",

    image: "im-6.png",

    audio: "beepfast.mp3"

  }

];

let selectedTone = localStorage.getItem(
  'assignifyAlarmTone'
) || "Classic Beep";

function renderTones(){

  $('#toneList').html('');

  tones.forEach(function(tone){

    const activeClass =
      tone.name === selectedTone
      ? "active"
      : "";

    const card = `

      <div
        class="tone ${activeClass}"
        data-audio="${tone.audio}"
        data-name="${tone.name}"
      >

        <div class="left">

          <img
            src="${tone.image}"
            class="tone-icon"
          >

          <div>

            <div class="tone-name">
              ${tone.name}
            </div>

            <div class="preview">
              Hover to preview 🔊
            </div>

          </div>

        </div>

        <div>
          🎵
        </div>

      </div>

    `;

    $('#toneList').append(card);

  });

}

/* =========================
   HOVER SOUND PREVIEW
========================= */
let previewAudio = null;

$(document).on('mouseenter', '.tone', function () {

  const audioSrc = $(this).attr('data-audio');

  // stop audio lama kalau tengah play
  if (previewAudio) {
    previewAudio.pause();
    previewAudio.currentTime = 0;
  }

  // create audio baru
  previewAudio = new Audio(audioSrc);
  previewAudio.volume = 0.7;
  previewAudio.loop = false; // confirm tak loop

  previewAudio.play();

});

/* =========================
   SELECT TONE
========================= */

$(document).on(
  'click',
  '.tone',
  function(){

    selectedTone =
      $(this).attr('data-name');

    renderTones();

  }
);

/* =========================
   SAVE TONE
========================= */

function saveTone(){

  localStorage.setItem(
    'assignifyAlarmTone',
    selectedTone
  );

  alert(
    'Alarm tone saved successfully 🎵'
  );

}

/* =========================
   BACK
========================= */

function goBack(){

  window.location.href =
    "profile.html";

}

renderTones();