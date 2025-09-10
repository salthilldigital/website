// Apple-inspired smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    
    // Always start at the top of the page
    window.scrollTo(0, 0);
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const ctaButton = document.querySelector('.cta-button');
    
    function smoothScrollTo(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo(this.getAttribute('href'));
        });
    });
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Only prevent default for anchor links, not external links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(this.getAttribute('href'));
            }
        });
    }

    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Hide/show nav on scroll (Apple-like behavior)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Stagger animation for grid items
                if (entry.target.classList.contains('highlight') || 
                    entry.target.classList.contains('who-we-are-item') ||
                    entry.target.classList.contains('impact-item') ||
                    entry.target.classList.contains('funder-item')) {
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.highlight, .who-we-are-item, .impact-item, .funder-item, .mission-text, .contact-form-container');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Special observer for hero subtitle - fade in when scrolling down
    const heroSubtitleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const heroSubtitle = document.getElementById('hero-subtitle-below');
                if (heroSubtitle) {
                    heroSubtitle.style.transition = 'opacity 1.5s ease-out';
                    heroSubtitle.style.opacity = '1';
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe the hero section for subtitle animation
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        heroSubtitleObserver.observe(heroSection);
    }

    // Initialize EmailJS
    (function() {
        // EmailJS initialized with your public key
        // This key is safe to expose publicly - it's designed for client-side use
        emailjs.init('NV2ee11W2OkaqLW8d');
    })();

    // Form handling with EmailJS integration and FormSubmit fallback
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Basic form validation and security
        const validateForm = (form) => {
            const name = form.querySelector('input[name="user_name"]').value.trim();
            const email = form.querySelector('input[name="user_email"]').value.trim();
            const message = form.querySelector('textarea[name="message"]').value.trim();
            
            // Basic validation
            if (name.length < 2) {
                alert('Please enter a valid name (at least 2 characters)');
                return false;
            }
            
            if (!email.includes('@') || email.length < 5) {
                alert('Please enter a valid email address');
                return false;
            }
            
            if (message.length < 10) {
                alert('Please enter a message (at least 10 characters)');
                return false;
            }
            
            // Light spam protection - only check for obvious spam patterns
            const spamPatterns = ['free money', 'viagra', 'casino', 'lottery winner', 'click here now', 'make money fast'];
            const fullText = (name + ' ' + email + ' ' + message).toLowerCase();
            
            for (let pattern of spamPatterns) {
                if (fullText.includes(pattern)) {
                    alert('Your message appears to contain content that may be flagged as spam. Please revise and try again.');
                    return false;
                }
            }
            
            return true;
        };
        
        contactForm.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // Validate form before submission
            if (!validateForm(this)) {
                e.preventDefault();
                return;
            }
            
            // EmailJS is now the primary method (no FormSubmit fallback)
            
            // EmailJS handling (prevent default to handle with JavaScript)
            e.preventDefault();
            
            // Apple-like loading state
            submitButton.textContent = 'Sending...';
            submitButton.style.opacity = '0.7';
            submitButton.disabled = true;
            
            // Send email using EmailJS with your configured credentials
            emailjs.sendForm('service_nsj53ot', 'template_g67hmra', this)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Success animation
                    submitButton.textContent = '✓ Sent!';
                    submitButton.style.background = '#10b981';
                    
                    setTimeout(() => {
                        contactForm.reset();
                        submitButton.textContent = originalText;
                        submitButton.style.background = '#3CA1FF';
                        submitButton.style.opacity = '1';
                        submitButton.disabled = false;
                    }, 2000);
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Error animation
                    submitButton.textContent = '✗ Error';
                    submitButton.style.background = '#ef4444';
                    
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.style.background = '#3CA1FF';
                        submitButton.style.opacity = '1';
                        submitButton.disabled = false;
                    }, 2000);
                });
        });
    }

    // Parallax effect for floating elements
    const floatingElements = document.querySelectorAll('.element');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.highlight, .who-we-are-item, .impact-item, .funder-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
        });
    });

    // Complex hero animation sequence
    const heroAnimation = () => {
        const heroInitialLogo = document.getElementById('hero-initial-logo');
        const heroTitleContainer = document.getElementById('hero-title-container');
        const heroGif = document.getElementById('hero-gif');
        const heroTitleAbove = document.getElementById('hero-title-above');
        const heroSubtitleBelow = document.getElementById('hero-subtitle-below');
        const mainNav = document.getElementById('main-nav');
        
        if (!heroTitleContainer) return;
        
        // Check if page is being reloaded or returning from another page - if so, show quick fade-in animation
        if (performance.navigation.type === 1 || // 1 = reload
            sessionStorage.getItem('skipAnimation') === 'true') {
            // Set final positions immediately
            heroInitialLogo.style.opacity = '0';
            heroTitleContainer.style.opacity = '0';
            heroGif.style.top = '18%';
            heroGif.style.left = '1%';
            heroGif.style.right = '1%';
            heroGif.style.bottom = '15%';
            heroGif.style.borderRadius = '15px';
            heroGif.style.opacity = '0';
            heroTitleAbove.style.opacity = '0';
            mainNav.style.opacity = '0';
            
            // Quick fade-in animation for all elements
            setTimeout(() => {
                heroGif.style.transition = 'opacity 0.8s ease-out';
                heroGif.style.opacity = '1';
                
                heroTitleAbove.style.transition = 'opacity 0.8s ease-out';
                heroTitleAbove.style.opacity = '1';
                
                mainNav.style.transition = 'opacity 0.8s ease-out';
                mainNav.style.opacity = '1';
            }, 100);
            
            sessionStorage.removeItem('skipAnimation'); // Clear the flag
            return;
        }
        
        // Stage 1: Salt Hill Digital appears first (0-2s)
        setTimeout(() => {
            heroInitialLogo.style.transition = 'opacity 1.5s ease-out';
            heroInitialLogo.style.opacity = '1';
        }, 100);
        
        // Stage 1.5: Empowering Communities appears (1-3s)
        setTimeout(() => {
            heroTitleContainer.style.transition = 'opacity 2s ease-out';
            heroTitleContainer.style.opacity = '1';
        }, 1000);
        
        // Stage 1.7: Salt Hill Digital fades away after Empowering loads (2.5s)
        setTimeout(() => {
            heroInitialLogo.style.transition = 'opacity 1s ease-out';
            heroInitialLogo.style.opacity = '0';
        }, 2500);
        
        // Stage 2: GIF fades in full screen, header appears, and remaining title disappears (3-5s)
        setTimeout(() => {
            // Set GIF to full screen first
            heroGif.style.top = '0';
            heroGif.style.left = '0';
            heroGif.style.right = '0';
            heroGif.style.bottom = '0';
            heroGif.style.borderRadius = '0';
            heroGif.style.transition = 'opacity 1.5s ease-out';
            heroGif.style.opacity = '1';
            
            // Show header navigation at the same time as GIF
            mainNav.style.transition = 'opacity 1.5s ease-out';
            mainNav.style.opacity = '1';
            
            // Only fade out the Empowering Communities title (Salt Hill Digital already faded out)
            heroTitleContainer.style.transition = 'opacity 1s ease-out';
            heroTitleContainer.style.opacity = '0';
        }, 3000);
        
        // Stage 3: GIF shrinks to final position (5-7s)
        setTimeout(() => {
            // Shrink GIF to final position
            heroGif.style.transition = 'all 1.5s ease-out';
            heroGif.style.top = '18%';
            heroGif.style.left = '1%';
            heroGif.style.right = '1%';
            heroGif.style.bottom = '15%';
            heroGif.style.borderRadius = '15px';
        }, 5000);
        
        // Stage 4: Final content appears above GIF (7-9s)
        setTimeout(() => {
            // Show title above GIF
            heroTitleAbove.style.transition = 'opacity 1.5s ease-out';
            heroTitleAbove.style.opacity = '1';
        }, 7000);
    };
    
    // Start hero animation
    heroAnimation();

    // Smooth reveal animation for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 1500);
    }

    // CTA button reveal animation
    const ctaButtonElement = document.querySelector('.cta-button');
    if (ctaButtonElement) {
        ctaButtonElement.style.opacity = '0';
        ctaButtonElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            ctaButtonElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            ctaButtonElement.style.opacity = '1';
            ctaButtonElement.style.transform = 'translateY(0)';
        }, 2000);
    }

    // Section transition effects
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Mobile menu functionality (for future enhancement)
    const createMobileMenu = () => {
        const nav = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #2563eb;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: background-color 0.3s ease;
        `;
        
        nav.appendChild(mobileMenuBtn);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
            this.innerHTML = navLinks.classList.contains('mobile-open') ? '✕' : '☰';
        });
        
        // Show/hide mobile menu button based on screen size
        const checkScreenSize = () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
                navLinks.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    flex-direction: column;
                    padding: 2rem;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: none;
                    border-radius: 0 0 20px 20px;
                `;
            } else {
                mobileMenuBtn.style.display = 'none';
                navLinks.style.cssText = '';
            }
        };
        
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    };
    
    createMobileMenu();

    // Smooth page load animation
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
});

// Utility function for smooth animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Performance optimization: throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(animateOnScroll, 16));

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', animateOnScroll);