$(document).ready(function(){

    function loadSavedTips() {
        let savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]');
        
        if (savedTips.length === 0) {
            $('#savedList').html(`
                <div class="empty-saved">
                    <div class="empty-icon">🔖</div>
                    <div class="empty-text">No saved tips yet</div>
                    <div class="empty-sub">Go to All Tips and save your favorite ones!</div>
                    <a href="tips.html" class="empty-btn">Browse Tips →</a>
                </div>
            `);
            $('#clearAllBtn').hide();
            return;
        }
        
        let html = '';
        for (let i = 0; i < savedTips.length; i++) {
            let tip = savedTips[i];
            html += `
                <div class="saved-card" data-index="${i}">
                    <div class="saved-card-icon">💡</div>
                    <div class="saved-card-content">
                        <div class="saved-card-title">${tip.title}</div>
                        <div class="saved-card-desc">${tip.desc.substring(0, 80)}${tip.desc.length > 80 ? '...' : ''}</div>
                        <div class="saved-card-author">— ${tip.author}</div>
                    </div>
                    <button class="remove-saved-btn" data-index="${i}">🗑️</button>
                </div>
            `;
        }
        
        $('#savedList').html(html);
        $('#clearAllBtn').show();
        
        // Click to view tip detail
        $('.saved-card').on('click', function(e) {
            if ($(e.target).hasClass('remove-saved-btn')) return;
            let index = $(this).data('index');
            let savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]');
            localStorage.setItem('selectedTip', JSON.stringify(savedTips[index]));
            window.location.href = 'tipdetail.html';
        });
        
        // Remove individual saved tip
        $('.remove-saved-btn').on('click', function(e) {
            e.stopPropagation();
            let index = $(this).data('index');
            let savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]');
            let removedTip = savedTips[index];
            savedTips.splice(index, 1);
            localStorage.setItem('savedTips', JSON.stringify(savedTips));
            loadSavedTips();
            alert(`✅ "${removedTip.title}" removed from saved`);
        });
    }
    
    // Clear all saved tips
    $('#clearAllBtn').on('click', function() {
        if (confirm('⚠️ Delete ALL saved tips? This cannot be undone.')) {
            localStorage.removeItem('savedTips');
            loadSavedTips();
            alert('✅ All saved tips cleared');
        }
    });
    
    loadSavedTips();
    
});