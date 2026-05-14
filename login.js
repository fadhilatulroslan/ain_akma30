function loginUser(){

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const storedUser = JSON.parse(localStorage.getItem('assignifyUser'));

  if(!storedUser){
    alert('No account found. Please sign in first!');
    return;
  }

  if(email === '' || password === ''){
    alert('Please fill in all fields!');
    return;
  }

  if(email !== storedUser.email || password !== storedUser.password){
    alert('Invalid email or password!');
    return;
  }

  alert('Login successful! 🦉');

  // Simpan session terkini
  localStorage.setItem(
  'currentAssignifyUser',
  JSON.stringify({
    email: email,
    password: password
  })
);

  window.location.href = "welcome.html";
}
