// Modal Functions - Defined at the top
function showPageModal(pageData = null) {
    console.log('Showing page modal');
    const modal = document.getElementById('pageModal');
    if (!modal) {
        console.error('Page modal not found');
        return;
    }
    
    const form = document.getElementById('pageForm');
    const title = modal.querySelector('h3');

    // Reset form
    form.reset();
    form.removeAttribute('data-id');

    if (pageData) {
        title.textContent = 'Edit Page';
        form.dataset.id = pageData._id;
        form.title.value = pageData.title;
        form.slug.value = pageData.slug;
        form.content.value = pageData.content;
        form.metaTitle.value = pageData.metaTitle;
        form.metaDescription.value = pageData.metaDescription;
        document.getElementById('pageStatus').checked = pageData.status === 'published';
    } else {
        title.textContent = 'Add New Page';
        document.getElementById('pageStatus').checked = true;
    }

    modal.style.display = 'block';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showSectionModal(sectionData = null) {
    console.log('Showing section modal');
    const modal = document.getElementById('sectionModal');
    if (!modal) {
        console.error('Section modal not found');
        return;
    }
    
    const form = document.getElementById('sectionForm');
    const title = modal.querySelector('h3');

    // Reset form
    form.reset();
    form.removeAttribute('data-id');

    if (sectionData) {
        title.textContent = 'Edit Section';
        form.dataset.id = sectionData._id;
        form.title.value = sectionData.title;
        form.description.value = sectionData.description;
        form.type.value = sectionData.type;
        form.background.value = sectionData.background;
        form.order.value = sectionData.order;
        document.getElementById('sectionStatus').checked = sectionData.status === 'published';
    } else {
        title.textContent = 'Add New Section';
        document.getElementById('sectionStatus').checked = true;
    }

    modal.style.display = 'block';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Make modal functions globally accessible
window.showPageModal = showPageModal;
window.showSectionModal = showSectionModal;

// MongoDB Configuration
const MONGODB_CONFIG = {
    uri: 'mongodb+srv://aman:aman123@cluster0.eevte.mongodb.net/aman',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

// Initialize MongoDB Client
const client = new MongoClient(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
const db = client.db('aman');

// Database Collections
const COLLECTION_PAGES = 'pages';
const COLLECTION_SECTIONS = 'sections';
const COLLECTION_MEDIA = 'media';

// Make modal functions globally accessible
window.showPageModal = showPageModal;
window.showSectionModal = showSectionModal;
window.handlePageSubmit = handlePageSubmit;
window.handleSectionSubmit = handleSectionSubmit;

// Initialize content management
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Content.js: DOM loaded');
    try {
        // Connect to MongoDB
        window.db = await connectToMongoDB();
        console.log('MongoDB connected and db initialized');

        // Initialize components
        initializeButtons();
        initializeModals();
        initializeFormSubmissions();
        await loadContent();

        console.log('All components initialized');
    } catch (error) {
        console.error('Error initializing content:', error);
        showNotification('Error initializing content: ' + error.message, 'error');
    }
});

// Initialize form submissions
function initializeFormSubmissions() {
    // Page form submission
    const pageForm = document.getElementById('pageForm');
    if (pageForm) {
        pageForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Submitting page form');
            
            const formData = new FormData(this);
            
            // Validate form
            const errors = validateForm(formData, 'page');
            if (errors.length > 0) {
                showFormErrors(errors, 'pageForm');
                return;
            }
            
            try {
            const pageData = {
                title: formData.get('title'),
                slug: formData.get('slug') || formData.get('title').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                content: formData.get('content'),
                metaTitle: formData.get('metaTitle'),
                metaDescription: formData.get('metaDescription'),
                status: document.getElementById('pageStatus').checked ? 'published' : 'draft',
                lastUpdated: new Date(),
                createdAt: new Date()
            };

                const result = await window.db.collection(COLLECTION_PAGES).insertOne(pageData);
                console.log('Page created:', result);
                showNotification('Page created successfully', 'success');
                
                // Close modal and refresh content
                const modal = document.getElementById('pageModal');
                modal.style.display = 'none';
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                await loadContent();
            } catch (error) {
                console.error('Error creating page:', error);
                showNotification('Error creating page: ' + error.message, 'error');
                showFormErrors([error.message], 'pageForm');
            }
        });
    }

    // Section form submission
    const sectionForm = document.getElementById('sectionForm');
    if (sectionForm) {
        sectionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Submitting section form');
            
            const formData = new FormData(this);
            
            // Validate form
            const errors = validateForm(formData, 'section');
            if (errors.length > 0) {
                showFormErrors(errors, 'sectionForm');
                return;
            }
            
            try {
            const sectionData = {
                title: formData.get('title'),
                description: formData.get('description'),
                type: formData.get('type'),
                background: formData.get('background'),
                order: parseInt(formData.get('order')),
                status: document.getElementById('sectionStatus').checked ? 'published' : 'draft',
                lastUpdated: new Date(),
                createdAt: new Date()
            };

                const result = await window.db.collection(COLLECTION_SECTIONS).insertOne(sectionData);
                console.log('Section created:', result);
                showNotification('Section created successfully', 'success');
                
                // Close modal and refresh content
                const modal = document.getElementById('sectionModal');
                modal.style.display = 'none';
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                await loadContent();
            } catch (error) {
                console.error('Error creating section:', error);
                showNotification('Error creating section: ' + error.message, 'error');
                showFormErrors([error.message], 'sectionForm');
            }
        });
    }
}

