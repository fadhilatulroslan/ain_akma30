$(document).ready(function() {
    
    // ========================================
    // SLIDING FORM TOGGLE
    // ========================================
    $('#loginToggle').on('click', function() {
        $(this).addClass('active');
        $('#signupToggle').removeClass('active');
        $('#signupForm').removeClass('active');
        $('#loginForm').addClass('active');
        
        $('#loginErrorMsg').hide();
        $('#signupErrorMsg').hide();
        $('#signupSuccessMsg').hide();
    });
    
    $('#signupToggle').on('click', function() {
        $(this).addClass('active');
        $('#loginToggle').removeClass('active');
        $('#loginForm').removeClass('active');
        $('#signupForm').addClass('active');
        
        $('#loginErrorMsg').hide();
        $('#signupErrorMsg').hide();
        $('#signupSuccessMsg').hide();
    });
    
    // ========================================
    // SELECTED USER DETECTION (from choose-user page)
    // ========================================
    let selectedUser = localStorage.getItem('selectedUser');
    let selectedUserName = localStorage.getItem('selectedUserName');
    
    if (selectedUser && selectedUserName) {
        $('#selectedUserNameDisplay').text(selectedUserName);
        $('#selectedUserBadge').show();
        
        // Pre-fill email based on selected user
        if (selectedUser === 'akma') {
            $('#loginEmail').val('akma@fixora.com');
            $('#signupEmail').val('akma@fixora.com');
            $('#signupName').val('Akma');
        } else if (selectedUser === 'ain') {
            $('#loginEmail').val('ain@fixora.com');
            $('#signupEmail').val('ain@fixora.com');
            $('#signupName').val('Ain');
        }
    }
    
    // Change user button
    $('#changeUserBtn').on('click', function() {
        window.location.href = 'choose-user.html';
    });
    
    // ========================================
    // FILL DEMO BUTTON
    // ========================================
    $('#fillDemoBtn').on('click', function() {
        $('#loginEmail').val('demo@fixora.com');
        $('#loginPassword').val('123456');
        
        $('#loginEmail, #loginPassword').css('border-color', '#4caf50');
        setTimeout(() => {
            $('#loginEmail, #loginPassword').css('border-color', '');
        }, 1000);
    });
    
    // ========================================
    // FORGOT PASSWORD
    // ========================================
    $('#forgotLink').on('click', function(e) {
        e.preventDefault();
        alert('📧 Password reset link sent to your email!\n\n(For demo: use demo@fixora.com / 123456)');
    });
    
    // ========================================
    // LOGIN FUNCTION
    // ========================================
    $('#loginBtn').on('click', function() {
        let email = $('#loginEmail').val().trim();
        let password = $('#loginPassword').val();
        
        if (!email || !password) {
            showLoginError('Please enter email and password');
            return;
        }
        
        // Get users from localStorage
        let users = JSON.parse(localStorage.getItem('fixoraUsers') || '[]');
        
        // Check for demo account
        if (email === 'demo@fixora.com' && password === '123456') {
            loginSuccess({
                name: 'Demo User',
                email: 'demo@fixora.com',
                role: 'demo'
            });
            return;
        }
        
        // Check for existing user
        let user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            loginSuccess(user);
        } else {
            showLoginError('Invalid email or password');
        }
    });
    
    function loginSuccess(user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('inventraUsername', user.name);
        localStorage.setItem('userRole', user.role || 'user');
        
        if (selectedUser) {
            localStorage.setItem('userType', selectedUser);
        }
        
        // Remember me
        if ($('#rememberMe').is(':checked')) {
            localStorage.setItem('rememberedEmail', user.email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        window.location.href = 'index.html';
    }
    
    function showLoginError(message) {
        $('#loginErrorMsg').text(message).fadeIn(300);
        setTimeout(() => $('#loginErrorMsg').fadeOut(300), 3000);
    }
    
    // ========================================
    // SIGNUP FUNCTION
    // ========================================
    $('#signupBtn').on('click', function() {
        let name = $('#signupName').val().trim();
        let email = $('#signupEmail').val().trim();
        let password = $('#signupPassword').val();
        let confirm = $('#signupConfirmPassword').val();
        
        if (!name) {
            showSignupError('Please enter your full name');
            return;
        }
        if (!email) {
            showSignupError('Please enter your email');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            showSignupError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            showSignupError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirm) {
            showSignupError('Passwords do not match');
            return;
        }
        
        let users = JSON.parse(localStorage.getItem('fixoraUsers') || '[]');
        
        if (users.some(u => u.email === email)) {
            showSignupError('Email already registered. Please login instead.');
            return;
        }
        
        let newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: selectedUser || 'user',
            roleName: selectedUserName || name,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('fixoraUsers', JSON.stringify(users));
        
        showSignupSuccess('Account created successfully! Redirecting...');
        
        setTimeout(() => {
            loginSuccess(newUser);
        }, 1500);
    });
    
    function showSignupError(message) {
        $('#signupErrorMsg').text(message).fadeIn(300);
        setTimeout(() => $('#signupErrorMsg').fadeOut(300), 3000);
    }
    
    function showSignupSuccess(message) {
        $('#signupSuccessMsg').text(message).fadeIn(300);
        setTimeout(() => $('#signupSuccessMsg').fadeOut(300), 3000);
    }
    
    // ========================================
    // ENTER KEY SUBMIT
    // ========================================
    $('#loginPassword, #loginEmail').on('keypress', function(e) {
        if (e.which === 13) $('#loginBtn').click();
    });
    
    $('#signupPassword, #signupConfirmPassword, #signupEmail, #signupName').on('keypress', function(e) {
        if (e.which === 13) $('#signupBtn').click();
    });
    
    // ========================================
    // LOAD REMEMBERED EMAIL
    // ========================================
    let rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && !selectedUser) {
        $('#loginEmail').val(rememberedEmail);
        $('#rememberMe').prop('checked', true);
    }
    
});