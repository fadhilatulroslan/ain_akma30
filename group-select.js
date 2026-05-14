let selectedMembers = [];
function confirmGroup() {

  // =========================
  // GET TEMP ASSIGNMENT
  // =========================
  let assignment = JSON.parse(
    localStorage.getItem('tempAssignment')
  );

  console.log("TEMP ASSIGNMENT:", assignment);
  console.log("SELECTED MEMBERS:", selectedMembers);

  if (!assignment) {
    alert("No assignment found!");
    return;
  }

  // =========================
  // FIX selectedMembers
  // =========================
  if (typeof selectedMembers === "undefined") {
    alert("selectedMembers is not defined (check group-select.js)");
    return;
  }

  if (!Array.isArray(selectedMembers) || selectedMembers.length === 0) {
    alert("Please select at least 1 member!");
    return;
  }

  // =========================
  // BUILD GROUP DATA
  // =========================
  assignment.members = selectedMembers;
  assignment.type = "Group";

  // =========================
  // SAVE ASSIGNMENTS
  // =========================
  let assignments = JSON.parse(
    localStorage.getItem('assignifyAssignments')
  ) || [];

  assignments.push(assignment);

  localStorage.setItem(
    'assignifyAssignments',
    JSON.stringify(assignments)
  );

  // =========================
  // SAVE NOTIFICATIONS
  // =========================
  let notifications = JSON.parse(
    localStorage.getItem('assignifyNotifications')
  ) || [];

  selectedMembers.forEach(email => {

    notifications.push({
      id: Date.now() + Math.random(),
      user: email,
      message: `👥 ${assignment.title} - added to group`,
      time: new Date().toISOString()
    });

  });

  localStorage.setItem(
    'assignifyNotifications',
    JSON.stringify(notifications)
  );

  // =========================
  // CLEANUP
  // =========================
  localStorage.removeItem('tempAssignment');

  // =========================
  // REDIRECT
  // =========================
  window.location.href = "home.html";
}