// Load content from MongoDB
async function loadContent() {
    try {
        console.log('Loading content...');
        // Load pages
        const pages = await window.db.collection(COLLECTION_PAGES).find({}).toArray();
        console.log('Loaded pages:', pages);
        displayPages(pages);

        // Load sections
        const sections = await window.db.collection(COLLECTION_SECTIONS).find({}).toArray();
        console.log('Loaded sections:', sections);
        displaySections(sections);

        console.log('Content loaded successfully');
    } catch (error) {
        console.error('Error loading content:', error);
        showNotification('Error loading content: ' + error.message, 'error');
    }
}

// Display pages in the UI
function displayPages(pages) {
    const pagesContainer = document.querySelector('.content-cards');
    pagesContainer.innerHTML = pages.map(page => `
        <div class="content-card" data-id="${page._id}">
            <div class="card-header">
                <i class="fas fa-file-alt"></i>
                <span class="badge-status ${page.status}">${page.status}</span>
            </div>
            <div class="card-body">
                <h4>${page.title}</h4>
                <p>${page.description || ''}</p>
            </div>
            <div class="card-footer">
                <span class="timestamp">Updated: ${formatDate(page.lastUpdated)}</span>
                <div class="actions">
                    <button class="btn-icon" title="Edit" onclick="editPage('${page._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Preview" onclick="previewPage('${page._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Delete" onclick="deletePage('${page._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display sections in the UI
function displaySections(sections) {
    const sectionsContainer = document.querySelector('.content-section:nth-child(2) .content-cards');
    sectionsContainer.innerHTML = sections.map(section => `
        <div class="content-card" data-id="${section._id}">
            <div class="card-header">
                <i class="fas fa-layer-group"></i>
                <span class="badge-status ${section.status}">${section.status}</span>
            </div>
            <div class="card-body">
                <h4>${section.title}</h4>
                <p>${section.description || ''}</p>
            </div>
            <div class="card-footer">
                <span class="timestamp">Updated: ${formatDate(section.lastUpdated)}</span>
                <div class="actions">
                    <button class="btn-icon" title="Edit" onclick="editSection('${section._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" title="Preview" onclick="previewSection('${section._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" title="Delete" onclick="deleteSection('${section._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display media in the UI
function displayMedia(mediaItems) {
    const mediaContainer = document.querySelector('.media-grid');
    mediaContainer.innerHTML = mediaItems.map(media => `
        <div class="media-card" data-id="${media._id}">
            <img src="${media.url}" alt="${media.title}">
            <div class="media-info">
                <h4>${media.title}</h4>
                <p>${formatFileSize(media.size)}</p>
            </div>
            <div class="media-actions">
                <button class="btn-icon" title="Preview" onclick="previewMedia('${media._id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="Download" onclick="downloadMedia('${media._id}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon" title="Delete" onclick="deleteMedia('${media._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// CRUD Operations for Pages
async function createPage(pageData) {
    try {
        const result = await db.collection(COLLECTION_PAGES).insertOne({
            ...pageData,
            lastUpdated: new Date(),
            createdAt: new Date()
        });
        showNotification('Page created successfully', 'success');
        await loadContent();
        return result;
    } catch (error) {
        console.error('Error creating page:', error);
        showNotification('Error creating page', 'error');
    }
}

async function editPage(pageId) {
    try {
        const page = await db.collection(COLLECTION_PAGES).findOne({ _id: pageId });
        if (page) {
            // Populate form with page data
            const form = document.getElementById('pageForm');
            form.title.value = page.title;
            form.slug.value = page.slug;
            form.content.value = page.content;
            form.metaTitle.value = page.metaTitle;
            form.metaDescription.value = page.metaDescription;
            document.getElementById('pageStatus').checked = page.status === 'published';

            // Show modal
            const modal = document.getElementById('pageModal');
            modal.classList.add('active');
            modal.querySelector('h3').textContent = 'Edit Page';
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Error editing page:', error);
        showNotification('Error loading page data', 'error');
    }
}

async function deletePage(pageId) {
    if (confirm('Are you sure you want to delete this page?')) {
        try {
            await db.collection(COLLECTION_PAGES).deleteOne({ _id: pageId });
            showNotification('Page deleted successfully', 'success');
            await loadContent();
        } catch (error) {
            console.error('Error deleting page:', error);
            showNotification('Error deleting page', 'error');
        }
    }
}

// CRUD Operations for Sections
async function createSection(sectionData) {
    try {
        const result = await db.collection(COLLECTION_SECTIONS).insertOne({
            ...sectionData,
            lastUpdated: new Date(),
            createdAt: new Date()
        });
        showNotification('Section created successfully', 'success');
        await loadContent();
        return result;
    } catch (error) {
        console.error('Error creating section:', error);
        showNotification('Error creating section', 'error');
    }
}

async function editSection(sectionId) {
    try {
        const section = await db.collection(COLLECTION_SECTIONS).findOne({ _id: sectionId });
        if (section) {
            // Populate form with section data
            // Add your section form population logic here
            showNotification('Section loaded for editing', 'success');
        }
    } catch (error) {
        console.error('Error editing section:', error);
        showNotification('Error loading section data', 'error');
    }
}

async function deleteSection(sectionId) {
    if (confirm('Are you sure you want to delete this section?')) {
        try {
            await db.collection(COLLECTION_SECTIONS).deleteOne({ _id: sectionId });
            showNotification('Section deleted successfully', 'success');
            await loadContent();
        } catch (error) {
            console.error('Error deleting section:', error);
            showNotification('Error deleting section', 'error');
        }
    }
}

// Media Operations
async function uploadMedia(file, metadata) {
    try {
        // In a real application, you would upload the file to a storage service
        // and save the URL in MongoDB
        const mediaData = {
            title: metadata.title || file.name,
            url: URL.createObjectURL(file), // Temporary URL for demo
            type: file.type,
            size: file.size,
            uploadDate: new Date()
        };

        const result = await db.collection(COLLECTION_MEDIA).insertOne(mediaData);
        showNotification('Media uploaded successfully', 'success');
        await loadContent();
        return result;
    } catch (error) {
        console.error('Error uploading media:', error);
        showNotification('Error uploading media', 'error');
    }
}

async function deleteMedia(mediaId) {
    if (confirm('Are you sure you want to delete this media?')) {
        try {
            await db.collection(COLLECTION_MEDIA).deleteOne({ _id: mediaId });
            showNotification('Media deleted successfully', 'success');
            await loadContent();
        } catch (error) {
            console.error('Error deleting media:', error);
            showNotification('Error deleting media', 'error');
        }
    }
}

// Utility Functions
function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return 'Today';
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    } else {
        return d.toLocaleDateString();
    }
}

// Initialize content management
async function initializeContentManagement() {
    try {
        // Load initial content
        const pages = await db.collection(COLLECTION_PAGES).find({}).toArray();
        const sections = await db.collection(COLLECTION_SECTIONS).find({}).toArray();
        const media = await db.collection(COLLECTION_MEDIA).find({}).toArray();

        // Display content
        displayPages(pages);
        displaySections(sections);
        displayMedia(media);

        // Initialize other components
        initializeModals();
        initializeFilters();
        initializeActions();
        initializeEditor();
        initializeMediaUpload();
    } catch (error) {
        console.error('Error initializing content:', error);
        showNotification('Error loading content', 'error');
    }
}

// Modal functionality
function initializeModals() {
    // Page Modal
    const pageModal = document.getElementById('pageModal');
    const addPageBtn = document.getElementById('addPageBtn');
    const pageCloseBtn = pageModal.querySelector('.btn-close');
    const pageCancelBtn = pageModal.querySelector('.btn-cancel');
    const pageForm = document.getElementById('pageForm');
    const pageStatus = document.getElementById('pageStatus');
    const statusLabel = pageModal.querySelector('.status-label');

    // Show page modal
    addPageBtn.addEventListener('click', () => {
        pageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        pageForm.reset();
        pageModal.querySelector('h3').textContent = 'Add New Page';
    });

    // Hide page modal
    const hidePageModal = () => {
        pageModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    pageCloseBtn.addEventListener('click', hidePageModal);
    pageCancelBtn.addEventListener('click', hidePageModal);

    // Handle page form submission
    pageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(pageForm);
        const pageData = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            content: formData.get('content'),
            metaTitle: formData.get('metaTitle'),
            metaDescription: formData.get('metaDescription'),
            status: pageStatus.checked ? 'published' : 'draft'
        };

        try {
            if (pageForm.dataset.id) {
                // Update existing page
                await db.collection(COLLECTION_PAGES).updateOne({ _id: pageForm.dataset.id }, { $set: pageData });
            } else {
                // Create new page
                await db.collection(COLLECTION_PAGES).insertOne(pageData);
            }
            showNotification('Page saved successfully', 'success');
            hidePageModal();
            initializeContentManagement(); // Reload content
        } catch (error) {
            console.error('Error saving page:', error);
            showNotification('Error saving page', 'error');
        }
    });

    // Media Modal
    const mediaModal = document.getElementById('mediaModal');
    const uploadMediaBtn = document.getElementById('uploadMediaBtn');
    const mediaCloseBtn = mediaModal.querySelector('.btn-close');
    const mediaCancelBtn = mediaModal.querySelector('.btn-cancel');
    const uploadArea = mediaModal.querySelector('.upload-area');
    const fileInput = mediaModal.querySelector('input[type="file"]');
    const fileList = mediaModal.querySelector('.file-list');
    const uploadBtn = mediaModal.querySelector('.btn-upload');

    // Show media modal
    uploadMediaBtn.addEventListener('click', () => {
        mediaModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        fileList.innerHTML = '';
    });

    // Hide media modal
    const hideMediaModal = () => {
        mediaModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    mediaCloseBtn.addEventListener('click', hideMediaModal);
    mediaCancelBtn.addEventListener('click', hideMediaModal);

    // File upload functionality
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async () => {
        const files = Array.from(fileInput.files);
        fileList.innerHTML = '';

        for (const file of files) {
            try {
                // Create media item in database
                const mediaData = {
                    title: file.name,
                    type: file.type,
                    size: file.size,
                    url: URL.createObjectURL(file) // Temporary URL for demo
                };

                await db.collection(COLLECTION_MEDIA).insertOne(mediaData);

                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                `;
                fileList.appendChild(fileItem);
            } catch (error) {
                console.error('Error uploading file:', error);
                showNotification(`Error uploading ${file.name}`, 'error');
            }
        }

        showNotification('Files uploaded successfully', 'success');
        initializeContentManagement(); // Reload content
    });
}

