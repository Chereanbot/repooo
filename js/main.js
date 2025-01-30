// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;
    
    // Enhanced navbar scroll effect
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Scroll direction detection
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Navbar background opacity
        if (currentScroll > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(5px)';
        }
        
        lastScroll = currentScroll;
    });

    // Enhanced mobile menu interactions
    document.addEventListener('click', function(e) {
        if (navbarCollapse.classList.contains('show') && 
            !navbarCollapse.contains(e.target) && 
            !navbarToggler.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navbarCollapse.classList.contains('show')) {
            closeMenu();
        }
    });

    // Enhanced nav link interactions
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                closeMenu();
            }
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            link.classList.add('active');
        });

        // Add hover effect
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Prevent body scroll when mobile menu is open
    function toggleBodyScroll(disable) {
        document.body.style.overflow = disable ? 'hidden' : '';
        document.body.style.paddingRight = disable ? 
            window.innerWidth - document.documentElement.clientWidth + 'px' : '';
    }

    // Enhanced menu open/close functions
    function openMenu() {
        navbarToggler.setAttribute('aria-expanded', 'true');
        navbarCollapse.classList.add('show');
        toggleBodyScroll(true);
        
        // Animate menu items
        const menuItems = navbarCollapse.querySelectorAll('.nav-item');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 * (index + 1));
        });
    }

    function closeMenu() {
        navbarToggler.setAttribute('aria-expanded', 'false');
        navbarCollapse.classList.remove('show');
        toggleBodyScroll(false);
        
        // Reset menu items
        const menuItems = navbarCollapse.querySelectorAll('.nav-item');
        menuItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(50px)';
        });
    }

    // Enhanced navbar toggler
    navbarToggler.addEventListener('click', function() {
        if (this.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Enhanced smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without scrolling
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });

    // Active link highlighting based on scroll position
    window.addEventListener('scroll', function() {
        let fromTop = window.scrollY + 150;

        navLinks.forEach(link => {
            let section = document.querySelector(link.hash);
            
            if (section && 
                section.offsetTop <= fromTop && 
                section.offsetTop + section.offsetHeight > fromTop) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });

    // Initialize services and careers sections
    const servicesSection = document.getElementById('services');
    const careersSection = document.getElementById('careers');
    
    if (servicesSection) {
        servicesSection.style.display = 'block';
        servicesSection.style.opacity = '1';
        const serviceCards = servicesSection.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }
    
    if (careersSection) {
        careersSection.style.display = 'block';
        careersSection.style.opacity = '1';
        const careerCards = careersSection.querySelectorAll('.career-card');
        careerCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }

    // Modified Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards with modified settings
    document.querySelectorAll('.feature-card, .service-card, .team-card, .career-card').forEach(card => {
        observer.observe(card);
    });

    // Add active state to navigation links
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add animation class to button
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.classList.add('sending');
            submitButton.textContent = 'Sending...';

            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                submitButton.classList.remove('sending');
                submitButton.textContent = 'Message Sent!';
                submitButton.classList.add('sent');
                
                // Reset form
                this.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitButton.textContent = 'Send Message';
                    submitButton.classList.remove('sent');
                }, 3000);
            }, 1500);
        });
    }

    // Add hover effect to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('i').style.transform = 'scale(1.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('i').style.transform = 'scale(1)';
        });
    });

    // Add animation class when elements come into view
    const animatedElements = document.querySelectorAll('.section-title, .hero-section h1, .hero-section p');
    animatedElements.forEach(el => observer.observe(el));

    // Create stars
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            starsContainer.appendChild(star);
        }
    }

    // Interactive glow effect
    document.querySelectorAll('section').forEach(section => {
        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / section.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / section.clientHeight) * 100;
            section.style.setProperty('--x', `${x}%`);
            section.style.setProperty('--y', `${y}%`);
        });
    });

    // Create shooting stars dynamically
    const enhancedStars = document.querySelector('.enhanced-stars');
    if (enhancedStars) {
        setInterval(() => {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.top = Math.random() * 100 + '%';
            star.style.left = Math.random() * 100 + '%';
            enhancedStars.appendChild(star);
            
            // Remove the star after animation
            setTimeout(() => {
                star.remove();
            }, 3000);
        }, 2000);
    }
}); 