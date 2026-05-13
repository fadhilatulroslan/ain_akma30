$(document).ready(function(){

    let tip = JSON.parse(localStorage.getItem('selectedTip'));
    
    if (tip) {
        // Update views count
        let views = localStorage.getItem(`view_${tip.title}`) || 0;
        views = parseInt(views) + 1;
        localStorage.setItem(`view_${tip.title}`, views);
        
        // Get saved count
        let savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]');
        let isSaved = savedTips.some(t => t.title === tip.title);
        let saveCount = savedTips.filter(t => t.title === tip.title).length;
        
        // Display tip content with enhanced design
        $('#tipDetail').html(`
            <div class="tip-content-card">
                <div class="tip-title-large">${tip.title}</div>
                <div class="tip-description">${tip.desc}</div>
                <div class="tip-author-badge">
                    <span>✍️</span> ${tip.author}
                </div>
            </div>
        `);
        
        // Show stats and update
        $('#tipStats').show();
        $('#saveCount').text(saveCount > 0 ? saveCount : Math.floor(Math.random() * 50) + 10);
        $('#viewCount').text(views);
        $('#helpCount').text(Math.floor(Math.random() * 100) + 20);
        
        // Change save button text if already saved
        if (isSaved) {
            $('#saveTipBtn').html('✅ Saved').css('opacity', '0.7');
        }
        
    } else {
        $('#tipDetail').html(`
            <div class="tip-content-card" style="text-align:center;">
                <div class="error-icon">😔</div>
                <div class="error-text">No tip selected.</div>
                <a href="tips.html" class="back-link-enhanced">Go back to Tips</a>
            </div>
        `);
        $('.action-buttons-enhanced').hide();
        $('#tipStats').hide();
    }
    
    // Save tip button
    $('#saveTipBtn').on('click', function() {
        let savedTips = JSON.parse(localStorage.getItem('savedTips') || '[]');
        if (!savedTips.some(t => t.title === tip.title)) {
            savedTips.push(tip);
            localStorage.setItem('savedTips', JSON.stringify(savedTips));
            $(this).html('✅ Saved').css('opacity', '0.7');
            
            // Update save count
            let newCount = savedTips.filter(t => t.title === tip.title).length;
            $('#saveCount').text(newCount);
            
            alert('✅ Tip saved to your collection!');
        } else {
            alert('⚠️ This tip is already saved');
        }
    });
    
    // Share tip button
    $('#shareTipBtn').on('click', function() {
        if (navigator.share) {
            navigator.share({
                title: tip.title,
                text: tip.desc,
                url: window.location.href
            }).catch(() => alert('📤 Share this tip with friends!'));
        } else {
            alert('📤 Share this tip with friends!\n\n' + tip.title + '\n' + tip.desc);
        }
    });
    
});