// Filter functionality
function initializeFilters() {
    const typeFilter = document.querySelector('.filter-type');
    const statusFilter = document.querySelector('.filter-status');

    const filterContent = async () => {
        const type = typeFilter.value;
        const status = statusFilter.value;

        try {
            let filter = {};
            if (status) filter.status = status;

            switch (type) {
                case 'page':
                    const pages = await db.collection(COLLECTION_PAGES).find(filter).toArray();
                    displayPages(pages);
                    break;
                case 'section':
                    const sections = await db.collection(COLLECTION_SECTIONS).find(filter).toArray();
                    displaySections(sections);
                    break;
                case 'media':
                    const media = await db.collection(COLLECTION_MEDIA).find(filter).toArray();
                    displayMedia(media);
                    break;
                default:
                    // Load all content
                    initializeContentManagement();
            }
        } catch (error) {
            console.error('Error filtering content:', error);
            showNotification('Error filtering content', 'error');
        }
    };

    typeFilter.addEventListener('change', filterContent);
    statusFilter.addEventListener('change', filterContent);
}

// Initialize actions
function initializeActions() {
    // Edit content
    document.querySelectorAll('.btn-icon[title="Edit"]').forEach(button => {
        button.addEventListener('click', async () => {
            const card = button.closest('.content-card');
            const id = card.dataset.id;
            const type = getContentType(card);

            try {
                let content;
                switch (type) {
                    case 'page':
                        content = await db.collection(COLLECTION_PAGES).find({ _id: id }).toArray();
                        if (content.length > 0) {
                            populatePageForm(content[0]);
                        }
                        break;
                    case 'section':
                        content = await db.collection(COLLECTION_SECTIONS).find({ _id: id }).toArray();
                        if (content.length > 0) {
                            populateSectionForm(content[0]);
                        }
                        break;
                }
            } catch (error) {
                console.error('Error loading content for editing:', error);
                showNotification('Error loading content', 'error');
            }
        });
    });

    // Delete content
    document.querySelectorAll('.btn-icon[title="Delete"]').forEach(button => {
        button.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this item?')) {
                const card = button.closest('.content-card');
                const id = card.dataset.id;
                const type = getContentType(card);

                try {
                    switch (type) {
                        case 'page':
                            await db.collection(COLLECTION_PAGES).deleteOne({ _id: id });
                            break;
                        case 'section':
                            await db.collection(COLLECTION_SECTIONS).deleteOne({ _id: id });
                            break;
                        case 'media':
                            await db.collection(COLLECTION_MEDIA).deleteOne({ _id: id });
                            break;
                    }
                    showNotification('Item deleted successfully', 'success');
                    card.remove();
                } catch (error) {
                    console.error('Error deleting content:', error);
                    showNotification('Error deleting item', 'error');
                }
            }
        });
    });
}

