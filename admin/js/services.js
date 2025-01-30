// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = '../login.html';
        return;
    }

    // Initialize components
    initializeSidebar();
    initializeServicesManagement();
    updateCurrentDate();
    initializeNotifications();
    initializeSearch();
});

// Initialize services management
function initializeServicesManagement() {
    initializeViewToggle();
    initializeModals();
    initializeFilters();
    initializeActions();
    initializeImageUpload();
    initializeFeatures();
}

// View toggle functionality
function initializeViewToggle() {
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const servicesGrid = document.querySelector('.services-grid');
    const servicesList = document.querySelector('.services-list');

    gridViewBtn.addEventListener('click', () => {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        servicesGrid.classList.add('active');
        servicesList.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        servicesList.classList.add('active');
        servicesGrid.classList.remove('active');
    });
}

// Modal functionality
function initializeModals() {
    // Service Modal
    const serviceModal = document.getElementById('serviceModal');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const serviceCloseBtn = serviceModal.querySelector('.btn-close');
    const serviceCancelBtn = serviceModal.querySelector('.btn-cancel');
    const serviceForm = document.getElementById('serviceForm');
    const serviceSaveBtn = serviceModal.querySelector('.btn-save');

    // Show service modal
    addServiceBtn.addEventListener('click', () => {
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        serviceForm.reset();
        serviceModal.querySelector('h3').textContent = 'Add New Service';
    });

    // Hide service modal
    const hideServiceModal = () => {
        serviceModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    serviceCloseBtn.addEventListener('click', hideServiceModal);
    serviceCancelBtn.addEventListener('click', hideServiceModal);

    // Close modal on outside click
    serviceModal.addEventListener('click', (e) => {
        if (e.target === serviceModal) {
            hideServiceModal();
        }
    });

    // Handle service form submission
    serviceSaveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (serviceForm.checkValidity()) {
            const formData = new FormData(serviceForm);
            const serviceData = {
                name: formData.get('name'),
                category: formData.get('category'),
                status: formData.get('status'),
                description: formData.get('description'),
                price: formData.get('price'),
                period: formData.get('period'),
                featured: document.getElementById('featuredService').checked
            };

            // Here you would typically send the data to your backend
            console.log('Service data:', serviceData);
            
            showNotification('Service saved successfully!', 'success');
            hideServiceModal();
        } else {
            serviceForm.reportValidity();
        }
    });

    // Category Modal
    const categoryModal = document.getElementById('categoryModal');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const categoryCloseBtn = categoryModal.querySelector('.btn-close');
    const categoryCancelBtn = categoryModal.querySelector('.btn-cancel');
    const categoryForm = document.getElementById('categoryForm');
    const categorySaveBtn = categoryModal.querySelector('.btn-save');

    // Show category modal
    addCategoryBtn.addEventListener('click', () => {
        categoryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        categoryForm.reset();
    });

    // Hide category modal
    const hideCategoryModal = () => {
        categoryModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    categoryCloseBtn.addEventListener('click', hideCategoryModal);
    categoryCancelBtn.addEventListener('click', hideCategoryModal);

    // Close modal on outside click
    categoryModal.addEventListener('click', (e) => {
        if (e.target === categoryModal) {
            hideCategoryModal();
        }
    });

    // Handle category form submission
    categorySaveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (categoryForm.checkValidity()) {
            const formData = new FormData(categoryForm);
            const categoryData = {
                name: formData.get('name'),
                description: formData.get('description'),
                parent: formData.get('parent')
            };

            // Here you would typically send the data to your backend
            console.log('Category data:', categoryData);
            
            showNotification('Category saved successfully!', 'success');
            hideCategoryModal();
        } else {
            categoryForm.reportValidity();
        }
    });
}

