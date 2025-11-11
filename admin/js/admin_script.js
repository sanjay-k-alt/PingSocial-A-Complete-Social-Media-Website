// Admin Panel JavaScript

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

// Initialize all admin panel functionality
function initializeAdminPanel() {
    if (document.querySelector('.admin-login-page')) {
        initializeLoginPage();
    } else {
        initializeSidebar();
        initializeSearch();
        initializeActionButtons();
        initializeModals();
        initializeDatePickers();
        initializeForms();
        initializePagination();
        initializeCharts();
    }
}

// Login Page Specific Functions
function initializeLoginPage() {
    initializeLoginTabs();
    initializePasswordStrength();
    initializeVerificationCode();
    initializeForgotPassword();
    initializeLoginForms();
}

function initializeLoginTabs() {
    const tabs = document.querySelectorAll('.login-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${target}-tab`).classList.add('active');
        });
    });
}

function initializePasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    if (!passwordInput) return;
    
    const strengthBar = document.querySelector('.strength-bar');
    const requirements = document.querySelectorAll('.requirement');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update strength bar
        strengthBar.className = 'strength-bar';
        if (password.length > 0) {
            strengthBar.classList.add(`strength-${strength.level}`);
        }
        
        // Update requirements
        requirements.forEach(req => {
            const requirementType = req.getAttribute('data-requirement');
            const isMet = checkPasswordRequirement(password, requirementType);
            
            req.classList.toggle('met', isMet);
            req.classList.toggle('unmet', !isMet);
            
            const icon = req.querySelector('i');
            icon.className = isMet ? 'fas fa-check' : 'fas fa-circle';
        });
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    // Calculate score
    Object.values(requirements).forEach(met => {
        if (met) score++;
    });
    
    // Determine strength level
    let level = 'weak';
    if (score >= 4) level = 'medium';
    if (score === 5) level = 'strong';
    
    return { score, level, requirements };
}

function checkPasswordRequirement(password, requirement) {
    switch(requirement) {
        case 'length':
            return password.length >= 8;
        case 'uppercase':
            return /[A-Z]/.test(password);
        case 'lowercase':
            return /[a-z]/.test(password);
        case 'number':
            return /[0-9]/.test(password);
        case 'special':
            return /[^A-Za-z0-9]/.test(password);
        default:
            return false;
    }
}

function initializeVerificationCode() {
    const codeInputs = document.querySelectorAll('.verification-code input');
    
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            // Move to next input if current is filled
            if (this.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            
            // Update filled state
            this.classList.toggle('filled', this.value.length === 1);
            
            // Check if all inputs are filled
            checkVerificationCodeComplete();
        });
        
        input.addEventListener('keydown', function(e) {
            // Handle backspace
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
        
        // Prevent non-numeric input
        input.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });
    });
}

function checkVerificationCodeComplete() {
    const codeInputs = document.querySelectorAll('.verification-code input');
    const allFilled = Array.from(codeInputs).every(input => input.value.length === 1);
    
    if (allFilled) {
        // Simulate code verification
        setTimeout(() => {
            showVerificationSuccess();
        }, 1000);
    }
}

function showVerificationSuccess() {
    const verificationTab = document.getElementById('verification-tab');
    const successHtml = `
        <div class="success-state">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>Verification Successful!</h3>
            <p>Your account has been successfully verified. You can now log in to your admin account.</p>
            <div class="back-to-login">
                <a href="#" onclick="switchToTab('login')">
                    <i class="fas fa-arrow-left"></i>
                    Back to Login
                </a>
            </div>
        </div>
    `;
    
    verificationTab.innerHTML = successHtml;
}

function initializeForgotPassword() {
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleForgotPassword(this);
        });
    }
    
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleResetPassword(this);
        });
    }
}

function initializeLoginForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup(this);
        });
    }
}

function handleForgotPassword(form) {
    const email = form.querySelector('input[type="email"]').value;
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showToast(`Password reset instructions sent to ${email}`, 'success');
        
        // Switch to verification tab
        switchToTab('verification');
        
        // Start resend countdown
        startResendCountdown();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleResetPassword(form) {
    const newPassword = form.querySelector('#new-password').value;
    const confirmPassword = form.querySelector('#confirm-password').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showToast('Password reset successfully!', 'success');
        
        // Show success state
        const resetPasswordTab = document.getElementById('reset-password-tab');
        resetPasswordTab.innerHTML = `
            <div class="success-state">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h3>Password Reset Successful!</h3>
                <p>Your password has been reset successfully. You can now log in with your new password.</p>
                <div class="back-to-login">
                    <a href="#" onclick="switchToTab('login')">
                        <i class="fas fa-arrow-left"></i>
                        Back to Login
                    </a>
                </div>
            </div>
        `;
    }, 2000);
}

