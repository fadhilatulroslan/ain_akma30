$(document).ready(function(){

    let allTipsData = [];
    let currentFilter = 'latest'; // latest, popular
    let itemsPerPage = 10;
    let currentPage = 1;

    // ========================================
    // LOAD ALL TIPS
    // ========================================
    
    function loadAllTips() {
        let userTips = JSON.parse(localStorage.getItem('userTips') || '[]');
        
        let defaultTips = [
            { id: 1, title: "🔋 Battery be cryin'?", desc: "Bestie, close those 50 Chrome tabs fr. Lower brightness to 50%. Your battery will thank u. No cap.", author: "proven by 1,234 users", likes: 1234, helpful: 892 },
            { id: 2, title: "🧹 Laptop hot like sauna?", desc: "Elevate that thang. Put on a stand or a book. Airflow is everything bestie.", author: "shared by 892 users", likes: 892, helpful: 645 },
            { id: 3, title: "💾 Storage on life support?", desc: "Run Disk Cleanup bestie. Delete those temp files. Periodt.", author: "helpful for 2,156 people", likes: 2156, helpful: 1432 },
            { id: 4, title: "🐌 Laptop moving slow?", desc: "Restart your laptop bestie. Disable startup apps in Task Manager. FR FR.", author: "fixed for 543 users", likes: 543, helpful: 321 },
            { id: 5, title: "🖥️ Screen flickering?", desc: "Update your graphic driver from Device Manager. Most of the time this fixes it.", author: "tech support", likes: 789, helpful: 456 },
            { id: 6, title: "🔊 No sound?", desc: "Check if muted. Update audio driver. Check headphone connection.", author: "helped 321 users", likes: 321, helpful: 234 },
            { id: 7, title: "📶 WiFi keeps disconnecting?", desc: "Device Manager > Network Adapters > Power Management > Uncheck 'Allow to turn off'.", author: "works for 678 users", likes: 678, helpful: 512 }
        ];
        
        // Load likes from localStorage
        let tipLikes = JSON.parse(localStorage.getItem('tipLikes') || '{}');
        let tipHelpful = JSON.parse(localStorage.getItem('tipHelpful') || '{}');
        let userTipActions = JSON.parse(localStorage.getItem('userTipActions') || '{}');
        
        let currentUser = getCurrentUsername();
        
        // Combine default + user tips with IDs
        let nextId = defaultTips.length + 1;
        let userTipsWithIds = userTips.map((tip, index) => ({
            id: nextId + index,
            title: tip.title,
            desc: tip.desc,
            author: tip.author,
            likes: tipLikes[`tip_${nextId + index}`] || 0,
            helpful: tipHelpful[`tip_${nextId + index}`] || 0,
            isUserTip: true
        }));
        
        allTipsData = [...defaultTips, ...userTipsWithIds];
        
        // Load user actions
        for (let tip of allTipsData) {
            tip.userLiked = userTipActions[currentUser]?.liked?.includes(tip.id) || false;
            tip.userHelpful = userTipActions[currentUser]?.helpful?.includes(tip.id) || false;
            // Load saved counts
            tip.likes = tipLikes[`tip_${tip.id}`] || tip.likes || 0;
            tip.helpful = tipHelpful[`tip_${tip.id}`] || tip.helpful || 0;
        }
        
        displayTips();
    }
    
    function getCurrentUsername() {
        let username = localStorage.getItem('inventraUsername');
        if (!username) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) username = currentUser.name;
        }
        return username || 'guest';
    }
    
    function displayTips() {
        let tipsToShow = [...allTipsData];
        
        // Sort
        if (currentFilter === 'popular') {
            tipsToShow.sort((a, b) => b.likes - a.likes);
        } else {
            tipsToShow.sort((a, b) => b.id - a.id);
        }
        
        // Pagination
        let totalPages = Math.ceil(tipsToShow.length / itemsPerPage);
        let start = (currentPage - 1) * itemsPerPage;
        let paginatedTips = tipsToShow.slice(start, start + itemsPerPage);
        
        $('#tipCountDisplay').html(`📊 ${allTipsData.length} tips available • <span class="filter-btn ${currentFilter === 'latest' ? 'active' : ''}" data-filter="latest">Latest</span> • <span class="filter-btn ${currentFilter === 'popular' ? 'active' : ''}" data-filter="popular">Most Helpful</span>`);
        
        if (allTipsData.length === 0) {
            $('#allTipsList').html(`
                <div class="no-results">
                    <div class="no-results-icon">💡</div>
                    <div class="no-results-text">No tips yet. Add your first tip in Profile!</div>
                </div>
            `);
            return;
        }
        
        let html = '';
        for (let tip of paginatedTips) {
            let likeIcon = tip.userLiked ? '❤️' : '🤍';
            let helpfulIcon = tip.userHelpful ? '👍' : '👎';
            
            html += `
                <div class="tip-card-enhanced" data-id="${tip.id}">
                    <div class="tip-card-header">
                        <div class="tip-title-enhanced">${tip.title}</div>
                        <div class="tip-actions">
                            <button class="tip-like-btn ${tip.userLiked ? 'liked' : ''}" data-id="${tip.id}">
                                ${likeIcon} <span class="like-count">${tip.likes}</span>
                            </button>
                            <button class="tip-helpful-btn ${tip.userHelpful ? 'helpful' : ''}" data-id="${tip.id}">
                                ${helpfulIcon} <span class="helpful-count">${tip.helpful}</span>
                            </button>
                        </div>
                    </div>
                    <div class="tip-desc-enhanced">${tip.desc}</div>
                    <div class="tip-footer-enhanced">
                        <span class="tip-author">— ${tip.author}</span>
                        <button class="tip-share-btn" data-title="${tip.title}" data-desc="${tip.desc}">📤 Share</button>
                    </div>
                </div>
            `;
        }
        
        $('#allTipsList').html(html);
        
        // Pagination controls
        if (totalPages > 1) {
            let paginationHtml = '<div class="pagination">';
            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            paginationHtml += '</div>';
            $('#allTipsList').append(paginationHtml);
            
            $('.page-btn').on('click', function() {
                currentPage = $(this).data('page');
                displayTips();
                $('html, body').animate({ scrollTop: 0 }, 300);
            });
        }
        
        // Bind like button events
        $('.tip-like-btn').on('click', function(e) {
            e.stopPropagation();
            let tipId = $(this).data('id');
            let currentUser = getCurrentUsername();
            let tip = allTipsData.find(t => t.id === tipId);
            
            if (tip) {
                let userTipActions = JSON.parse(localStorage.getItem('userTipActions') || '{}');
                let tipLikes = JSON.parse(localStorage.getItem('tipLikes') || '{}');
                
                if (tip.userLiked) {
                    // Unlike
                    tip.likes--;
                    tip.userLiked = false;
                    userTipActions[currentUser] = userTipActions[currentUser] || {};
                    userTipActions[currentUser].liked = (userTipActions[currentUser].liked || []).filter(id => id !== tipId);
                } else {
                    // Like
                    tip.likes++;
                    tip.userLiked = true;
                    userTipActions[currentUser] = userTipActions[currentUser] || {};
                    userTipActions[currentUser].liked = [...(userTipActions[currentUser].liked || []), tipId];
                }
                
                tipLikes[`tip_${tipId}`] = tip.likes;
                localStorage.setItem('tipLikes', JSON.stringify(tipLikes));
                localStorage.setItem('userTipActions', JSON.stringify(userTipActions));
                
                // Update button
                let newLikeIcon = tip.userLiked ? '❤️' : '🤍';
                $(this).html(`${newLikeIcon} <span class="like-count">${tip.likes}</span>`);
                $(this).toggleClass('liked');
                
                // Show toast
                showToast(tip.userLiked ? '👍 You liked this tip!' : '👎 You removed your like', '#4caf50');
            }
        });
        
        // Bind helpful button events
        $('.tip-helpful-btn').on('click', function(e) {
            e.stopPropagation();
            let tipId = $(this).data('id');
            let currentUser = getCurrentUsername();
            let tip = allTipsData.find(t => t.id === tipId);
            
            if (tip) {
                let userTipActions = JSON.parse(localStorage.getItem('userTipActions') || '{}');
                let tipHelpful = JSON.parse(localStorage.getItem('tipHelpful') || '{}');
                
                if (tip.userHelpful) {
                    // Unhelpful
                    tip.helpful--;
                    tip.userHelpful = false;
                    userTipActions[currentUser] = userTipActions[currentUser] || {};
                    userTipActions[currentUser].helpful = (userTipActions[currentUser].helpful || []).filter(id => id !== tipId);
                } else {
                    // Helpful
                    tip.helpful++;
                    tip.userHelpful = true;
                    userTipActions[currentUser] = userTipActions[currentUser] || {};
                    userTipActions[currentUser].helpful = [...(userTipActions[currentUser].helpful || []), tipId];
                }
                
                tipHelpful[`tip_${tipId}`] = tip.helpful;
                localStorage.setItem('tipHelpful', JSON.stringify(tipHelpful));
                localStorage.setItem('userTipActions', JSON.stringify(userTipActions));
                
                // Update button
                let newHelpfulIcon = tip.userHelpful ? '👍' : '👎';
                $(this).html(`${newHelpfulIcon} <span class="helpful-count">${tip.helpful}</span>`);
                $(this).toggleClass('helpful');
                
                showToast(tip.userHelpful ? '✅ You found this helpful!' : '😔 You marked as not helpful', '#ff9800');
            }
        });
        
        // Bind share button events
        $('.tip-share-btn').on('click', function(e) {
            e.stopPropagation();
            let title = $(this).data('title');
            let desc = $(this).data('desc');
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: desc,
                    url: window.location.href
                }).catch(() => copyToClipboard(`${title}\n\n${desc}`));
            } else {
                copyToClipboard(`${title}\n\n${desc}`);
            }
        });
        
        // Click on tip card to view detail
        $('.tip-card-enhanced').on('click', function(e) {
            if ($(e.target).is('button')) return;
            let tipId = $(this).data('id');
            let selectedTip = allTipsData.find(t => t.id === tipId);
            localStorage.setItem('selectedTip', JSON.stringify(selectedTip));
            window.location.href = 'tipdetail.html';
        });
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text);
        showToast('📋 Copied to clipboard!', '#4caf50');
    }
    
    function showToast(message, color) {
        $('.custom-toast').remove();
        let toast = $(`<div class="custom-toast" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:${color};color:white;padding:10px 20px;border-radius:25px;font-size:13px;z-index:1000;box-shadow:0 4px 12px rgba(0,0,0,0.2);">${message}</div>`);
        $('body').append(toast);
        setTimeout(() => toast.fadeOut(300, function() { $(this).remove(); }), 2000);
    }
    
    // ========================================
    // SEARCH TIPS
    // ========================================
    
    $('#searchTipsInput').on('keyup', function() {
        let searchTerm = $(this).val().toLowerCase();
        currentPage = 1;
        
        if (searchTerm === '') {
            displayTips();
            return;
        }
        
        let filteredTips = allTipsData.filter(tip => 
            tip.title.toLowerCase().indexOf(searchTerm) > -1 ||
            tip.desc.toLowerCase().indexOf(searchTerm) > -1 ||
            tip.author.toLowerCase().indexOf(searchTerm) > -1
        );
        
        let totalPages = Math.ceil(filteredTips.length / itemsPerPage);
        let start = (currentPage - 1) * itemsPerPage;
        let paginatedTips = filteredTips.slice(start, start + itemsPerPage);
        
        $('#tipCountDisplay').html(`🔍 ${filteredTips.length} tips found for "${searchTerm}"`);
        
        if (filteredTips.length === 0) {
            $('#allTipsList').html(`
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <div class="no-results-text">No tips found for "${searchTerm}"</div>
                </div>
            `);
            return;
        }
        
        let html = '';
        for (let tip of paginatedTips) {
            let likeIcon = tip.userLiked ? '❤️' : '🤍';
            let helpfulIcon = tip.userHelpful ? '👍' : '👎';
            
            html += `
                <div class="tip-card-enhanced" data-id="${tip.id}">
                    <div class="tip-card-header">
                        <div class="tip-title-enhanced">${tip.title}</div>
                        <div class="tip-actions">
                            <button class="tip-like-btn ${tip.userLiked ? 'liked' : ''}" data-id="${tip.id}">
                                ${likeIcon} <span class="like-count">${tip.likes}</span>
                            </button>
                            <button class="tip-helpful-btn ${tip.userHelpful ? 'helpful' : ''}" data-id="${tip.id}">
                                ${helpfulIcon} <span class="helpful-count">${tip.helpful}</span>
                            </button>
                        </div>
                    </div>
                    <div class="tip-desc-enhanced">${tip.desc}</div>
                    <div class="tip-footer-enhanced">
                        <span class="tip-author">— ${tip.author}</span>
                        <button class="tip-share-btn" data-title="${tip.title}" data-desc="${tip.desc}">📤 Share</button>
                    </div>
                </div>
            `;
        }
        
        $('#allTipsList').html(html);
        rebindEvents();
    });
    
    // Filter click
    $(document).on('click', '.filter-btn', function() {
        currentFilter = $(this).data('filter');
        currentPage = 1;
        displayTips();
    });
    
    function rebindEvents() {
        $('.tip-like-btn').on('click', function(e) { e.stopPropagation(); /* like logic */ });
        $('.tip-helpful-btn').on('click', function(e) { e.stopPropagation(); /* helpful logic */ });
        $('.tip-share-btn').on('click', function(e) { e.stopPropagation(); /* share logic */ });
        $('.tip-card-enhanced').on('click', function(e) { if ($(e.target).is('button')) return; /* detail logic */ });
    }
    
    loadAllTips();
    
});