// Filter functionality
function initializeFilters() {
    const categoryFilter = document.querySelector('.filter-category');
    const statusFilter = document.querySelector('.filter-status');
    const serviceCards = document.querySelectorAll('.service-card');
    const tableRows = document.querySelectorAll('.services-table tbody tr');

    const filterServices = () => {
        const selectedCategory = categoryFilter.value.toLowerCase();
        const selectedStatus = statusFilter.value.toLowerCase();

        // Filter grid view
        serviceCards.forEach(card => {
            const category = card.querySelector('.badge-category').textContent.toLowerCase();
            const status = card.querySelector('.badge-status').textContent.toLowerCase();
            const isFeatured = card.classList.contains('featured');
            
            const matchCategory = !selectedCategory || category === selectedCategory;
            const matchStatus = !selectedStatus || 
                              (selectedStatus === 'featured' ? isFeatured : status === selectedStatus);
            
            card.style.display = matchCategory && matchStatus ? '' : 'none';
        });

        // Filter list view
        tableRows.forEach(row => {
            const category = row.querySelector('.badge-category').textContent.toLowerCase();
            const status = row.querySelector('.badge-status').textContent.toLowerCase();
            const isFeatured = row.classList.contains('featured');
            
            const matchCategory = !selectedCategory || category === selectedCategory;
            const matchStatus = !selectedStatus || 
                              (selectedStatus === 'featured' ? isFeatured : status === selectedStatus);
            
            row.style.display = matchCategory && matchStatus ? '' : 'none';
        });
    };

    categoryFilter.addEventListener('change', filterServices);
    statusFilter.addEventListener('change', filterServices);
}

// Initialize actions
function initializeActions() {
    // Edit buttons
    document.querySelectorAll('.btn-icon[title="Edit"]').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.service-card') || button.closest('tr');
            const title = card.querySelector('h4').textContent;
            const category = card.querySelector('.badge-category').textContent;
            const status = card.querySelector('.badge-status').textContent.toLowerCase();
            const description = card.querySelector('p').textContent;
            const price = card.querySelector('.amount')?.textContent || 
                         card.querySelector('td:nth-child(3)').textContent.replace('$', '');

            const modal = document.getElementById('serviceModal');
            const form = document.getElementById('serviceForm');
            
            form.name.value = title;
            form.category.value = category.toLowerCase().replace(/\s+/g, '-');
            form.status.value = status;
            form.description.value = description;
            form.price.value = price;
            document.getElementById('featuredService').checked = card.classList.contains('featured');

            modal.querySelector('h3').textContent = 'Edit Service';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Preview buttons
    document.querySelectorAll('.btn-icon[title="Preview"]').forEach(button => {
        button.addEventListener('click', () => {
            // Here you would typically open a preview window or modal
            console.log('Preview clicked');
        });
    });

    // Delete buttons
    document.querySelectorAll('.btn-icon[title="Delete"]').forEach(button => {
        button.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this service?')) {
                const card = button.closest('.service-card') || button.closest('tr');
                // Here you would typically send a delete request to your backend
                card.remove();
                showNotification('Service deleted successfully!', 'success');
            }
        });
    });
}

// Image upload functionality
function initializeImageUpload() {
    const imageUpload = document.querySelector('.image-upload');
    const fileInput = imageUpload.querySelector('input[type="file"]');
    const imagePreview = imageUpload.querySelector('.image-preview img');
    const uploadBtn = imageUpload.querySelector('.btn-upload');

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Features list functionality
function initializeFeatures() {
    const featuresList = document.querySelector('.features-list');
    const addFeatureBtn = featuresList.querySelector('.btn-add-feature');

    addFeatureBtn.addEventListener('click', () => {
        const featureItem = document.createElement('div');
        featureItem.className = 'feature-item';
        featureItem.innerHTML = `
            <input type="text" placeholder="Enter feature">
            <button type="button" class="btn-icon" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        featuresList.insertBefore(featureItem, addFeatureBtn);

        // Add remove functionality
        const removeBtn = featureItem.querySelector('.btn-icon');
        removeBtn.addEventListener('click', () => {
            featureItem.remove();
        });
    });

    // Initialize remove buttons for existing features
    featuresList.querySelectorAll('.feature-item .btn-icon').forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.feature-item').remove();
        });
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
    const serviceCards = document.querySelectorAll('.service-card');
    const tableRows = document.querySelectorAll('.services-table tbody tr');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        // Search in grid view
        serviceCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const category = card.querySelector('.badge-category').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            const match = title.includes(query) || 
                         category.includes(query) || 
                         description.includes(query);
            
            card.style.display = match ? '' : 'none';
        });

        // Search in list view
        tableRows.forEach(row => {
            const title = row.querySelector('h4').textContent.toLowerCase();
            const category = row.querySelector('.badge-category').textContent.toLowerCase();
            const description = row.querySelector('p').textContent.toLowerCase();
            
            const match = title.includes(query) || 
                         category.includes(query) || 
                         description.includes(query);
            
            row.style.display = match ? '' : 'none';
        });
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