// Utility functions
function getContentType(card) {
    const icon = card.querySelector('.card-header i');
    if (icon.classList.contains('fa-file-alt')) return 'page';
    if (icon.classList.contains('fa-layer-group')) return 'section';
    return 'media';
}

function populatePageForm(page) {
    const form = document.getElementById('pageForm');
    form.dataset.id = page._id;
    form.title.value = page.title;
    form.slug.value = page.slug;
    form.content.value = page.content;
    form.metaTitle.value = page.metaTitle;
    form.metaDescription.value = page.metaDescription;
    document.getElementById('pageStatus').checked = page.status === 'published';

    const modal = document.getElementById('pageModal');
    modal.classList.add('active');
    modal.querySelector('h3').textContent = 'Edit Page';
    document.body.style.overflow = 'hidden';
}

function populateSectionForm(section) {
    // Add your section form population logic here
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
    const contentCards = document.querySelectorAll('.content-card, .media-card');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        contentCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            
            const match = title.includes(query) || description.includes(query);
            card.style.display = match ? '' : 'none';
        });
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    document.body.appendChild(notification);
    
    // Add show class after a small delay for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
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

// Initialize image upload
function initializeImageUpload() {
    const imageUpload = document.querySelector('.image-upload');
    const fileInput = imageUpload.querySelector('input[type="file"]');
    const preview = imageUpload.querySelector('.preview');

    imageUpload.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.style.display = 'block';
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Initialize drop zone
function initializeDropZone() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.querySelector('.file-list');
    const totalFiles = document.getElementById('totalFiles');
    const totalSize = document.getElementById('totalSize');
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle selected files
    document.getElementById('selectFiles').addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('drag-over');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        files = [...files];
        updateFileInfo(files);
        files.forEach(uploadFile);
        files.forEach(previewFile);
    }

    function updateFileInfo(files) {
        totalFiles.textContent = files.length;
        const size = files.reduce((acc, file) => acc + file.size, 0);
        totalSize.textContent = formatFileSize(size);
    }

    function uploadFile(file, i) {
        const formData = new FormData();
        formData.append('file', file);

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = progress + '%';
            progressText.textContent = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                showNotification('File uploaded successfully', 'success');
            }
        }, 300);
    }

    function previewFile(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <i class="${getFileIcon(file.type)}"></i>
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                </div>
                <span class="file-status">Pending</span>
            `;
            fileList.appendChild(fileItem);
        }
    }

    function getFileIcon(type) {
        if (type.startsWith('image/')) return 'fas fa-image';
        if (type.startsWith('video/')) return 'fas fa-video';
        if (type === 'application/pdf') return 'fas fa-file-pdf';
        return 'fas fa-file';
    }
}

// Editor functionality
function initializeEditor() {
    const toolbar = document.querySelector('.editor-toolbar');
    const textarea = document.querySelector('textarea[name="content"]');

    toolbar.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const command = button.title.toLowerCase();
            const selection = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
            let replacement = '';

            switch (command) {
                case 'bold':
                    replacement = `**${selection}**`;
                    break;
                case 'italic':
                    replacement = `*${selection}*`;
                    break;
                case 'link':
                    const url = prompt('Enter URL:');
                    if (url) {
                        replacement = `[${selection}](${url})`;
                    }
                    break;
                case 'image':
                    const imageUrl = prompt('Enter image URL:');
                    if (imageUrl) {
                        replacement = `![${selection || 'Image'}](${imageUrl})`;
                    }
                    break;
                case 'list':
                    replacement = selection.split('\n').map(line => `- ${line}`).join('\n');
                    break;
                case 'code':
                    replacement = `\`\`\`\n${selection}\n\`\`\``;
                    break;
            }

            if (replacement) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
            }
        });
    });
}