function switchToTab(tabName) {
    const tab = document.querySelector(`.login-tab[data-tab="${tabName}"]`);
    if (tab) {
        tab.click();
    }
}

function startResendCountdown() {
    let countdown = 60;
    const resendText = document.querySelector('.resend-code');
    const originalHtml = resendText.innerHTML;
    
    const timer = setInterval(() => {
        resendText.innerHTML = `Didn't receive the code? <span class="countdown">Resend in ${countdown}s</span>`;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(timer);
            resendText.innerHTML = `Didn't receive the code? <a href="#" onclick="resendCode()">Resend Code</a>`;
        }
    }, 1000);
}

function resendCode() {
    showToast('Verification code resent to your email', 'success');
    startResendCountdown();
}

function handleSignup(form) {
    const formData = new FormData(form);
    const email = formData.get('signup-email');
    const password = formData.get('signup-password');
    const confirmPassword = formData.get('confirm-password');
    const adminCode = formData.get('admin-code');
    
    // Basic validation
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!adminCode) {
        showToast('Admin invite code is required', 'error');
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    if (strength.level === 'weak') {
        showToast('Please choose a stronger password', 'warning');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showToast('Account created successfully! Please check your email for verification.', 'success');
        
        // Switch to verification tab
        switchToTab('verification');
        
        // Start resend countdown
        startResendCountdown();
        
        // Reset form
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Admin Panel Functions

// Sidebar functionality
function initializeSidebar() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.parentElement.classList.add('active');
        }
        
        link.addEventListener('click', function(e) {
            if (this.classList.contains('logout')) {
                e.preventDefault();
                showToast('Logged out successfully', 'success');
                setTimeout(() => {
                    window.location.href = 'admin_index.html';
                }, 1500);
                return;
            }
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            // Add active class to clicked link
            this.parentElement.classList.add('active');
        });
    });
}

// Search functionality
function initializeSearch() {
    const searchInputs = document.querySelectorAll('.search-wrapper input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.card').querySelector('tbody');
            
            if (table) {
                const rows = table.querySelectorAll('tr');
                let visibleCount = 0;
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                        visibleCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });
                
                // Update pagination info if needed
                updatePaginationInfo(visibleCount);
            }
        }, 300));
    });
}

// Action buttons functionality
function initializeActionButtons() {
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        
        const row = btn.closest('tr');
        const userName = row.querySelector('.user-info span')?.textContent || 'User';
        const postContent = row.querySelector('.post-text')?.textContent || 'Post';
        
        if (btn.classList.contains('edit')) {
            openEditModal(userName, row);
        } else if (btn.classList.contains('ban')) {
            showConfirmationModal(
                `Ban ${userName}`,
                `Are you sure you want to ban ${userName}?`,
                () => banUser(row, userName)
            );
        } else if (btn.classList.contains('unban')) {
            showConfirmationModal(
                `Unban ${userName}`,
                `Are you sure you want to unban ${userName}?`,
                () => unbanUser(row, userName)
            );
        } else if (btn.classList.contains('delete')) {
            const entity = row.querySelector('.user-info') ? 'user' : 'post';
            const name = entity === 'user' ? userName : 'post';
            showConfirmationModal(
                `Delete ${entity}`,
                `Are you sure you want to delete this ${entity}? This action cannot be undone.`,
                () => deleteEntity(row, entity, name)
            );
        } else if (btn.classList.contains('view')) {
            openViewModal(postContent);
        } else if (btn.classList.contains('dismiss')) {
            showConfirmationModal(
                'Dismiss Reports',
                'Are you sure you want to dismiss all reports for this post?',
                () => dismissReports(row)
            );
        }
    });
}

// Modal functionality
function initializeModals() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: block"]');
            if (openModal) closeModal(openModal);
        }
    });
    
    // Close modal buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-modal')) {
            closeModal(e.target.closest('.modal'));
        }
    });
}

// Date pickers for analytics
function initializeDatePickers() {
    const dateButtons = document.querySelectorAll('.date-btn');
    
    dateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons in group
            const parent = this.closest('.date-picker');
            parent.querySelectorAll('.date-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update charts based on selected date range
            updateCharts(this.textContent.trim());
        });
    });
}

// Form handling
function initializeForms() {
    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddUser(this);
        });
    }
    
    // Add event listeners for all modal forms
    const modalForms = document.querySelectorAll('.modal form');
    modalForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle different modal forms based on ID or class
            if (this.id === 'add-user-form') {
                handleAddUser(this);
            }
        });
    });
}

