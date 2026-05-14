const assignmentId = localStorage.getItem('selectedAssignment');

let assignments = JSON.parse(
  localStorage.getItem('assignifyAssignments')
) || [];

let assignment = assignments.find(
  a => a.id == assignmentId
);

if(!assignment){
  alert("Assignment not found!");
  window.location.href = "home.html";
}

// =========================
// LOAD INFO
// =========================

document.getElementById('title').innerText =
  assignment.title;

document.getElementById('infoBox').innerHTML = `
  <p><b>Subject:</b> ${assignment.subject}</p>
  <p><b>Due:</b> ${assignment.dueDate}</p>
  <p><b>Type:</b> ${assignment.type}</p>
`;

// =========================
// RENDER SYSTEM
// =========================

function renderSystem(){

  const memberList =
    document.getElementById('memberList');

  memberList.innerHTML = '';

  // =========================
  // INDIVIDUAL
  // =========================

  if(assignment.type === "Individual"){

    memberList.innerHTML = `

      <div class="member-card">

        <h3>📚 Progress</h3>

        <input
          type="range"
          min="0"
          max="100"
          value="${assignment.progress}"
          id="progressSlider"
          oninput="updateProgress(this.value)"
        >

        <p id="progressText">
          ${assignment.progress}%
        </p>

      </div>

    `;

    return;
  }

  // =========================
  // GROUP
  // =========================

  if(!assignment.submissions){
    assignment.submissions = {};
  }

  assignment.members.forEach((email, index) => {

    const username =
      email.split('@')[0];

    const alreadySubmit =
      assignment.submissions[index];

    memberList.innerHTML += `

      <div class="member-card">

        <b>👤 ${username}</b>

        <input
          type="file"
          id="file-${index}"
        >

        <button onclick="submitMember(${index})">

          ${
            alreadySubmit
            ? "Update File"
            : "Submit File"
          }

        </button>

        ${
          alreadySubmit
          ? `<p>✅ Submitted</p>`
          : `<p>⌛ Pending</p>`
        }

      </div>

    `;
  });

}

renderSystem();

// =========================
// INDIVIDUAL PROGRESS
// =========================

function updateProgress(value){

  assignment.progress = parseInt(value);

  document.getElementById(
    'progressText'
  ).innerText = value + "%";

  // AUTO COMPLETE

  if(value == 100){

    assignment.completed = true;

    saveData();

    window.location.href =
      "well-done.html";

    return;
  }

  saveData();
}

// =========================
// GROUP SUBMIT
// =========================

function submitMember(index){

  const file =
    document.getElementById(
      `file-${index}`
    ).files[0];

  if(!file){
    alert("Please upload file");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e){

    assignment.submissions[index] = {

      name: file.name,

      file: e.target.result

    };

    // AUTO PROGRESS

    const total =
      assignment.members.length;

    const done =
      Object.keys(
        assignment.submissions
      ).length;

    assignment.progress =
      Math.round((done / total) * 100);

    if(done === total){

      assignment.completed = true;

      saveData();

      window.location.href =
        "well-done.html";

      return;
    }

    saveData();

    location.reload();

  };

  reader.readAsDataURL(file);
}

// =========================
// SAVE
// =========================

function saveData(){

  const index =
    assignments.findIndex(
      a => a.id == assignment.id
    );

  assignments[index] = assignment;

  localStorage.setItem(
    'assignifyAssignments',
    JSON.stringify(assignments)
  );
}

// =========================
// DELETE
// =========================

function deleteAssignment(){

  const confirmDelete =
    confirm(
      "Delete assignment?"
    );

  if(!confirmDelete){
    return;
  }

  assignments =
    assignments.filter(
      a => a.id != assignment.id
    );

  localStorage.setItem(
    'assignifyAssignments',
    JSON.stringify(assignments)
  );

  window.location.href =
    "home.html";
}