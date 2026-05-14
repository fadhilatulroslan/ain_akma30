// profile.js

// =========================
// LOAD USER
// =========================

const user = JSON.parse(
  localStorage.getItem(
    'currentAssignifyUser'
  )
);

if(user){

  document.getElementById(
    'profileEmail'
  ).innerText = user.email;

  const username =
    user.email.split('@')[0];

  document.getElementById(
    'profileName'
  ).innerText = username;

}

// =========================
// LOAD PROFILE IMAGE
// =========================

const savedImage = localStorage.getItem(
  'assignifyProfileImage'
);

if(savedImage){

  document.getElementById(
    'profilePreview'
  ).src = savedImage;

}

// =========================
// LOAD SETTINGS
// =========================

const savedSetup = JSON.parse(
  localStorage.getItem(
    'assignifySetup'
  )
);

if(savedSetup){

  document.getElementById(
    'theme'
  ).value =
    savedSetup.theme || 'light';

  document.getElementById(
    'studyStyle'
  ).value =
    savedSetup.studyStyle || 'Visual';

  document.getElementById(
    'pushNotification'
  ).checked =
    savedSetup.pushNotification || false;

  // LOAD LANGUAGE UI

  if(savedSetup.language){

    document.getElementById(
      'selectedText'
    ).innerText =
      savedSetup.language;

  }

}

// =========================
// UPLOAD IMAGE
// =========================

function chooseImage(){

  document.getElementById(
    'profileInput'
  ).click();

}

document.getElementById(
  'profileInput'
).addEventListener('change', function(e){

  const file = e.target.files[0];

  if(!file){
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event){

    const imageData =
      event.target.result;

    document.getElementById(
      'profilePreview'
    ).src = imageData;

    localStorage.setItem(
      'assignifyProfileImage',
      imageData
    );

  };

  reader.readAsDataURL(file);

});

// =========================
// SAVE PROFILE
// =========================

function saveProfile(){

  const theme =
    document.getElementById(
      'theme'
    ).value;

  const studyStyle =
    document.getElementById(
      'studyStyle'
    ).value;

  const language =
    document.getElementById(
      'selectedText'
    ).innerText;

  const pushNotification =
    document.getElementById(
      'pushNotification'
    ).checked;

  const oldData = JSON.parse(
    localStorage.getItem(
      'assignifySetup'
    )
  ) || {};

  const updatedData = {

    ...oldData,

    theme: theme,

    studyStyle: studyStyle,

    language: language,

    pushNotification:
      pushNotification

  };

  localStorage.setItem(
    'assignifySetup',
    JSON.stringify(updatedData)
  );

  localStorage.setItem(
    'assignifyTheme',
    theme
  );

  // APPLY THEME LIVE

  if(theme === 'dark'){

    document.body.classList.add(
      'dark-mode'
    );

  }else{

    document.body.classList.remove(
      'dark-mode'
    );

  }

  alert(
    'Profile updated successfully! 🚀'
  );

  window.location.href =
  "home.html";
}

// =========================
// GO TO ALARM TONE PAGE
// =========================

function goAlarmTone(){

  window.location.href =
    "alarm-tone.html";

}

// =========================
// HELP PAGE
// =========================

function goHelp(){

  window.location.href =
    "help.html";

}

// =========================
// CHANGE PASSWORD
// =========================

function changePassword(){

  const newPassword = prompt(
    'Enter new password'
  );

  if(!newPassword){
    return;
  }

  let users = JSON.parse(
    localStorage.getItem(
      'assignifyUsers'
    )
  ) || [];

  const currentUser = JSON.parse(
    localStorage.getItem(
      'currentAssignifyUser'
    )
  );

  users.forEach(function(user){

    if(
      user.email ===
      currentUser.email
    ){

      user.password =
        newPassword;

    }

  });

  localStorage.setItem(
    'assignifyUsers',
    JSON.stringify(users)
  );

  currentUser.password =
    newPassword;

  localStorage.setItem(
    'currentAssignifyUser',
    JSON.stringify(currentUser)
  );

  alert(
    'Password changed successfully!'
  );

}

// =========================
// LOGOUT
// =========================

function logout(){

  localStorage.removeItem(
    'currentAssignifyUser'
  );

  window.location.href =
    "signin.html";

}

// =========================
// LANGUAGE DATA
// =========================