// Pagination
function initializePagination() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.pagination-buttons button:not(:disabled)')) {
            const button = e.target;
            const pagination = button.closest('.pagination');
            const currentPageSpan = pagination.querySelector('span');
            
            let currentPage = parseInt(currentPageSpan.textContent.match(/Page (\d+)/)[1]);
            let totalPages = parseInt(currentPageSpan.textContent.match(/of (\d+)/)[1]);
            
            if (button.textContent.includes('Next')) {
                currentPage++;
            } else if (button.textContent.includes('Prev')) {
                currentPage--;
            }
            
            // Update pagination UI
            updatePaginationUI(pagination, currentPage, totalPages);
            
            // In a real app, you would fetch new data here
            showToast(`Navigated to page ${currentPage}`, 'success');
        }
    });
}

// Chart initialization
function initializeCharts() {
    // Initialize any charts if needed
    // This would be replaced with actual chart library initialization
    console.log('Charts initialized');
}

// Utility Functions

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${getToastIcon(type)}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="close-toast">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
    
    // Close button
    toast.querySelector('.close-toast').addEventListener('click', () => {
        toast.style.animation = 'toastSlideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showConfirmationModal(title, message, confirmCallback) {
    const modal = document.getElementById('confirmation-modal');
    if (!modal) {
        console.error('Confirmation modal not found');
        return;
    }
    
    const modalTitle = modal.querySelector('.modal-header h3');
    const modalMessage = modal.querySelector('.modal-body p');
    const confirmBtn = modal.querySelector('#confirm-action');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Remove previous event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    newConfirmBtn.addEventListener('click', function() {
        confirmCallback();
        closeModal(modal);
    });
    
    openModal('confirmation-modal');
}

// Specific action handlers
function openEditModal(userName, row) {
    // In a real app, you would populate the form with existing data
    openModal('edit-user-modal');
    showToast(`Edit mode for ${userName}`, 'warning');
}

function openViewModal(content) {
    const modal = document.getElementById('view-post-modal');
    const contentElement = modal.querySelector('.modal-body');
    contentElement.innerHTML = `<p>${content}</p>`;
    openModal('view-post-modal');
}

function banUser(row, userName) {
    const statusCell = row.querySelector('.status');
    statusCell.className = 'status status-banned';
    statusCell.textContent = 'Banned';
    
    // Update action buttons
    const actionButtons = row.querySelector('.action-buttons');
    const banBtn = actionButtons.querySelector('.ban');
    if (banBtn) {
        banBtn.className = 'action-btn unban';
        banBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
    }
    
    showToast(`${userName} has been banned`, 'success');
}

function unbanUser(row, userName) {
    const statusCell = row.querySelector('.status');
    statusCell.className = 'status status-active';
    statusCell.textContent = 'Active';
    
    // Update action buttons
    const actionButtons = row.querySelector('.action-buttons');
    const unbanBtn = actionButtons.querySelector('.unban');
    if (unbanBtn) {
        unbanBtn.className = 'action-btn ban';
        unbanBtn.innerHTML = '<i class="fas fa-ban"></i>';
    }
    
    showToast(`${userName} has been unbanned`, 'success');
}

function deleteEntity(row, entity, name) {
    row.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        row.remove();
        showToast(`${entity.charAt(0).toUpperCase() + entity.slice(1)} "${name}" has been deleted`, 'success');
        
        // Update pagination info
        updateRowCount();
    }, 300);
}

function dismissReports(row) {
    const reportCount = row.querySelector('.report-count');
    if (reportCount) {
        reportCount.textContent = '0';
        row.classList.remove('reported-row');
    }
    showToast('Reports dismissed successfully', 'success');
}

// Form handlers
function handleLogin(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        if (email && password) {
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showToast('Please check your credentials', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}

function handleAddUser(form) {
    const formData = new FormData(form);
    // Process form data here
    
    //showToast('User added successfully', 'success');
    closeModal(document.getElementById('add-user-modal'));
    form.reset();
    
    // In a real app, you would add the user to the table
}

// Chart updates (simulated)
function updateCharts(dateRange) {
    showToast(`Charts updated for ${dateRange}`, 'success');
    // In a real app, you would update the charts with new data
}

// Pagination helpers
function updatePaginationInfo(visibleCount) {
    // Update pagination info based on visible rows
    console.log(`${visibleCount} items match your search`);
}

function updatePaginationUI(pagination, currentPage, totalPages) {
    const currentPageSpan = pagination.querySelector('span');
    const prevBtn = pagination.querySelector('button:first-child');
    const nextBtn = pagination.querySelector('button:last-child');
    
    currentPageSpan.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function updateRowCount() {
    // Update the row count after deletions
    const tables = document.querySelectorAll('tbody');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        console.log(`Remaining rows: ${rows.length}`);
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes toastSlideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes toastSlideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    
    @keyframes modalSlideIn {
        from { opacity: 0; transform: translateY(-50px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);