$(document).ready(function(){

    // ========================================
    // ACCENT COLOUR SYSTEM
    // ========================================
    
    function darken(hex, percent) {
        let r = parseInt(hex.slice(1,3), 16);
        let g = parseInt(hex.slice(3,5), 16);
        let b = parseInt(hex.slice(5,7), 16);
        let f = 1 - percent / 100;
        return '#' + [r, g, b].map(v => 
            Math.round(Math.max(0, v * f)).toString(16).padStart(2, '0')
        ).join('');
    }
    
    function applyAccent(colour) {
        document.documentElement.style.setProperty('--accent', colour);
        let style = document.getElementById('accentStyle');
        if (!style) {
            style = document.createElement('style');
            style.id = 'accentStyle';
            document.head.appendChild(style);
        }
        style.textContent = `
            .toggle-pill input:checked ~ .pill-track {
                background: linear-gradient(135deg, ${colour}, ${darken(colour, 20)}) !important;
                box-shadow: 0 0 0 3px ${colour}25, inset 0 2px 6px rgba(0,0,0,0.1) !important;
            }
            .toggle-pill input:checked ~ .pill-track .pill-thumb {
                box-shadow: 0 2px 12px ${colour}66 !important;
            }
            .primary-btn, .reply-btn, .submit-tip-btn {
                background: linear-gradient(135deg, ${colour}, ${darken(colour, 20)}) !important;
            }
            .filter-tab.active {
                background: linear-gradient(135deg, ${colour}, ${darken(colour, 20)}) !important;
            }
            .cdot.active {
                box-shadow: 0 0 0 3px ${colour}, 0 0 0 6px ${colour}40 !important;
                transform: scale(1.15);
            }
        `;
    }
    
    // Load saved accent
    let savedAccent = localStorage.getItem('accentColour') || '#e01a8c';
    applyAccent(savedAccent);
    
    // Mark active dot
    $('.cdot').each(function(){
        if ($(this).data('colour') === savedAccent) {
            $(this).addClass('active');
        } else {
            $(this).removeClass('active');
        }
    });
    
    // Colour picker click
    $('#colourPicker').on('click', '.cdot', function(){
        let colour = $(this).data('colour');
        $('.cdot').removeClass('active');
        $(this).addClass('active');
        localStorage.setItem('accentColour', colour);
        applyAccent(colour);
        showToast('🎨 Accent colour updated!', colour);
    });
    
    // ========================================
    // PLAY SOUND FUNCTION
    // ========================================
    function playSound(type) {
        if (localStorage.getItem('soundEnabled') !== 'enabled') return;
        try {
            let ctx = new (window.AudioContext || window.webkitAudioContext)();
            let osc = ctx.createOscillator();
            let gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = type === 'click' ? 880 : type === 'success' ? 1046 : 660;
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.15);
        } catch(e) { console.log('Audio not supported'); }
    }
    
    // ========================================
    // HAPTIC FEEDBACK
    // ========================================
    function haptic(pattern) {
        if (localStorage.getItem('hapticEnabled') !== 'enabled') return;
        if (navigator.vibrate) navigator.vibrate(pattern || 10);
    }
    
    // ========================================
    // TOAST NOTIFICATION
    // ========================================
    function showToast(message, colour) {
        $('.fx-toast').remove();
        let toast = $(`<div class="fx-toast">${message}</div>`).css('background', colour || '#4caf50');
        $('body').append(toast);
        setTimeout(() => toast.addClass('fx-toast-in'), 10);
        setTimeout(() => {
            toast.removeClass('fx-toast-in');
            setTimeout(() => toast.remove(), 400);
        }, 2600);
    }
    
    // ========================================
    // DATA SIZE CALCULATOR
    // ========================================
    function calculateDataSize() {
        let total = 0;
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            total += (key.length + (value ? value.length : 0)) * 2;
        }
        let kb = (total / 1024).toFixed(1);
        let tips = JSON.parse(localStorage.getItem('userTips') || '[]').length;
        let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]').length;
        $('#dataSize').text(kb + ' KB · ' + tips + ' tips · ' + posts + ' posts');
    }
    
    // ========================================
    // APPLY DARK MODE ON PAGE LOAD
    // ========================================
    function applyDarkMode() {
        if (localStorage.getItem('darkMode') === 'enabled') {
            $('body').addClass('dark-mode');
        } else {
            $('body').removeClass('dark-mode');
        }
    }
    
    // ========================================
    // LOAD SAVED SETTINGS
    // ========================================
    if (localStorage.getItem('darkMode') === 'enabled') {
        $('#darkModeToggle').prop('checked', true);
    }
    
    if (localStorage.getItem('notifications') === 'enabled') {
        $('#notifToggle').prop('checked', true);
    }
    
    let savedRadius = localStorage.getItem('defaultRadius');
    if (savedRadius) {
        $('#defaultRadius').val(savedRadius);
    }
    
    applyDarkMode();
    calculateDataSize();
    
    // ========================================
    // DARK MODE TOGGLE
    // ========================================
    $('#darkModeToggle').on('change', function() {
        if ($(this).is(':checked')) {
            localStorage.setItem('darkMode', 'enabled');
            $('body').addClass('dark-mode');
        } else {
            localStorage.setItem('darkMode', 'disabled');
            $('body').removeClass('dark-mode');
        }
        playSound('click');
        haptic(10);
    });
    
    // ========================================
    // NOTIFICATIONS TOGGLE
    // ========================================
    $('#notifToggle').on('change', function() {
        if ($(this).is(':checked')) {
            localStorage.setItem('notifications', 'enabled');
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        } else {
            localStorage.setItem('notifications', 'disabled');
        }
        playSound('click');
        haptic(10);
    });
    
    // ========================================
    // DEFAULT RADIUS
    // ========================================
    $('#defaultRadius').on('change', function() {
        localStorage.setItem('defaultRadius', $(this).val());
        playSound('click');
        haptic(8);
        showToast('📍 Radius set to ' + $(this).val() + ' km', '#0ea5e9');
    });
    
    // ========================================
    // LOGOUT FUNCTION
    // ========================================
    $('#logoutBtn').on('click', function() {
        playSound('pop');
        haptic([20, 30, 20]);
        if (confirm('Log out of FIXORA?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('inventraUsername');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('avatarType');
            localStorage.removeItem('userImage');
            localStorage.removeItem('rememberedEmail');
            window.location.href = 'login.html';
        }
    });
    
    // ========================================
    // CLEAR ALL DATA
    // ========================================
    $('#clearDataBtn').on('click', function() {
        playSound('pop');
        haptic([50, 30, 50]);
        if (confirm('⚠️ This will delete ALL your tips, posts, likes and settings.\n\nThis CANNOT be undone. Continue?')) {
            let accent = localStorage.getItem('accentColour');
            localStorage.clear();
            if (accent) localStorage.setItem('accentColour', accent);
            showToast('🗑 All data cleared', '#888');
            setTimeout(() => location.reload(), 1500);
        }
    });
    
    // ========================================
    // VERSION ROW EASTER EGG (tap 5 kali)
    // ========================================
    let versionTaps = 0;
    $('#versionRow').on('click', function() {
        versionTaps++;
        if (versionTaps === 5) {
            versionTaps = 0;
            let xp = parseInt(localStorage.getItem('userXP') || '0');
            localStorage.setItem('userXP', xp + 100);
            showToast('🎉 Secret found! +100 XP', '#f4a800');
            haptic([10, 20, 10, 20, 100]);
        }
    });
    
    // ========================================
    // BACK BUTTON FUNCTIONALITY
    // ========================================
    $('.back-pill').on('click', function(e) {
        e.preventDefault();
        window.location.href = 'profile.html';
    });
    
    // ========================================
    // INJECT TOAST STYLES
    // ========================================
    if (!$('#toastStyle').length) {
        $('head').append(`<style id="toastStyle">
            .fx-toast {
                position: fixed;
                bottom: 96px;
                left: 50%;
                transform: translateX(-50%) translateY(20px);
                color: white;
                padding: 11px 22px;
                border-radius: 50px;
                font-size: 13px;
                font-weight: 600;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                white-space: nowrap;
                transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
                font-family: 'DM Sans', sans-serif;
            }
            .fx-toast-in {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            .cdot.spin-once {
                animation: cdotSpin 0.5s ease;
            }
            @keyframes cdotSpin {
                0% { transform: scale(1.15) rotate(0); }
                50% { transform: scale(1.3) rotate(180deg); }
                100% { transform: scale(1.15) rotate(360deg); }
            }
        </style>`);
    }
    
});