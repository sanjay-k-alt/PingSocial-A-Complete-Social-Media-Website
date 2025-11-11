// Common JavaScript for all pages

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLoginSignup();
    initializeCommonInteractions();
});

// Navigation functionality
function initializeNavigation() {
    // Set active nav item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navIcons = document.querySelectorAll('.nav-icon');
    
    navIcons.forEach(icon => {
        const href = icon.getAttribute('href');
        if (href === currentPage) {
            icon.classList.add('active');
        }
    });
    
    // Logout functionality
    const logoutIcons = document.querySelectorAll('.logout-icon');
    logoutIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    });
}

// Login/Signup functionality
function initializeLoginSignup() {
    const showSignupLink = document.getElementById('show-signup-link');
    const showLoginLink = document.getElementById('show-login-link');
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    
    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginContainer.classList.add('hidden');
            signupContainer.classList.remove('hidden');
        });
        
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            signupContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
        });
    }
    
    // Form validation
    const loginForm = document.querySelector('#login-container form');
    const signupForm = document.querySelector('#signup-container form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            if (!validateLoginForm(this)) {
                e.preventDefault();
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            if (!validateSignupForm(this)) {
                e.preventDefault();
            }
        });
    }
}

// Form validation
function validateLoginForm(form) {
    const email = form.querySelector('#login-email').value;
    const password = form.querySelector('#login-password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

function validateSignupForm(form) {
    const name = form.querySelector('#signup-name').value;
    const email = form.querySelector('#signup-email').value;
    const password = form.querySelector('#signup-password').value;
    
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Common interactions
function initializeCommonInteractions() {
    // Friend request buttons
    const confirmButtons = document.querySelectorAll('.friend-card.request .btn-primary');
    const deleteButtons = document.querySelectorAll('.friend-card.request .btn-secondary');
    
    confirmButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.friend-card');
            const name = card.querySelector('h4').textContent;
            confirmFriendRequest(card, name);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.friend-card');
            const name = card.querySelector('h4').textContent;
            deleteFriendRequest(card, name);
        });
    });
    
    // Add friend buttons
    const addFriendButtons = document.querySelectorAll('.add-friend-btn');
    addFriendButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            sendFriendRequest(this, name);
        });
    });
    
    // Like buttons
    const likeButtons = document.querySelectorAll('.footer-action, .like-btn');
    likeButtons.forEach(button => {
        if (button.textContent.includes('Like') || button.querySelector('.fa-thumbs-up')) {
            button.addEventListener('click', function() {
                toggleLike(this);
            });
        }
    });
    
    // Comment buttons
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleCommentSection(this);
        });
    });
    
    // Send comment buttons
    const sendCommentButtons = document.querySelectorAll('.comment-send-btn');
    sendCommentButtons.forEach(button => {
        button.addEventListener('click', function() {
            sendComment(this);
        });
    });
    
    // Enter key for comment input
    const commentInputs = document.querySelectorAll('.comment-input');
    commentInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendComment(this.nextElementSibling);
            }
        });
    });
}

// Friend request functions
function confirmFriendRequest(card, name) {
    card.style.opacity = '0.5';
    setTimeout(() => {
        card.remove();
        showNotification(`You are now friends with ${name}`, 'success');
    }, 500);
}

function deleteFriendRequest(card, name) {
    card.style.opacity = '0.5';
    setTimeout(() => {
        card.remove();
        showNotification(`Friend request from ${name} deleted`, 'info');
    }, 500);
}

function sendFriendRequest(button, name) {
    const originalText = button.textContent;
    button.textContent = 'Request Sent';
    button.disabled = true;
    button.style.background = '#65676b';
    
    showNotification(`Friend request sent to ${name}`, 'success');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.background = '';
    }, 3000);
}

// Like functionality
function toggleLike(button) {
    const likeCount = button.querySelector('.like-count');
    const icon = button.querySelector('i');
    
    if (icon.classList.contains('far')) {
        // Unlike to Like
        icon.classList.remove('far');
        icon.classList.add('fas');
        if (likeCount) {
            const currentCount = parseInt(likeCount.textContent) || 0;
            likeCount.textContent = currentCount + 1;
        }
        showNotification('Post liked', 'success');
    } else {
        // Like to Unlike
        icon.classList.remove('fas');
        icon.classList.add('far');
        if (likeCount) {
            const currentCount = parseInt(likeCount.textContent) || 1;
            likeCount.textContent = currentCount - 1;
        }
        showNotification('Post unliked', 'info');
    }
}

// Comment functionality
function toggleCommentSection(button) {
    const post = button.closest('.feed-post, .post-card');
    const commentSection = post.querySelector('.comment-section');
    
    if (commentSection.style.display === 'none' || !commentSection.style.display) {
        commentSection.style.display = 'block';
        commentSection.querySelector('.comment-input').focus();
    } else {
        commentSection.style.display = 'none';
    }
}

function sendComment(button) {
    const commentSection = button.closest('.comment-section');
    const input = commentSection.querySelector('.comment-input');
    const commentsList = commentSection.querySelector('.comments-list');
    
    if (input.value.trim() === '') {
        input.focus();
        return;
    }
    
    // Create new comment
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.innerHTML = `
        <img src="images/profile.jpeg" class="profile-pic">
        <p><strong>You</strong> ${input.value}</p>
    `;
    
    commentsList.appendChild(newComment);
    input.value = '';
    
    showNotification('Comment added', 'success');
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Messages page functionality
function initializeMessages() {
    const conversations = document.querySelectorAll('.conversation');
    const chatWindow = document.querySelector('.chat-window');
    const backButton = document.querySelector('.back-button');
    
    if (conversations.length > 0 && chatWindow) {
        conversations.forEach(conversation => {
            conversation.addEventListener('click', function() {
                // Set active conversation
                conversations.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                // Update chat header
                const userName = this.querySelector('strong').textContent;
                const userImg = this.querySelector('img').src;
                
                chatWindow.querySelector('.chat-header h3').textContent = userName;
                chatWindow.querySelector('.chat-header img').src = userImg;
                
                // Show chat window on mobile
                if (window.innerWidth <= 1024) {
                    document.querySelector('.conversations-list').style.display = 'none';
                    chatWindow.style.display = 'flex';
                }
            });
        });
        
        // Back button for mobile
        if (backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                chatWindow.style.display = 'none';
                document.querySelector('.conversations-list').style.display = 'block';
            });
        }
        
        // Send message functionality
        const sendBtn = document.querySelector('.send-btn');
        const messageInput = document.querySelector('.chat-footer input');
        
        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
}

function sendMessage() {
    const input = document.querySelector('.chat-footer input');
    const chatBody = document.querySelector('.chat-body');
    
    if (input.value.trim() === '') return;
    
    // Create new message
    const newMessage = document.createElement('div');
    newMessage.className = 'message sent';
    newMessage.innerHTML = `
        <p>${input.value}</p>
        <span class="message-time">Just now</span>
    `;
    
    chatBody.appendChild(newMessage);
    input.value = '';
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Simulate reply after 1 second
    setTimeout(() => {
        const activeConversation = document.querySelector('.conversation.active');
        if (activeConversation) {
            const replyMessage = document.createElement('div');
            replyMessage.className = 'message received';
            replyMessage.innerHTML = `
                <p>Thanks for your message! I'll get back to you soon.</p>
                <span class="message-time">Just now</span>
            `;
            chatBody.appendChild(replyMessage);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }, 1000);
}

// Initialize messages if on messages page
if (window.location.pathname.includes('messages.html')) {
    document.addEventListener('DOMContentLoaded', initializeMessages);
}