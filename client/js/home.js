document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTORS ---
    const postTextInput = document.getElementById('post-text-input');
    const postBtn = document.getElementById('post-btn');
    const feedContainer = document.getElementById('feed-container');
    const attachmentsPreview = document.getElementById('post-attachments-preview');
    const fileInput = document.getElementById('file-upload');
    const tagBtn = document.getElementById('tag-friends-btn');
    const feelingBtn = document.getElementById('feeling-btn');

    // --- STATE ---
    let postAttachments = {
        photoUrl: '',
        taggedFriends: [],
        feeling: ''
    };

    // --- FUNCTIONS ---
    function updateAttachmentsUI() {
        attachmentsPreview.innerHTML = '';
        if (postAttachments.photoUrl) {
            attachmentsPreview.innerHTML += `<span class="attachment-tag"><i class="fas fa-image"></i> Photo Added</span>`;
        }
        if (postAttachments.taggedFriends.length > 0) {
            attachmentsPreview.innerHTML += `<span class="attachment-tag"><i class="fas fa-user-tag"></i> Tagged: ${postAttachments.taggedFriends.join(', ')}</span>`;
        }
        if (postAttachments.feeling) {
            attachmentsPreview.innerHTML += `<span class="attachment-tag"><i class="fas fa-smile"></i> Feeling ${postAttachments.feeling}</span>`;
        }
    }

    function createPostElement(text, attachments) {
        const postElement = document.createElement('div');
        postElement.classList.add('card', 'feed-post');
        
        let postBodyHTML = `<p>${text}</p>`;
        if (attachments.photoUrl) {
            postBodyHTML += `<img src="${attachments.photoUrl}" alt="User post image" class="post-image">`;
        }
        if (attachments.taggedFriends.length > 0) {
            postBodyHTML += `<p><small>— with <strong>${attachments.taggedFriends.join(', ')}</strong></small></p>`;
        }

        postElement.innerHTML = `
            <div class="post-header">
                <div class="user-info">
                    <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="Your Name" class="profile-pic">
                    <div><p class="user-name">Your Name</p><p class="post-time">Just now</p></div>
                </div>
                <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
            </div>
            <div class="post-body">${postBodyHTML}</div>
            <div class="post-footer">
                <button class="post-action-btn like-btn"><i class="far fa-thumbs-up"></i> Like <span class="like-count">0</span></button>
                <button class="post-action-btn comment-btn"><i class="far fa-comment"></i> Comment</button>
                <button class="post-action-btn share-btn"><i class="fas fa-share"></i> Share</button>
            </div>
            <div class="comment-section" style="display: none;">
                <div class="comments-list"></div>
                <div class="comment-input-box">
                    <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" class="profile-pic">
                    <input type="text" class="comment-input" placeholder="Write a comment...">
                    <button class="comment-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>`;
        return postElement;
    }

    function resetPostInput() {
        postTextInput.value = '';
        fileInput.value = '';
        postAttachments = { photoUrl: '', taggedFriends: [], feeling: '' };
        updateAttachmentsUI();
    }

    function addNewComment(inputField) {
        const commentText = inputField.value.trim();
        if (commentText) {
            const commentList = inputField.closest('.comment-section').querySelector('.comments-list');
            const newComment = document.createElement('div');
            newComment.classList.add('comment');
            newComment.innerHTML = `<img src="https://i.pravatar.cc/30?u=a042581f4e29026704d" class="profile-pic"><p><strong>Your Name</strong> ${commentText}</p>`;
            commentList.appendChild(newComment);
            inputField.value = '';
        }
    }

    // --- EVENT LISTENERS for POST CREATION ---
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                postAttachments.photoUrl = e.target.result;
                updateAttachmentsUI();
            };
            reader.readAsDataURL(file);
        }
    });

    tagBtn.addEventListener('click', () => {
        const friends = prompt("Tag friends (comma separated):", "Alice, Charlie");
        if (friends) {
            postAttachments.taggedFriends = friends.split(',').map(f => f.trim());
            updateAttachmentsUI();
        }
    });

    feelingBtn.addEventListener('click', () => {
        const currentFeeling = prompt("How are you feeling?", "happy");
        if (currentFeeling) {
            postAttachments.feeling = currentFeeling;
            updateAttachmentsUI();
        }
    });

    postBtn.addEventListener('click', () => {
        const postText = postTextInput.value.trim();
        if (postText === '' && !postAttachments.photoUrl) {
            alert('Please write something or add a photo to post.');
            return;
        }
        const fullPostText = postAttachments.feeling ? `<i>Feeling ${postAttachments.feeling}</i> 😊<br>${postText}` : postText;
        const newPost = createPostElement(fullPostText, postAttachments);
        feedContainer.insertBefore(newPost, feedContainer.children[1]);
        resetPostInput();
    });

    // --- MAIN EVENT LISTENER for POST ACTIONS (Like, Comment, Share, Delete, Send) ---
    feedContainer.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.delete-btn');
        if (deleteButton) {
            const postToDelete = deleteButton.closest('.feed-post');
            if (confirm('Are you sure you want to delete this post?')) {
                postToDelete.remove();
            }
            return;
        }

        const likeButton = event.target.closest('.like-btn');
        if (likeButton) {
            likeButton.classList.toggle('active');
            const icon = likeButton.querySelector('i');
            const countSpan = likeButton.querySelector('.like-count');
            let currentCount = parseInt(countSpan.innerText);
            if (likeButton.classList.contains('active')) {
                icon.classList.remove('far'); icon.classList.add('fas');
                currentCount++;
            } else {
                icon.classList.remove('fas'); icon.classList.add('far');
                currentCount--;
            }
            countSpan.innerText = currentCount;
            return;
        }

        const commentButton = event.target.closest('.comment-btn');
        if (commentButton) {
            const postCard = commentButton.closest('.feed-post');
            const commentSection = postCard.querySelector('.comment-section');
            if (commentSection.style.display === 'none') {
                commentSection.style.display = 'block';
            } else {
                commentSection.style.display = 'none';
            }
            return;
        }

        const shareButton = event.target.closest('.share-btn');
        if (shareButton) {
            if (navigator.share) {
                navigator.share({
                    title: 'Check out this post!',
                    text: 'I found this interesting post on PingSocial.',
                    url: window.location.href
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Post link copied to clipboard!');
            }
            return;
        }

        const sendButton = event.target.closest('.comment-send-btn');
        if (sendButton) {
            const inputBox = sendButton.previousElementSibling;
            addNewComment(inputBox);
            return;
        }
    });

    // --- EVENT LISTENER for ADDING COMMENTS with Enter key ---
    feedContainer.addEventListener('keypress', function(event) {
        if (event.target.classList.contains('comment-input') && event.key === 'Enter') {
            event.preventDefault();
            addNewComment(event.target);
        }
    });

    // --- EVENT LISTENER for ADD FRIEND BUTTONS ---
    document.addEventListener('click', function(event) {
        const addButton = event.target.closest('.add-friend-btn');
        if (addButton && !addButton.classList.contains('added')) {
            const friendName = addButton.dataset.name;
            addButton.classList.add('added');
            addButton.innerHTML = `<i class="fas fa-check"></i> Added`;
        }
    });
});