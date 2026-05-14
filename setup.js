$(document).ready(function(){

  // =========================
  // LOAD SAVED SETUP
  // =========================

  const savedSetup = JSON.parse(
    localStorage.getItem('assignifySetup')
  );

  if(savedSetup){

    $('#course').val(savedSetup.course);

    $('#semester').val(savedSetup.semester);

    $('#reminder').val(savedSetup.reminder);
    $('#reminderTime1').val(savedSetup.reminderTime1);
    $('#reminderTime2').val(savedSetup.reminderTime2);
    $('#reminderCount').val(savedSetup.reminderCount);
   
    $('#studyStyle').val(savedSetup.studyStyle);

    $('#theme').val(savedSetup.theme);

  }

  // =========================
  // LOAD SAVED THEME
  // =========================

  let savedTheme = localStorage.getItem('assignifyTheme');

  if(savedTheme === 'dark'){

    $('body').addClass('dark-mode');

  }

  // =========================
  // THEME CHANGE LIVE
  // =========================

  $('#theme').change(function(){

    const selectedTheme = $(this).val();

    if(selectedTheme === 'dark'){

      $('body').addClass('dark-mode');

    }else{

      $('body').removeClass('dark-mode');

    }

  });

  // =========================
  // SAVE SETUP
  // =========================

  $('.btn-save').click(function(){

    const course = $('#course').val().trim();

    const semester = $('#semester').val().trim();

    const reminder = $('#reminder').val();

    const reminderTime1 =$('#reminderTime1').val();

    const reminderTime2 =$('#reminderTime2').val();

    const reminderCount =$('#reminderCount').val();

    const studyStyle = $('#studyStyle').val();

    const theme = $('#theme').val();

    // VALIDATION

    if(
      course === '' ||
      semester === '' ||
      reminder === '' ||
      reminderTime1 === '' ||
      reminderTime2 === '' ||
      reminderCount === '' ||
      studyStyle === '' ||
      theme === ''
    ){

      alert('Please complete all fields!');

      return;
    }

    // =========================
    // SAVE DATA
    // =========================

    const setupData = {

      course: course,

      semester: semester,

      reminder: reminder,

      reminderTime1: reminderTime1,

      reminderTime2: reminderTime2,

      reminderCount: reminderCount,

      studyStyle: studyStyle,

      theme: theme

    };

    // SAVE MAIN SETUP

    localStorage.setItem(
      'assignifySetup',
      JSON.stringify(setupData)
    );

    // SAVE THEME ONLY

    localStorage.setItem(
      'assignifyTheme',
      theme
    );

    // =========================
    // APPLY THEME
    // =========================

    if(theme === 'dark'){

      $('body').addClass('dark-mode');

    }else{

      $('body').removeClass('dark-mode');

    }

    // =========================
    // SUCCESS
    // =========================

    alert('Setup saved successfully! 🚀');

    // GO TO HOME PAGE

    window.location.href = "home.html";

  });

});