// Initialize buttons
function initializeButtons() {
    console.log('Initializing buttons...');
    
    // Add Section Button
    const addSectionBtn = document.getElementById('addSectionBtn');
    console.log('Add Section Button:', addSectionBtn);
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add Section clicked');
            showSectionModal();
        });
    }

    // Add Page Button
    const addPageBtn = document.getElementById('addPageBtn');
    console.log('Add Page Button:', addPageBtn);
    if (addPageBtn) {
        addPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add Page clicked');
            showPageModal();
        });
    }

    // Initialize modal close buttons
    document.querySelectorAll('.btn-close, .btn-cancel').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Show Section Modal Function
function showSectionModal(sectionData = null) {
    console.log('Showing section modal');
    const modal = document.getElementById('sectionModal');
    if (!modal) {
        console.error('Section modal not found');
        return;
    }
    
    const form = document.getElementById('sectionForm');
    const title = modal.querySelector('h3');

    // Reset form
    form.reset();
    form.removeAttribute('data-id');

    if (sectionData) {
        title.textContent = 'Edit Section';
        form.dataset.id = sectionData._id;
        form.title.value = sectionData.title;
        form.description.value = sectionData.description;
        form.type.value = sectionData.type;
        form.background.value = sectionData.background;
        form.order.value = sectionData.order;
        document.getElementById('sectionStatus').checked = sectionData.status === 'published';
    } else {
        title.textContent = 'Add New Section';
        document.getElementById('sectionStatus').checked = true;
    }

    modal.style.display = 'block';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Show Page Modal Function
function showPageModal(pageData = null) {
    console.log('Showing page modal');
    const modal = document.getElementById('pageModal');
    if (!modal) {
        console.error('Page modal not found');
        return;
    }
    
    const form = document.getElementById('pageForm');
    const title = modal.querySelector('h3');

    // Reset form
    form.reset();
    form.removeAttribute('data-id');

    if (pageData) {
        title.textContent = 'Edit Page';
        form.dataset.id = pageData._id;
        form.title.value = pageData.title;
        form.slug.value = pageData.slug;
        form.content.value = pageData.content;
        form.metaTitle.value = pageData.metaTitle;
        form.metaDescription.value = pageData.metaDescription;
        document.getElementById('pageStatus').checked = pageData.status === 'published';
    } else {
        title.textContent = 'Add New Page';
        document.getElementById('pageStatus').checked = true;
    }

    modal.style.display = 'block';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Handle Section Form Submission
async function handleSectionSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const sectionData = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('type'),
        background: formData.get('background'),
        order: parseInt(formData.get('order')),
        status: document.getElementById('sectionStatus').checked ? 'published' : 'draft',
        lastUpdated: new Date()
    };

    try {
        if (form.dataset.id) {
            // Update existing section
            await db.collection(COLLECTION_SECTIONS).updateOne({ _id: form.dataset.id }, { $set: sectionData });
            showNotification('Section updated successfully', 'success');
        } else {
            // Create new section
            sectionData.createdAt = new Date();
            await db.collection(COLLECTION_SECTIONS).insertOne(sectionData);
            showNotification('Section created successfully', 'success');
        }

        // Close modal and refresh content
        document.getElementById('sectionModal').classList.remove('active');
        document.body.style.overflow = '';
        await loadContent();
    } catch (error) {
        console.error('Error saving section:', error);
        showNotification('Error saving section', 'error');
    }
}

