$(document).ready(function(){

    // ========================================
    // USER AVATAR DATABASE
    // ========================================
    
    const userAvatars = {
        // Default users
        "aiman_tech": "images/minion.jpg",
        "tech_ahlong": "images/monyet.png",
        "lisa_comel": "images/akman.jpeg",
        "demo_user": "images/kema10.jpeg",
        "laptop_user": "images/akman.jpeg",
        // Current logged in user will use their uploaded image or default
    };
    
    function getUserAvatar(username) {
        // Check if user has uploaded image
        let userImage = localStorage.getItem('userImage');
        let avatarType = localStorage.getItem('avatarType');
        
        // If current logged in user
        let currentUser = getCurrentUsername();
        if (username === currentUser) {
            if (avatarType === 'image' && userImage && userImage !== 'null') {
                return userImage;
            }
        }
        
        // Check predefined avatars
        if (userAvatars[username]) {
            return userAvatars[username];
        }
        
        // Random avatar based on username hash
        let avatarsList = ['images/minion.jpg', 'images/monyet.png', 'images/akman.jpeg'];
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = ((hash << 5) - hash) + username.charCodeAt(i);
            hash |= 0;
        }
        let index = Math.abs(hash) % avatarsList.length;
        return avatarsList[index];
    }
    
    // ========================================
    // LOAD POSTS FROM LOCALSTORAGE
    // ========================================
    
    function loadPosts() {
        let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        
        // Sample posts if empty
        if (posts.length === 0) {
            let samplePosts = [
                {
                    id: 1,
                    title: "My laptop suddenly shut down",
                    content: "Any idea why? Happened twice today while browsing Chrome. No overheating.",
                    author: "aiman_tech",
                    time: "2 hours ago",
                    timestamp: Date.now() - 7200000,
                    likes: 23,
                    replies: [{ author: "tech_ahlong", text: "Check your power supply bro" }]
                },
                {
                    id: 2,
                    title: "TIP: How to clean laptop fan without opening",
                    content: "Use compressed air. Blow through the vents. Works like magic!",
                    author: "tech_ahlong",
                    time: "5 hours ago",
                    timestamp: Date.now() - 18000000,
                    likes: 89,
                    replies: [{ author: "newbie", text: "Thanks for the tip!" }]
                },
                {
                    id: 3,
                    title: "Looking for laptop under RM2500 for university",
                    content: "I'm a design student. Need something that can run Adobe software. Any recommendations?",
                    author: "lisa_comel",
                    time: "1 day ago",
                    timestamp: Date.now() - 86400000,
                    likes: 56,
                    replies: []
                }
            ];
            localStorage.setItem('communityPosts', JSON.stringify(samplePosts));
            posts = samplePosts;
        }
        
        displayPosts(posts);
    }
    
    function displayPosts(posts) {
        if (posts.length === 0) {
            $('#postsContainer').html(`
                <div class="no-posts">
                    <div class="no-posts-icon">📝</div>
                    <div class="no-posts-text">No posts yet. Be the first to share!</div>
                    <button class="create-first-post" onclick="window.location.href='addpost.html'">✨ Create First Post</button>
                </div>
            `);
            return;
        }
        
        let html = '';
        for (let post of posts) {
            let replyCount = post.replies ? post.replies.length : 0;
            
            let currentUser = getCurrentUsername();
            let isMyPost = (post.author === currentUser);
            let myPostBadge = isMyPost ? '<span class="my-post-badge">📌 My Post</span>' : '';
            
            // Get user avatar
            let avatarUrl = getUserAvatar(post.author);
            
            html += `
                <div class="post-card" data-id="${post.id}">
                    <div class="post-header">
                        <div class="poster-info">
                            <div class="poster-avatar">
                                <img src="${avatarUrl}" alt="${escapeHtml(post.author)}" class="avatar-img" onerror="this.src='images/akman.jpeg'">
                            </div>
                            <div class="poster-details">
                                <div class="poster-name">${escapeHtml(post.author)} ${myPostBadge}</div>
                                <div class="post-time">${escapeHtml(post.time)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="post-title">${escapeHtml(post.title)}</div>
                    <div class="post-content">${escapeHtml(post.content.substring(0, 150))}${post.content.length > 150 ? '...' : ''}</div>
                    <div class="post-stats">
                        <span class="like-btn" data-id="${post.id}">❤️ ${post.likes} likes</span>
                        <span>💬 ${replyCount} replies</span>
                    </div>
                    <div class="post-reply" data-id="${post.id}">View discussion →</div>
                </div>
            `;
        }
        
        $('#postsContainer').html(html);
        
        // View post detail
        $('.post-reply').on('click', function(e) {
            e.stopPropagation();
            let postId = $(this).data('id');
            localStorage.setItem('selectedPostId', postId);
            window.location.href = 'postdetail.html';
        });
        
        $('.post-card').on('click', function() {
            let postId = $(this).data('id');
            localStorage.setItem('selectedPostId', postId);
            window.location.href = 'postdetail.html';
        });
        
        // Like button
        $('.like-btn').on('click', function(e) {
            e.stopPropagation();
            let postId = $(this).data('id');
            let currentUser = getCurrentUsername();
            
            let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
            let post = posts.find(p => p.id == postId);
            let userLikes = JSON.parse(localStorage.getItem('postUserLikes') || '{}');
            
            if (post) {
                if (userLikes[currentUser] && userLikes[currentUser].includes(postId)) {
                    post.likes = (post.likes || 0) - 1;
                    userLikes[currentUser] = userLikes[currentUser].filter(id => id != postId);
                    $(this).html(`❤️ ${post.likes} likes`);
                } else {
                    post.likes = (post.likes || 0) + 1;
                    if (!userLikes[currentUser]) userLikes[currentUser] = [];
                    userLikes[currentUser].push(postId);
                    $(this).html(`❤️ ${post.likes} likes`);
                }
                
                localStorage.setItem('communityPosts', JSON.stringify(posts));
                localStorage.setItem('postUserLikes', JSON.stringify(userLikes));
            }
        });
    }
    
    function getCurrentUsername() {
        let username = localStorage.getItem('inventraUsername');
        if (!username) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                username = currentUser.name || currentUser.email;
            }
        }
        if (!username) {
            username = 'laptop_user';
        }
        return username;
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    $('#newPostBtn').on('click', function() {
        window.location.href = 'addpost.html';
    });
    
    $('.filter-tab').on('click', function() {
        $('.filter-tab').removeClass('active');
        $(this).addClass('active');
        
        let filter = $(this).text().toLowerCase();
        let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        let currentUsername = getCurrentUsername();
        
        if (filter === 'latest') {
            posts.sort((a, b) => (b.timestamp || b.id) - (a.timestamp || a.id));
        } else if (filter === 'trending') {
            posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else if (filter === 'my posts') {
            posts = posts.filter(p => p.author === currentUsername);
        }
        
        displayPosts(posts);
    });
    
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            let activeFilter = $('.filter-tab.active').text().toLowerCase();
            if (activeFilter === 'latest') {
                $('.filter-tab.active').click();
            } else {
                loadPosts();
            }
        }
    });
    
    loadPosts();
    
});