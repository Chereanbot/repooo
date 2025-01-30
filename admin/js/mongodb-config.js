// MongoDB Configuration
const MONGODB_CONFIG = {
    uri: 'mongodb+srv://aman:aman123@cluster0.eevte.mongodb.net/aman',
    dbName: 'aman'
};

// Initialize MongoDB Client
const client = new MongoClient(MONGODB_CONFIG.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database Collections
const COLLECTION_PAGES = 'pages';
const COLLECTION_SECTIONS = 'sections';
const COLLECTION_MEDIA = 'media';

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
        return client.db(MONGODB_CONFIG.dbName);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        throw error;
    }
}

// Export the connection and collections
window.db = null;
window.connectToMongoDB = connectToMongoDB;
window.COLLECTION_PAGES = COLLECTION_PAGES;
window.COLLECTION_SECTIONS = COLLECTION_SECTIONS;
window.COLLECTION_MEDIA = COLLECTION_MEDIA;

// MongoDB Connection Class
class MongoDBConnection {
    constructor() {
        this.client = null;
        this.db = null;
    }

    async connect() {
        try {
            if (!this.client) {
                this.client = await mongodb.connect(MONGODB_CONFIG.uri, MONGODB_CONFIG.options);
                this.db = this.client.db('aman');
                console.log('Connected to MongoDB');
            }
            return this.db;
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    async getCollection(name) {
        if (!this.db) {
            await this.connect();
        }
        return this.db.collection(name);
    }

    async close() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
        }
    }
}

// Database Operations Class
class DatabaseOperations {
    constructor() {
        this.connection = new MongoDBConnection();
    }

    // Pages Operations
    async createPage(pageData) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.pages);
        return await collection.insertOne({
            ...pageData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async getPages(filter = {}) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.pages);
        return await collection.find(filter).toArray();
    }

    async updatePage(id, pageData) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.pages);
        return await collection.updateOne(
            { _id: mongodb.ObjectId(id) },
            { 
                $set: {
                    ...pageData,
                    updatedAt: new Date()
                }
            }
        );
    }

    async deletePage(id) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.pages);
        return await collection.deleteOne({ _id: mongodb.ObjectId(id) });
    }

    // Sections Operations
    async createSection(sectionData) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.sections);
        return await collection.insertOne({
            ...sectionData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async getSections(filter = {}) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.sections);
        return await collection.find(filter).toArray();
    }

    async updateSection(id, sectionData) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.sections);
        return await collection.updateOne(
            { _id: mongodb.ObjectId(id) },
            { 
                $set: {
                    ...sectionData,
                    updatedAt: new Date()
                }
            }
        );
    }

    async deleteSection(id) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.sections);
        return await collection.deleteOne({ _id: mongodb.ObjectId(id) });
    }

    // Media Operations
    async createMedia(mediaData) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.media);
        return await collection.insertOne({
            ...mediaData,
            uploadedAt: new Date()
        });
    }

    async getMedia(filter = {}) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.media);
        return await collection.find(filter).toArray();
    }

    async updateMedia(id, mediaData) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.media);
        return await collection.updateOne(
            { _id: mongodb.ObjectId(id) },
            { 
                $set: {
                    ...mediaData,
                    updatedAt: new Date()
                }
            }
        );
    }

    async deleteMedia(id) {
        const collection = await this.connection.getCollection(MONGODB_CONFIG.collections.media);
        return await collection.deleteOne({ _id: mongodb.ObjectId(id) });
    }
}

// Display functions
function displayPages(pages) {
    const contentGrid = document.querySelector('.content-grid');
    contentGrid.innerHTML = '';

    pages.forEach(page => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.dataset.id = page._id;
        card.innerHTML = `
            <div class="card-header">
                <i class="fas fa-file-alt"></i>
                <h4>${page.title}</h4>
                <span class="badge-status ${page.status}">${page.status}</span>
            </div>
            <div class="card-body">
                <p>${page.metaDescription || 'No description available'}</p>
            </div>
            <div class="card-footer">
                <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" title="Preview"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        contentGrid.appendChild(card);
    });
}

function displaySections(sections) {
    const contentGrid = document.querySelector('.content-grid');
    contentGrid.innerHTML = '';

    sections.forEach(section => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.dataset.id = section._id;
        card.innerHTML = `
            <div class="card-header">
                <i class="fas fa-layer-group"></i>
                <h4>${section.title}</h4>
                <span class="badge-status ${section.status}">${section.status}</span>
            </div>
            <div class="card-body">
                <p>${section.description || 'No description available'}</p>
            </div>
            <div class="card-footer">
                <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" title="Preview"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        contentGrid.appendChild(card);
    });
}

function displayMedia(media) {
    const mediaGrid = document.querySelector('.media-grid');
    mediaGrid.innerHTML = '';

    media.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.dataset.id = item._id;
        card.innerHTML = `
            <div class="media-preview">
                ${item.type.startsWith('image/') 
                    ? `<img src="${item.url}" alt="${item.title}">`
                    : `<i class="fas fa-file"></i>`
                }
            </div>
            <div class="media-info">
                <h4>${item.title}</h4>
                <span class="media-type">${item.type}</span>
                <span class="media-size">${formatFileSize(item.size)}</span>
            </div>
            <div class="media-actions">
                <button class="btn-icon" title="Download"><i class="fas fa-download"></i></button>
                <button class="btn-icon" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        mediaGrid.appendChild(card);
    });
}

// Utility function
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 