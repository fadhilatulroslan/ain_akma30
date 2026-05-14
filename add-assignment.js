function saveAssignment(){

  const title = document.getElementById('title').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const dueDate = document.getElementById('dueDate').value;
  const type = document.getElementById('type').value;
  const reminder = document.getElementById('reminder').value;

  if(!title || !subject || !dueDate || !type || !reminder){
    alert('Please complete all fields!');
    return;
  }

  const newAssignment = {
    id: Date.now(),
    title,
    subject,
    dueDate,
    type,
    reminder,
    progress: 0,
    completed: false,
    members: []
  };

  
  if(type === 'Group'){

    newAssignment.members = ["Student 1", "Student 2"];

  }

  let assignments =
    JSON.parse(localStorage.getItem('assignifyAssignments')) || [];

  assignments.push(newAssignment);

  localStorage.setItem(
    'assignifyAssignments',
    JSON.stringify(assignments)
  );

  window.location.href = "home.html";
}