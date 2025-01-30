// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard();
});

// Initialize dashboard components
function initializeDashboard() {
    updateCurrentDate();
    initializeSidebar();
    initializeCharts();
    initializeNotifications();
    initializeSearch();
    initializeQuickActions();
}

// Update current date
function updateCurrentDate() {
    const dateElement = document.querySelector('.current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString('en-US', options);
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
        window.location.href = 'login.html';
    });
}

// Initialize charts
function initializeCharts() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    const trafficData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Page Views',
            data: [3200, 4100, 3800, 5200, 4800, 3900, 4500],
            borderColor: '#c9af1b',
            backgroundColor: 'rgba(201, 175, 27, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    new Chart(trafficCtx, {
        type: 'line',
        data: trafficData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(201, 175, 27, 0.1)'
                    },
                    ticks: {
                        color: '#B8860B'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(201, 175, 27, 0.1)'
                    },
                    ticks: {
                        color: '#B8860B'
                    }
                }
            }
        }
    });

    // Demographics Chart
    const demographicsCtx = document.getElementById('demographicsChart').getContext('2d');
    const demographicsData = {
        labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
        datasets: [{
            data: [15, 30, 25, 18, 12],
            backgroundColor: [
                '#c9af1b',
                '#B8860B',
                '#E5C100',
                '#FFD700',
                '#DAA520'
            ]
        }]
    };

    new Chart(demographicsCtx, {
        type: 'doughnut',
        data: demographicsData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#B8860B'
                    }
                }
            }
        }
    });

    // Chart period buttons
    const chartButtons = document.querySelectorAll('.btn-chart');
    chartButtons.forEach(button => {
        button.addEventListener('click', () => {
            chartButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Here you would typically update the chart data based on the selected period
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
                <i class="fas fa-file-alt"></i>
                <div class="notification-content">
                    <p>Content updated</p>
                    <span>2 hours ago</span>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-envelope"></i>
                <div class="notification-content">
                    <p>New message received</p>
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

    // Add notification dropdown styles
    const style = document.createElement('style');
    style.textContent = `
        .notifications-dropdown {
            background: var(--admin-card-bg);
            border: 1px solid var(--admin-border);
            border-radius: 12px;
            padding: 1rem;
            min-width: 300px;
            z-index: 1000;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .notification-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid var(--admin-border);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .notification-item:last-child {
            border-bottom: none;
        }

        .notification-item:hover {
            background: var(--admin-input-bg);
            border-radius: 8px;
        }

        .notification-item i {
            color: var(--admin-primary);
        }

        .notification-content p {
            margin: 0;
            color: var(--admin-primary);
        }

        .notification-content span {
            font-size: 0.8rem;
            color: var(--admin-secondary);
        }
    `;
    document.head.appendChild(style);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // Here you would typically implement the search functionality
        // For example, filtering content or making API calls
    });
}

// Quick actions functionality
function initializeQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.trim();
            // Here you would typically handle each quick action
            // For example, opening modals or navigating to specific pages
            console.log(`Quick action clicked: ${action}`);
        });
    });
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