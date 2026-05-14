function signIn(){

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // EMAIL VALIDATION
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if(username === '' || password === ''){
    alert('Please fill in all fields!');
    return;
  }

  if(!emailPattern.test(username)){
    alert('Invalid email format! Please insert valid email (example@gmail.com)');
    return;
  }

  const userData = {
    email: username,
    password: password
  };

  localStorage.setItem('assignifyUser', JSON.stringify(userData));

  alert('Sign in successful! 🚀');

  // Pindah ke login page selepas berjaya register
  window.location.href = "login.html";
}