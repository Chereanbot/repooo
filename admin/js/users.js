// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    // Initialize components
    initializeSidebar();
    initializeUserManagement();
    updateCurrentDate();
    initializeNotifications();
    initializeSearch();
});

// Initialize user management
function initializeUserManagement() {
    initializeModal();
    initializeTable();
    initializeFilters();
    initializePagination();
    initializeActions();
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('userModal');
    const addUserBtn = document.querySelector('.btn-add-user');
    const closeBtn = modal.querySelector('.btn-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const form = document.getElementById('userForm');
    const statusToggle = document.getElementById('statusToggle');
    const statusLabel = document.querySelector('.status-label');

    // Show modal
    addUserBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        form.reset();
        modal.querySelector('h3').textContent = 'Add New User';
    });

    // Hide modal
    const hideModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Status toggle
    statusToggle.addEventListener('change', () => {
        statusLabel.textContent = statusToggle.checked ? 'Active' : 'Inactive';
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            username: formData.get('username'),
            role: formData.get('role'),
            status: statusToggle.checked ? 'active' : 'inactive'
        };

        // Here you would typically send the data to your backend
        console.log('User data:', userData);
        
        // Show success message
        showNotification('User saved successfully!', 'success');
        hideModal();
    });
}

// Table functionality
function initializeTable() {
    const selectAll = document.querySelector('.select-all');
    const userCheckboxes = document.querySelectorAll('.select-user');
    const editButtons = document.querySelectorAll('.btn-edit');
    const deleteButtons = document.querySelectorAll('.btn-delete');

    // Select all functionality
    selectAll.addEventListener('change', () => {
        userCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    });

    // Edit user
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.getElementById('userModal');
            const form = document.getElementById('userForm');
            
            // Get user data from the table row
            const row = button.closest('tr');
            const name = row.querySelector('.user-cell h4').textContent.split(' ');
            const email = row.querySelector('td:nth-child(3)').textContent;
            const role = row.querySelector('.badge-role').textContent.toLowerCase();
            const status = row.querySelector('.badge-status').textContent.toLowerCase();

            // Populate form
            form.firstName.value = name[0];
            form.lastName.value = name[1];
            form.email.value = email;
            form.username.value = email.split('@')[0];
            form.role.value = role;
            document.getElementById('statusToggle').checked = status === 'active';

            // Show modal
            modal.querySelector('h3').textContent = 'Edit User';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Delete user
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this user?')) {
                const row = button.closest('tr');
                // Here you would typically send a delete request to your backend
                row.remove();
                showNotification('User deleted successfully!', 'success');
            }
        });
    });
}

// Filter functionality
function initializeFilters() {
    const roleFilter = document.querySelector('.filter-role');
    const statusFilter = document.querySelector('.filter-status');
    const tableRows = document.querySelectorAll('.users-table tbody tr');

    const filterTable = () => {
        const selectedRole = roleFilter.value;
        const selectedStatus = statusFilter.value;

        tableRows.forEach(row => {
            const role = row.querySelector('.badge-role').textContent.toLowerCase();
            const status = row.querySelector('.badge-status').textContent.toLowerCase();
            const matchRole = !selectedRole || role === selectedRole;
            const matchStatus = !selectedStatus || status === selectedStatus;
            row.style.display = matchRole && matchStatus ? '' : 'none';
        });
    };

    roleFilter.addEventListener('change', filterTable);
    statusFilter.addEventListener('change', filterTable);
}

// Pagination functionality
function initializePagination() {
    const pageButtons = document.querySelectorAll('.btn-page');
    
    pageButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', () => {
                pageButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // Here you would typically fetch and display the corresponding page of users
            });
        }
    });
}

// Initialize actions
function initializeActions() {
    // Profile image upload
    const uploadBtn = document.querySelector('.btn-upload');
    const profileImg = document.querySelector('.profile-upload img');
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profileImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Sidebar functionality
function initializeSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        main.style.marginLeft = sidebar.classList.contains('active') ? '280px' : '0';
    });

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 &&
            !sidebar.contains(e.target) &&
            !sidebarToggle.contains(e.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            main.style.marginLeft = '0';
        }
    });

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        window.location.href = '../login.html';
    });
}

// Update current date
function updateCurrentDate() {
    const dateElement = document.querySelector('.current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const tableRows = document.querySelectorAll('.users-table tbody tr');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        tableRows.forEach(row => {
            const name = row.querySelector('.user-cell h4').textContent.toLowerCase();
            const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const username = row.querySelector('.user-cell p').textContent.toLowerCase();
            
            const match = name.includes(query) || 
                         email.includes(query) || 
                         username.includes(query);
            
            row.style.display = match ? '' : 'none';
        });
    });
}

// Notifications functionality
function initializeNotifications() {
    const notificationsBtn = document.querySelector('.notifications');
    
    notificationsBtn.addEventListener('click', () => {
        // Create notifications dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'notifications-dropdown';
        dropdown.innerHTML = `
            <div class="notification-item">
                <i class="fas fa-user-plus"></i>
                <div class="notification-content">
                    <p>New user registration</p>
                    <span>5 minutes ago</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-user-edit"></i>
                <div class="notification-content">
                    <p>User profile updated</p>
                    <span>2 hours ago</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-user-minus"></i>
                <div class="notification-content">
                    <p>User account deleted</p>
                    <span>4 hours ago</span>
                </div>
            </div>
        `;

        // Position and show dropdown
        const rect = notificationsBtn.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = rect.bottom + 10 + 'px';
        dropdown.style.right = window.innerWidth - rect.right + 'px';

        // Remove existing dropdown if any
        const existingDropdown = document.querySelector('.notifications-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        } else {
            document.body.appendChild(dropdown);
        }

        // Close dropdown on outside click
        const closeDropdown = (e) => {
            if (!dropdown.contains(e.target) && !notificationsBtn.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeDropdown);
        }, 0);
    });
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add window resize handler
window.addEventListener('resize', () => {
    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');

    if (window.innerWidth > 992) {
        sidebar.classList.remove('active');
        main.style.marginLeft = '280px';
    } else {
        main.style.marginLeft = '0';
    }
}); 