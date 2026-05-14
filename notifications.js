const currentUser = JSON.parse(
  localStorage.getItem('currentAssignifyUser')
);

if(!currentUser){

  window.location.href = "login.html";

}

const notifications = JSON.parse(
  localStorage.getItem('assignifyNotifications')
) || [];

const list = document.getElementById(
  'notificationList'
);

// FILTER IKUT USER CURRENT
const userNotifications = notifications.filter(
  item => item.user === currentUser.email
);

// KALAU TAKDE NOTIFICATION
if(userNotifications.length === 0){

  list.innerHTML = `
    <div class="empty-notif">
      No notifications yet 🔔
    </div>
  `;

}else{

  // SORT LATEST DULU
  userNotifications.reverse();

  userNotifications.forEach(function(item){

    list.innerHTML += `

      <div class="notif-card">

        <div class="notif-message">
          ${item.message}
        </div>

        ${
          item.assignmentTitle
          ?
          `
            <div class="notif-assignment">
              📚 ${item.assignmentTitle}
            </div>
          `
          :
          ''
        }

      </div>

    `;

  });

}