const translations = {

  English: {

    appSettings:
      "App Settings",

    theme:
      "Theme",

    themeDesc:
      "Choose your preferred mode",

    push:
      "Push Notifications",

    pushDesc:
      "5 reminders per day",

    alarm:
      "Alarm Tone",

    alarmDesc:
      "Select your ringtone",

    language:
      "Language",

    languageDesc:
      "Select app language",

    study:
      "Study Style",

    studyDesc:
      "Customize your learning style",

    account:
      "Account",

    help:
      "Help & Support",

    helpDesc:
      "Contact and FAQ",

    password:
      "Change Password",

    passwordDesc:
      "Update your account password",

    save:
      "Save Changes 🚀",

    logout:
      "Logout"

  },

  "Bahasa Melayu": {

    appSettings:
      "Tetapan Aplikasi",

    theme:
      "Tema",

    themeDesc:
      "Pilih mod pilihan anda",

    push:
      "Notifikasi",

    pushDesc:
      "5 peringatan setiap hari",

    alarm:
      "Nada Penggera",

    alarmDesc:
      "Pilih nada dering",

    language:
      "Bahasa",

    languageDesc:
      "Pilih bahasa aplikasi",

    study:
      "Gaya Belajar",

    studyDesc:
      "Sesuaikan gaya pembelajaran",

    account:
      "Akaun",

    help:
      "Bantuan & Sokongan",

    helpDesc:
      "Hubungi dan FAQ",

    password:
      "Tukar Kata Laluan",

    passwordDesc:
      "Kemas kini kata laluan",

    save:
      "Simpan Perubahan 🚀",

    logout:
      "Log Keluar"

  }

};

// =========================
// APPLY LANGUAGE
// =========================

function applyLanguage(language){

  const text =
    translations[language];

  if(!text){
    return;
  }

  document.querySelectorAll(
    '.section-title'
  )[0].innerText =
    text.appSettings;

  document.querySelectorAll(
    '.settings-card h2'
  )[0].innerText =
    text.theme;

  document.querySelectorAll(
    '.settings-card p'
  )[0].innerText =
    text.themeDesc;

  document.querySelectorAll(
    '.settings-card h2'
  )[1].innerText =
    text.push;

  document.querySelectorAll(
    '.settings-card p'
  )[1].innerText =
    text.pushDesc;

  document.querySelectorAll(
    '.settings-card h2'
  )[2].innerText =
    text.alarm;

  document.querySelectorAll(
    '.settings-card p'
  )[2].innerText =
    text.alarmDesc;

  document.querySelectorAll(
    '.settings-card h2'
  )[3].innerText =
    text.language;

  document.querySelectorAll(
    '.settings-card p'
  )[3].innerText =
    text.languageDesc;

  document.querySelectorAll(
    '.settings-card h2'
  )[4].innerText =
    text.study;

  document.querySelectorAll(
    '.settings-card p'
  )[4].innerText =
    text.studyDesc;

  document.querySelectorAll(
    '.section-title'
  )[1].innerText =
    text.account;

  document.querySelectorAll(
    '.settings-card h2'
  )[5].innerText =
    text.help;

  document.querySelectorAll(
    '.settings-card p'
  )[5].innerText =
    text.helpDesc;

  document.querySelectorAll(
    '.settings-card h2'
  )[6].innerText =
    text.password;

  document.querySelectorAll(
    '.settings-card p'
  )[6].innerText =
    text.passwordDesc;

  document.querySelector(
    '.save-btn'
  ).innerText =
    text.save;

  document.querySelector(
    '.logout-btn'
  ).innerText =
    text.logout;

}

// =========================
// LOAD SAVED LANGUAGE
// =========================

if(
  savedSetup &&
  savedSetup.language
){

  applyLanguage(
    savedSetup.language
  );

}

// =========================
// LANGUAGE DROPDOWN
// =========================

function toggleLanguageDropdown(){

  const dropdown =
    document.getElementById(
      'languageDropdown'
    );

  if(
    dropdown.style.display ===
    'block'
  ){

    dropdown.style.display =
      'none';

  }else{

    dropdown.style.display =
      'block';

  }

}

function selectLanguage(
  language,
  image
){

  document.getElementById(
    'selectedText'
  ).innerText =
    language;

  document.getElementById(
    'selectedFlag'
  ).src =
    image;

  document.getElementById(
    'languageDropdown'
  ).style.display =
    'none';

  const oldData = JSON.parse(
    localStorage.getItem(
      'assignifySetup'
    )
  ) || {};

  const updatedData = {

    ...oldData,

    language: language

  };

  localStorage.setItem(
    'assignifySetup',
    JSON.stringify(updatedData)
  );

  applyLanguage(language);

}