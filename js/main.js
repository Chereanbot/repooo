// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

    // Section content animation
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate failing arrows
                const arrow = entry.target.querySelector('.failing-arrow');
                if (arrow) {
                    arrow.style.animationPlayState = 'running';
                }
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll('.section-content').forEach(section => {
        sectionObserver.observe(section);
    });

    // Create section indicators
    const sections = document.querySelectorAll('section[id]');
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'section-indicator';
    
    sections.forEach((section, index) => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        indicatorContainer.appendChild(dot);
    });
    
    document.body.appendChild(indicatorContainer);

    // Update active indicator on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
            dot.classList.remove('active');
            if (sections[index].getAttribute('id') === current) {
                dot.classList.add('active');
            }
        });
    });

    // Animate arrows on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        const arrows = document.querySelectorAll('.failing-arrow');
        
        arrows.forEach(arrow => {
            const rect = arrow.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (st > lastScrollTop) {
                    // Scrolling down
                    arrow.style.animationPlayState = 'running';
                } else {
                    // Scrolling up
                    arrow.style.animationPlayState = 'paused';
                }
            }
        });
        lastScrollTop = st <= 0 ? 0 : st;
    });

    // Initialize section content positions
    document.querySelectorAll('.section-content').forEach((content, index) => {
        if (index % 2 === 0) {
            content.style.transform = 'translateX(-30px)';
        } else {
            content.style.transform = 'translateX(30px)';
        }
    });

    // Create arrow trails
    document.querySelectorAll('section').forEach(section => {
        const trail = document.createElement('div');
        trail.className = 'arrow-trail';
        section.appendChild(trail);
    });

    // Add flow indicators
    document.querySelectorAll('section').forEach(section => {
        const indicator = document.createElement('div');
        indicator.className = 'flow-indicator';
        section.appendChild(indicator);
    });
}); 