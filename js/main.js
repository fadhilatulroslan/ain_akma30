$(document).ready(function(){

    // ========================================
    // CHECK LOGIN
    // ========================================
    if (window.location.pathname.indexOf('login.html') === -1 && 
        window.location.pathname.indexOf('signup.html') === -1 &&
        window.location.pathname.indexOf('landing.html') === -1) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
        }
    }

    // ========================================
    // DARK MODE
    // ========================================
    if (localStorage.getItem('darkMode') === 'enabled') {
        $('body').addClass('dark-mode');
        if ($('#darkModeToggle').length > 0) {
            $('#darkModeToggle').prop('checked', true);
        }
    }

    // ========================================
    // BOTTOM NAVIGATION
    // ========================================
    $('.nav').on('click', function(e){
        e.preventDefault();
        var page = $(this).find('span:last-child').text().toLowerCase().trim();
        if      (page === 'home')      window.location.href = 'index.html';
        else if (page === 'shops')     window.location.href = 'shops.html';
        else if (page === 'community') window.location.href = 'community.html';
        else if (page === 'profile')   window.location.href = 'profile.html';
    });

    // ========================================
    // UTILITIES
    // ========================================

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/[&<>]/g, m =>
            m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'
        );
    }

    function showToastMessage(message, isError = false) {
        let toast = $('#customToast');
        if (toast.length === 0) {
            $('body').append('<div id="customToast" style="position:fixed;bottom:100px;left:50%;transform:translateX(-50%);color:white;padding:11px 22px;border-radius:50px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,0.18);display:none;white-space:nowrap;"></div>');
            toast = $('#customToast');
        }
        toast.css('background', isError ? '#ff4444' : '#4caf50');
        toast.text(message).fadeIn(200);
        setTimeout(() => toast.fadeOut(300), 2200);
    }

    function getCurrentUsername() {
        let username = localStorage.getItem('inventraUsername');
        if (!username) {
            let cu = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (cu) username = cu.name;
        }
        return username || 'laptop_user';
    }

    // ========================================
    // TIPS
    // ========================================

    function loadSavedTips() {
        let saved = localStorage.getItem('userTips');
        return saved ? JSON.parse(saved) : [];
    }

    function saveTipsToLocal(tips) {
        localStorage.setItem('userTips', JSON.stringify(tips));
    }

    function displayTipsOnHome() {
        let userTips = loadSavedTips();
        let defaultTips = [
            { title: "🔋 Battery be cryin'?", desc: "Bestie, close those 50 Chrome tabs fr. Lower brightness to 50%. Your battery will thank u. No cap.", author: "proven by 1,234 users" },
            { title: "🧹 Laptop hot like sauna?", desc: "Elevate that thang. Put on a stand or a book. Airflow is everything bestie.", author: "shared by 892 users" },
            { title: "💾 Storage on life support?", desc: "Run Disk Cleanup bestie. Delete those temp files. Periodt.", author: "helpful for 2,156 people" },
            { title: "🐌 Laptop moving slow?", desc: "Restart your laptop bestie. Disable startup apps in Task Manager. FR FR.", author: "fixed for 543 users" }
        ];

        let allTips = [...defaultTips, ...userTips];
        let html = '';
        allTips.slice(0, 5).forEach(tip => {
            html += `
                <div class="tip-item">
                    <div class="tip-title">${escapeHtml(tip.title)}</div>
                    <div class="tip-desc">${escapeHtml(tip.desc)}</div>
                    <div class="tip-by">— ${escapeHtml(tip.author)}</div>
                </div>
            `;
        });
        if ($('#tipContainer').length > 0) $('#tipContainer').html(html);
    }

    function displayMyTips() {
        let tips = loadSavedTips();
        let currentUser = getCurrentUsername();
        let myTips = tips.filter(tip => tip.author === currentUser);

        if ($('#tipCount').length > 0) $('#tipCount').text(myTips.length);
        if ($('#tipBadge').length > 0) $('#tipBadge').text(myTips.length);

        if (myTips.length === 0) {
            if ($('#myTipsList').length > 0) $('#myTipsList').html('<div class="no-tips">✨ No tips shared yet. Add your first tip above!</div>');
            return;
        }

        let html = '';
        for (let i = myTips.length - 1; i >= 0; i--) {
            let tip = myTips[i];
            let origIdx = tips.findIndex(t => t.title === tip.title && t.desc === tip.desc);
            html += `
                <div class="my-tip-card">
                    <div class="my-tip-title">💡 ${escapeHtml(tip.title)}</div>
                    <div class="my-tip-desc">${escapeHtml(tip.desc.substring(0,120))}${tip.desc.length > 120 ? '...' : ''}</div>
                    <div class="my-tip-meta">— shared by ${escapeHtml(tip.author)}</div>
                    <button class="delete-tip-btn" data-id="${origIdx}">🗑️ Delete</button>
                </div>
            `;
        }
        if ($('#myTipsList').length > 0) $('#myTipsList').html(html);

        $('.delete-tip-btn').on('click', function(){
            let id = $(this).data('id');
            if (confirm('Delete this tip?')) {
                let tips = loadSavedTips();
                tips.splice(id, 1);
                saveTipsToLocal(tips);
                displayMyTips();
                displayTipsOnHome();
                showToastMessage('✅ Tip deleted!');
            }
        });
    }

    if ($('#submitTipBtn').length > 0) {
        $('#submitTipBtn').on('click', function(){
            let title  = $('#tipTitle').val().trim();
            let desc   = $('#tipDesc').val().trim();
            let author = $('#tipAuthor').val().trim() || 'Anonymous';

            if (!title || !desc) {
                showToastMessage('Please enter both title and description', true);
                return;
            }

            let tips = loadSavedTips();
            tips.push({ title, desc, author, date: new Date().toISOString() });
            saveTipsToLocal(tips);
            $('#tipTitle').val('');
            $('#tipDesc').val('');
            showToastMessage('✅ Tip shared successfully!');
            displayMyTips();
            displayTipsOnHome();
        });
    }

    if ($('#tipContainer').length > 0) displayTipsOnHome();

    if ($('#myTipsList').length > 0) {
        displayMyTips();
        let savedName = localStorage.getItem('inventraUsername');
        if (savedName) {
            $('#username').text(savedName);
            $('#tipAuthor').val(savedName);
        }

        $('.edit-profile-btn, .edit-profile').on('click', function(){
            let newName = prompt('Enter your username:', $('#username').text());
            if (newName && newName.trim()) {
                let oldName = localStorage.getItem('inventraUsername') || 'laptop_user';
                localStorage.setItem('inventraUsername', newName);
                $('#username').text(newName);
                $('#tipAuthor').val(newName);
                let tips = loadSavedTips().map(t => {
                    if (t.author === oldName) t.author = newName;
                    return t;
                });
                saveTipsToLocal(tips);
                displayMyTips();
                displayTipsOnHome();
                showToastMessage('Profile updated! ✨');
            }
        });
    }

    // ========================================
    // VIDEO LIBRARY
    // ========================================

    const videoLibrary = [
        {
            id: 'fan',
            title: 'Clean laptop fan',
            icon: '🧹',
            channel: 'Tech Repair Pro',
            views: '125K views',
            embed: 'https://www.youtube.com/embed/J1KlRklVGMk',
            tags: ['cleaning','fan','hardware']
        },
        {
            id: 'battery',
            title: 'Extend battery life',
            icon: '🔋',
            channel: 'LaptopCare Tips',
            views: '89K views',
            embed: 'https://www.youtube.com/embed/kTFnGwW2e_Y',
            tags: ['battery','power','tips']
        },
        {
            id: 'virus',
            title: 'Remove virus',
            icon: '🦠',
            channel: 'SecurePC',
            views: '203K views',
            embed: 'https://www.youtube.com/embed/SfdzO0o9604',
            tags: ['virus','security','malware']
        },
        {
            id: 'ram',
            title: 'Upgrade RAM',
            icon: '💾',
            channel: 'PC Upgrade Lab',
            views: '312K views',
            embed: 'https://www.youtube.com/embed/zt7sSPhN7UA',
            tags: ['ram','upgrade','hardware']
        },
        {
            id: 'overheating',
            title: 'Fix overheating',
            icon: '🌡️',
            channel: 'CoolDown Tech',
            views: '178K views',
            embed: 'https://www.youtube.com/embed/FmSAk9qU8dM',
            tags: ['overheating','cooling','thermal']
        },
        {
            id: 'slow',
            title: 'Speed up laptop',
            icon: '🐌',
            channel: 'FastFix IT',
            views: '445K views',
            embed: 'https://www.youtube.com/embed/3CHk0lBidac',
            tags: ['speed','performance','slow']
        }
    ];

    // ── Homepage horizontal video scroll ─────
    if ($('#videoResults').length > 0) {
        let watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '{}');

        let videoHtml = `
            <div class="video-horizontal-scroll">
                <div class="video-scroll-container">
        `;

        for (let video of videoLibrary) {
            let progress = watchHistory[video.id] || 0;
            let progressBar = progress > 0
                ? `<div class="vsc-progress"><div class="vsc-progress-fill" style="width:${progress}%"></div></div>`
                : '';
            let watched = progress >= 90 ? '<span class="vsc-done">✓</span>' : '';
            videoHtml += `
                <div class="video-scroll-card" data-video="${video.id}">
                    <div class="video-scroll-thumb">${video.icon}${watched}</div>
                    <div class="video-scroll-title">${video.title}</div>
                    ${progressBar}
                </div>
            `;
        }

        videoHtml += `
                </div>
            </div>
            <div class="current-video" id="currentVideoDisplay">
                <div class="video-placeholder">🎬 Tap any topic above to watch</div>
            </div>
        `;

        $('#videoResults').html(videoHtml);

        $('.video-scroll-card').on('click', function(){
            let videoId = $(this).data('video');
            let video = videoLibrary.find(v => v.id === videoId);
            if (video) {
                // Highlight selected
                $('.video-scroll-card').removeClass('selected');
                $(this).addClass('selected');

                $('#currentVideoDisplay').html(`
                    <div class="video-title">📺 ${escapeHtml(video.title)}</div>
                    <iframe width="100%" height="180" src="${video.embed}" frameborder="0" allowfullscreen></iframe>
                    <div class="cv-actions">
                        <button class="cv-open-btn" data-vid='${JSON.stringify({id:video.id,title:video.title,embed:video.embed,channel:video.channel,views:video.views,icon:video.icon,tags:video.tags})}'>
                            📺 Open Full Screen
                        </button>
                    </div>
                `);

 $(document).on('click', '.cv-open-btn', function(e){
    e.preventDefault();
    e.stopPropagation();
    let vd = JSON.parse($(this).attr('data-vid'));
    localStorage.setItem('selectedVideo', JSON.stringify(vd));
    console.log('Opening video:', vd.title);
    window.location.href = 'videodetail.html';
});
            }
        });

        $('#searchVideoBtn').on('click', function(){
            let q = $('#videoSearch').val().trim();
            if (q) window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank');
            else showToastMessage('Enter a search term', true);
        });

        $('#videoSearch').on('keypress', function(e){
            if (e.which === 13) $('#searchVideoBtn').click();
        });
    }

    // ── Videos list page (videos.html) ────────
    if ($('#videoListContainer').length > 0) {
        let watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '{}');
        let html = '';

        videoLibrary.forEach(video => {
            let progress = watchHistory[video.id] || 0;
            let progressBar = `
                <div class="video-progress-mini">
                    <div class="video-progress-fill" style="width:${progress}%"></div>
                </div>
            `;
            let watchedBadge = progress >= 90
                ? `<span class="watched-badge">✓ Watched</span>`
                : (progress > 0 ? `<span class="watched-badge partial">${Math.round(progress)}% watched</span>` : '');

            html += `
                <div class="video-item" data-id="${video.id}">
                    <div class="video-thumb">${video.icon}</div>
                    <div class="video-info">
                        <div class="video-title">${escapeHtml(video.title)}</div>
                        <div class="video-channel">${escapeHtml(video.channel)}</div>
                        <div class="video-views">${escapeHtml(video.views)} ${watchedBadge}</div>
                        ${progressBar}
                    </div>
                    <div class="video-arrow">›</div>
                </div>
            `;
        });

        $('#videoListContainer').html(html);

        $(document).on('click', '.video-item', function(){
            let id = $(this).data('id');
            let video = videoLibrary.find(v => v.id === id);
            if (video) {
                localStorage.setItem('selectedVideo', JSON.stringify(video));
                window.location.href = 'videodetail.html';
            }
        });
    }

    // ========================================
    // COMMUNITY PAGE
    // ========================================
    if ($('#newPostBtn').length > 0) {
        $('#newPostBtn').on('click', function(){ window.location.href = 'add-post.html'; });
    }

    $(document).on('click', '.post-reply', function(){
        localStorage.setItem('selectedPostId', $(this).data('id'));
        window.location.href = 'post-detail.html';
    });

    $(document).on('click', '.like-btn', function(){
        let postId = $(this).data('id');
        let likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');

        if (likedPosts.includes(postId)) {
            likedPosts = likedPosts.filter(id => id != postId);
            posts = posts.map(p => { if (p.id == postId) p.likes = (p.likes||0)-1; return p; });
        } else {
            likedPosts.push(postId);
            posts = posts.map(p => { if (p.id == postId) p.likes = (p.likes||0)+1; return p; });
        }

        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        location.reload();
    });

    // ========================================
    // DARK MODE TOGGLE
    // ========================================
    $('#darkModeToggle').on('change', function(){
        if ($(this).is(':checked')) {
            localStorage.setItem('darkMode', 'enabled');
            $('body').addClass('dark-mode');
        } else {
            localStorage.setItem('darkMode', 'disabled');
            $('body').removeClass('dark-mode');
        }
    });

    $('#notifToggle').on('change', function(){
        localStorage.setItem('notifications', $(this).is(':checked') ? 'enabled' : 'disabled');
        if ($(this).is(':checked') && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    });

    $('#defaultRadius').on('change', function(){
        localStorage.setItem('defaultRadius', $(this).val());
    });

    let savedRadius = localStorage.getItem('defaultRadius');
    if (savedRadius && $('#defaultRadius').length > 0) $('#defaultRadius').val(savedRadius);

    $('#clearDataBtn').on('click', function(){
        if (confirm('⚠️ Delete all your tips, saved items, and posts? This cannot be undone.')) {
            localStorage.clear();
            showToastMessage('All data cleared!');
            setTimeout(() => location.reload(), 1500);
        }
    });

    // ========================================
    // LOGOUT
    // ========================================
    $('#logoutBtn').on('click', function(){
        if (confirm('Are you sure you want to logout?')) {
            ['isLoggedIn','currentUser','inventraUsername','userAvatar','avatarType',
             'userImage','rememberedEmail','oldUsername'].forEach(k => localStorage.removeItem(k));
            window.location.href = 'login.html';
        }
    });

    // ========================================
    // ADD-ONS
    // ========================================

    function animateWelcome() {
        if ($('#welcomeCard').length > 0) $('#welcomeCard').hide().fadeIn(600);
    }

    function timeBasedGreeting() {
        if ($('#welcomeText').length > 0) {
            let h = new Date().getHours();
            let g = h < 12 ? "Good morning, tech warrior ☀️"
                   : h < 18 ? "Good afternoon, fixer 🔧"
                   : "Good evening, night hacker 🌙";
            let name = localStorage.getItem('inventraUsername');
            if (name) g += `, ${name}`;
            $('#welcomeText').text(g);
        }
    }

    function checkOfflineStatus() {
        if (!navigator.onLine) showToastMessage("⚠️ You're offline, some features limited", true);
    }

    function autoSaveInputs() {
        $('#contactName, #contactEmail, #contactMessage').on('input', function(){
            localStorage.setItem('draft_' + $(this).attr('id'), $(this).val());
        }).each(function(){
            let v = localStorage.getItem('draft_' + $(this).attr('id'));
            if (v) $(this).val(v);
        });
    }

    function clearDrafts() {
        $('.send-btn, .primary-btn').on('click', function(){
            ['contactName','contactEmail','contactMessage'].forEach(k => localStorage.removeItem('draft_' + k));
        });
    }

    // Watched badge CSS (injected once)
    if (!$('#watchedBadgeStyle').length) {
        $('head').append(`
            <style id="watchedBadgeStyle">
                .watched-badge {
                    background: #e8f5e9; color: #388e3c;
                    font-size: 10px; font-weight: 700;
                    padding: 2px 8px; border-radius: 20px;
                    margin-left: 6px; vertical-align: middle;
                }
                .watched-badge.partial {
                    background: #fff3e0; color: #f57c00;
                }
                .vsc-progress {
                    height: 3px; background: rgba(255,255,255,0.2);
                    border-radius: 10px; margin-top: 6px; overflow: hidden;
                }
                .vsc-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg,#e01a8c,#ff6b9d);
                    border-radius: 10px;
                }
                .vsc-done {
                    position: absolute; top: 4px; right: 4px;
                    background: #4caf50; color: white;
                    border-radius: 50%; width: 18px; height: 18px;
                    font-size: 10px; display: flex;
                    align-items: center; justify-content: center;
                    font-weight: 700;
                }
                .video-scroll-thumb { position: relative; }
                .video-scroll-card.selected {
                    background: #fef0f8 !important;
                    border-color: #e01a8c !important;
                    transform: translateY(-3px) !important;
                }
                .cv-actions { margin-top: 10px; }
                .cv-open-btn {
                    background: linear-gradient(135deg, #e01a8c, #ff6b9d);
                    color: white; border: none;
                    padding: 10px 20px; border-radius: 30px;
                    font-size: 13px; font-weight: 700;
                    cursor: pointer; width: 100%;
                    transition: all 0.2s;
                }
                .cv-open-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(224,26,140,0.35);
                }
            </style>
        `);
    }

    if ($('#tipTitle').length > 0) {
        localStorage.removeItem('draft_tipTitle');
        localStorage.removeItem('draft_tipDesc');
        $('#tipTitle').val('');
        $('#tipDesc').val('');
    }

    animateWelcome();
    timeBasedGreeting();
    checkOfflineStatus();
    autoSaveInputs();
    clearDrafts();

    window.addEventListener('offline', checkOfflineStatus);

});