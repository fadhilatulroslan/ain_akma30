$(document).ready(function(){

    let postId = localStorage.getItem('selectedPostId');
    let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    let post = posts.find(p => p.id == postId);
    
    if (post) {
        let repliesHtml = '';
        if (post.replies && post.replies.length > 0) {
            for (let reply of post.replies) {
                repliesHtml += `
                    <div class="reply-item">
                        <div class="reply-author">👤 ${escapeHtml(reply.author)}</div>
                        <div class="reply-text">${escapeHtml(reply.text)}</div>
                    </div>
                `;
            }
        } else {
            repliesHtml = '<div class="no-replies">No replies yet. Be the first to comment!</div>';
        }
        
        // GUNA CLASS YANG SAMA DENGAN COMMUNITY PAGE
        $('#postDetail').html(`
            <div class="post-card" data-id="${post.id}">
                <div class="post-header">
                    <div class="poster-name">👤 ${escapeHtml(post.author)}</div>
                    <div class="post-time">${escapeHtml(post.time)}</div>
                </div>
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-content">${escapeHtml(post.content)}</div>
                <div class="post-stats">
                    <span class="like-btn">❤️ ${post.likes} likes</span>
                    <span>💬 ${post.replies ? post.replies.length : 0} replies</span>
                </div>
            </div>
            <div class="replies-section">
                <h4>💬 Replies (${post.replies ? post.replies.length : 0})</h4>
                <div id="repliesList">${repliesHtml}</div>
            </div>
        `);
    } else {
        $('#postDetail').html('<div class="error-card">Post not found. <a href="community.html">Go back</a></div>');
    }
    
    // Submit reply
    $('#submitReplyBtn').on('click', function() {
        let replyText = $('#replyText').val().trim();
        if (!replyText) {
            alert('Please enter a reply');
            return;
        }
        
        let username = localStorage.getItem('inventraUsername') || 'Anonymous';
        let newReply = { author: username, text: replyText };
        
        posts = posts.map(p => {
            if (p.id == postId) {
                p.replies = p.replies || [];
                p.replies.push(newReply);
            }
            return p;
        });
        
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        alert('✅ Reply posted!');
        location.reload();
    });
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
});