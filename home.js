const currentUser = JSON.parse(
  localStorage.getItem('currentAssignifyUser')
);

if (!currentUser) {
  window.location.href = "login.html";
}

$(document).ready(function () {
  loadAssignments();
  triggerNotifications();

  // 🔁 auto check setiap 60 saat
  setInterval(triggerNotifications, 60000);
});

// =========================
// LOAD ASSIGNMENTS
// =========================
function loadAssignments() {

  const assignments = JSON.parse(
    localStorage.getItem('assignifyAssignments')
  ) || [];

  let pending = 0;
  let done = 0;

  $('#pending-list').html('');
  $('#completed-list').html('');

  if (assignments.length === 0) {
    $('#pending-list').html('<p>No assignments yet</p>');
    $('.pending-num').text(0);
    $('.done-num').text(0);
    $('.total-num').text(0);
    return;
  }

  assignments.forEach(function (item) {

    const today = new Date();
    const dueDate = new Date(item.dueDate);

    const difference = dueDate - today;
    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

    const isGroup = Array.isArray(item.members) && item.members.length > 0;

    const typeText = isGroup
      ? `👥 Group (${item.members.length})`
      : "👤 Individual";

    const extraInfo = isGroup
      ? `<div class="asgn-extra">Members: ${item.members.length}</div>`
      : "";

    const card = `
      <div class="asgn-card" onclick="openAssignment(${item.id})">

        <div>

          <div class="asgn-title">
            ${item.title}
          </div>

          <div class="asgn-subject">
            ${item.subject}
          </div>

          <div class="asgn-type">
            ${typeText}
          </div>

          ${extraInfo}

        </div>

        <div class="chip">
          ${item.completed ? '✅ Done' : daysLeft + 'd left'}
        </div>

      </div>
    `;

    if (item.completed) {
      done++;
      $('#completed-list').append(card);
    } else {
      pending++;
      $('#pending-list').append(card);
    }

  });

  $('.pending-num').text(pending);
  $('.done-num').text(done);
  $('.total-num').text(assignments.length);
}

// =========================
// OPEN ASSIGNMENT
// =========================
function openAssignment(id) {
  localStorage.setItem('selectedAssignment', id);
  window.location.href = "assignment-detail.html";
}

// =========================
// 🔔 NOTIFICATION SYSTEM
// =========================
function triggerNotifications() {

  const assignments = JSON.parse(
    localStorage.getItem('assignifyAssignments')
  ) || [];

  const setup = JSON.parse(
    localStorage.getItem('assignifySetup')
  ) || {};

  if (!setup.pushNotification) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  assignments.forEach(item => {

    if (item.completed) return;

    const dueDate = new Date(item.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (dueDate - today) / (1000 * 60 * 60 * 24)
    );

    let message = "";

    // 🚨 TODAY = ALARM
    if (diffDays === 0) {
      message = `🚨 "${item.title}" due TODAY!`;
      playAlarmPopup(message);

    }

    // ⏰ TOMORROW
    else if (diffDays === 1) {
      message = `⏰ "${item.title}" due tomorrow`;
      addNotification(item, message);
    }

    // 📌 2-3 DAYS
    else if (diffDays <= 3 && diffDays > 1) {
      message = `📌 "${item.title}" due in ${diffDays} days`;
      addNotification(item, message);
    }

  });
}

// =========================
// SAVE NOTIFICATION (NO DUPLICATE)
// =========================
function addNotification(item, message) {

  let notifications = JSON.parse(
    localStorage.getItem('assignifyNotifications')
  ) || [];

  const exists = notifications.some(n =>
    n.message === message &&
    n.user === currentUser.email
  );

  if (exists) return;

  notifications.push({
    user: currentUser.email,
    message,
    time: new Date().toISOString()
  });

  localStorage.setItem(
    'assignifyNotifications',
    JSON.stringify(notifications)
  );
}

// =========================
// ALARM POPUP (PHONE STYLE)
// =========================
function playAlarmPopup(message) {

  if (document.getElementById('alarmOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = "alarmOverlay";

  overlay.style = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.85);
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    color:white;
    z-index:9999;
    font-family:sans-serif;
    text-align:center;
    padding:20px;
  `;

  overlay.innerHTML = `
    <h1>⏰ ALARM</h1>
    <p style="margin-top:10px;font-size:16px">${message}</p>

    <button id="dismissAlarm"
      style="
        margin-top:20px;
        padding:12px 22px;
        border:none;
        border-radius:20px;
        font-weight:bold;
        background:#C84B9E;
        color:white;
        cursor:pointer;
      ">
      Dismiss
    </button>
  `;

  document.body.appendChild(overlay);

  document.getElementById("dismissAlarm").onclick = () => {
    overlay.remove();
  };

  const audio = new Audio("morningalarm.mp3");
  audio.volume = 0.8;

  audio.play().catch(() => {});
}