// Handle Page Form Submission
async function handlePageSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Generate slug if empty
    let slug = formData.get('slug');
    if (!slug) {
        slug = formData.get('title')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    
    const pageData = {
        title: formData.get('title'),
        slug: slug,
        content: formData.get('content'),
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription'),
        status: document.getElementById('pageStatus').checked ? 'published' : 'draft',
        lastUpdated: new Date()
    };

    try {
        if (form.dataset.id) {
            // Update existing page
            await db.collection(COLLECTION_PAGES).updateOne({ _id: form.dataset.id }, { $set: pageData });
            showNotification('Page updated successfully', 'success');
        } else {
            // Create new page
            pageData.createdAt = new Date();
            await db.collection(COLLECTION_PAGES).insertOne(pageData);
            showNotification('Page created successfully', 'success');
        }

        // Close modal and refresh content
        document.getElementById('pageModal').classList.remove('active');
        document.body.style.overflow = '';
        await loadContent();
    } catch (error) {
        console.error('Error saving page:', error);
        showNotification('Error saving page', 'error');
    }
}

// Auto-generate slug from title
function initializeSlugGeneration() {
    const titleInput = document.querySelector('#pageForm input[name="title"]');
    const slugInput = document.querySelector('#pageForm input[name="slug"]');

    titleInput.addEventListener('input', (e) => {
        if (!slugInput.value) {
            slugInput.value = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
    });
}

// Preview functionality
function initializePreview() {
    document.querySelectorAll('.btn-icon[title="Preview"]').forEach(button => {
        button.addEventListener('click', async () => {
            const card = button.closest('.content-card');
            const id = card.dataset.id;
            const type = getContentType(card);
            const previewModal = document.getElementById('previewModal');
            const previewContent = previewModal.querySelector('.preview-content');

            try {
                let content;
                switch (type) {
                    case 'page':
                        content = await db.collection(COLLECTION_PAGES).find({ _id: id }).toArray();
                        if (content.length > 0) {
                            previewContent.innerHTML = marked(content[0].content);
                        }
                        break;
                    case 'section':
                        content = await db.collection(COLLECTION_SECTIONS).find({ _id: id }).toArray();
                        if (content.length > 0) {
                            previewContent.innerHTML = content[0].description;
                        }
                        break;
                }
                previewModal.classList.add('active');
            } catch (error) {
                console.error('Error loading preview:', error);
                showNotification('Error loading preview', 'error');
            }
        });
    });
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Form validation function
function validateForm(formData, type) {
    const errors = [];
    
    if (type === 'page') {
        if (!formData.get('title')) {
            errors.push('Page title is required');
        }
        if (!formData.get('content')) {
            errors.push('Page content is required');
        }
        if (formData.get('title') && formData.get('title').length < 3) {
            errors.push('Page title must be at least 3 characters long');
        }
    } else if (type === 'section') {
        if (!formData.get('title')) {
            errors.push('Section title is required');
        }
        if (!formData.get('type')) {
            errors.push('Section type is required');
        }
        if (formData.get('title') && formData.get('title').length < 3) {
            errors.push('Section title must be at least 3 characters long');
        }
    }
    
    return errors;
}

// Show form errors
function showFormErrors(errors, formId) {
    // Remove any existing error messages
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(e => e.remove());
    
    if (errors.length > 0) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-error';
        errorContainer.innerHTML = `
            <div class="error-header">Please fix the following errors:</div>
            <ul>
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        const form = document.getElementById(formId);
        form.insertBefore(errorContainer, form.firstChild);
        
        // Show error notification
        showNotification('Please fix the form errors', 'error');
    }
}

// ... existing code ... 