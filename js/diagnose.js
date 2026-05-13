import { GoogleGenerativeAI }
from "https://esm.run/@google/generative-ai";

// ========================================
// API KEY
// ========================================

const API_KEY =
"AIzaSyANfwUc5QEfBtvXf9bRHGxSTqzXfdbaK2Q";

let genAI = null;
let model = null;
let aiReady = false;
let currentImageData = null;

// ========================================
// CHAT MEMORY
// ========================================

let chatHistory = [];
let isChatMode = false;

function addToHistory(role, text) {
    chatHistory.push({ role, text });

    if (chatHistory.length > 12) {
        chatHistory.shift();
    }
}

function buildChatPrompt(userInput) {

    let historyText = "";

    chatHistory.forEach(msg => {
        historyText += `${msg.role}: ${msg.text}\n`;
    });

    return `
You are Fixora AI, a laptop repair assistant.

You are a conversational AI. Continue the conversation naturally.

Conversation history:
${historyText}

User: ${userInput}

Rules:
- Be natural like chat AI
- Ask follow-up questions
- Keep answers short and helpful
- Never end conversation abruptly

AI:
`;
}

// ========================================
// READY
// ========================================

$(document).ready(function () {

    // ========================================
    // INITIALIZE AI
    // ========================================

    async function initGemini() {

        try {

            $('#aiStatus').html(`● Connecting AI...`);

            genAI = new GoogleGenerativeAI(API_KEY);

            model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash"
            });

            // ❌ REMOVED: generateContent("hello")
            // reason: causes random init failure

            aiReady = true;

            $('#aiStatus').html(`● AI Ready`);

            console.log("AI Ready ✔");

        } catch (error) {

            console.error("Init error:", error);

            aiReady = false;

            $('#aiStatus').html(`● AI Failed`);

            // 🔁 auto retry (IMPORTANT FIX)
            setTimeout(initGemini, 3000);
        }
    }

    initGemini();

    // ========================================
    // IMAGE UPLOAD
    // ========================================

    $('#uploadArea').on('click', function () {
        $('#imageUpload').click();
    });

    const uploadArea = document.getElementById('uploadArea');

    if (uploadArea) {

        uploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            $('#uploadArea').addClass('drag-over');
        });

        uploadArea.addEventListener('dragleave', function () {
            $('#uploadArea').removeClass('drag-over');
        });

        uploadArea.addEventListener('drop', function (e) {

            e.preventDefault();
            $('#uploadArea').removeClass('drag-over');

            const file = e.dataTransfer.files[0];

            if (file && file.type.startsWith('image/')) {
                processImage(file);
            } else {
                alert('Please upload image only');
            }
        });
    }

    $('#imageUpload').on('change', function (e) {
        const file = e.target.files[0];
        if (file) processImage(file);
    });

    function processImage(file) {

        if (file.size > 2 * 1024 * 1024) {
            alert('Image too large! Max 2MB');
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            currentImageData =
                event.target.result.split(',')[1];

            $('#imagePreview')
                .attr('src', event.target.result)
                .show();

            $('#imagePreviewContainer').show();
            $('#uploadText').hide();
        };

        reader.readAsDataURL(file);
    }

    $('#removeImage').on('click', function () {

        currentImageData = null;

        $('#imagePreview').attr('src', '').hide();
        $('#imagePreviewContainer').hide();
        $('#uploadText').show();

        $('#imageUpload').val('');
    });

    // ========================================
    // QUICK CHIPS
    // ========================================

    $('.problem-chip').on('click', function () {

        const problem = $(this).data('problem');

        $('#problemInput').val(problem).focus();
    });

    // ========================================
    // MAIN CHAT DIAGNOSE
    // ========================================

    $('#diagnoseBtn').on('click', async function () {

        const problem = $('#problemInput').val().trim();

        if (!problem && !currentImageData) {
            alert('Please describe problem or upload image');
            return;
        }

        if (!aiReady || !model) {
            alert('AI not ready yet');
            return;
        }

        $('#loadingState').show();
        $('#resultCard').hide();

        $('#diagnoseBtn').prop('disabled', true);

        try {

            const prompt = buildChatPrompt(
                problem || "check image"
            );

            let result;

            if (currentImageData) {

                result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: currentImageData
                        }
                    }
                ]);

            } else {

                result = await model.generateContent(prompt);
            }

            const response = await result.response;
            const text = response.text();

            addToHistory("User", problem);
            addToHistory("AI", text);

            isChatMode = true;

            $('#resultContent').html(
                text.replace(/\n/g, '<br>')
            );

            $('#resultCard').show();

        } catch (error) {

            console.error(error);

            $('#resultContent').html(`
                <div style="color:red;">
                    ⚠️ Error: ${error.message}
                </div>
            `);

            $('#resultCard').show();

        } finally {

            $('#loadingState').hide();
            $('#diagnoseBtn').prop('disabled', false);
        }
    });

    // ========================================
    // ENTER KEY
    // ========================================

    $('#problemInput').on('keypress', function (e) {

        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            $('#diagnoseBtn').click();
        }
    });

    // ========================================
    // FOLLOW UP CHAT
    // ========================================

    $(document).on('keydown', function (e) {

        if (e.altKey && e.key === "Enter") {

            let followUp = prompt("Ask follow-up question:");

            if (followUp) sendFollowUp(followUp);
        }
    });

    async function sendFollowUp(message) {

        if (!aiReady || !model) return;

        try {

            $('#loadingState').show();

            const prompt = buildChatPrompt(message);

            let result = await model.generateContent(prompt);
            let response = await result.response;
            let text = response.text();

            addToHistory("User", message);
            addToHistory("AI", text);

            $('#resultContent').html(
                text.replace(/\n/g, '<br>')
            );

            $('#resultCard').show();

        } catch (err) {
            console.error(err);
        }

        finally {
            $('#loadingState').hide();
        }
    }

});