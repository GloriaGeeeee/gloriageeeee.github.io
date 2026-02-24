/**
 * ==========================================
 * GLORIA YUNHAN GAO - PORTFOLIO WEBSITE
 * JavaScript Interactions
 * ==========================================
 * This file handles all the interactive features:
 * - Mobile menu toggle
 * - Smooth scrolling
 * - Scroll animations
 * - Active navigation highlighting
 * ==========================================
 */

// Wait for the page to fully load before running any code
document.addEventListener('DOMContentLoaded', function() {

    // ==================== YEARS OF EXPERIENCE CALCULATOR ====================
    // Dynamically calculates years since Aug 03, 2020
    const yearsCountElement = document.getElementById('years-count');
    if (yearsCountElement) {
        const startDate = new Date('2020-08-03');
        const now = new Date();
        const diffInMs = now - startDate;
        const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
        const years = Math.floor(diffInMs / msPerYear);
        yearsCountElement.textContent = years + '+';
    }

    // ==================== MOBILE MENU ====================
    // This makes the hamburger menu work on mobile devices

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        // When the hamburger button is clicked, toggle the menu open/closed
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle 'active' class on both button and menu
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked (for better mobile experience)
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ==================== SMOOTH SCROLLING ====================
    // Makes clicking on navigation links scroll smoothly to the section
    // instead of jumping instantly

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Only process if it's an actual anchor link (not just "#")
            if (href !== '#' && href.length > 1) {
                e.preventDefault(); // Stop the default jump behavior

                const targetElement = document.querySelector(href);

                if (targetElement) {
                    // Calculate position accounting for fixed navbar
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ==================== SCROLL ANIMATIONS ====================
    // Makes elements fade in when they scroll into view
    // This creates a more engaging experience as users scroll

    // Create an Intersection Observer - this watches for elements
    // entering the viewport (the visible area of the page)
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Add 'visible' class when element enters viewport
                entry.target.classList.add('visible');
                // Optional: stop observing after animation (uncomment if desired)
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all case study cards for scroll animation
    const caseStudies = document.querySelectorAll('.case-study');
    caseStudies.forEach(function(study) {
        study.classList.add('animate-on-scroll');
        observer.observe(study);
    });

    // ==================== ACTIVE NAVIGATION ====================
    // Highlights the current section in the navigation as you scroll

    const sections = document.querySelectorAll('section[id]');
    const navLinksForHighlight = document.querySelectorAll('.nav-link[href^="#"]');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 150; // Offset for better accuracy

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Check if current scroll position is within this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove 'active' from all links
                navLinksForHighlight.forEach(function(link) {
                    link.classList.remove('active');
                });

                // Add 'active' to the corresponding link
                const activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Run on scroll
    window.addEventListener('scroll', highlightNavigation);
    // Run once on page load
    highlightNavigation();

    // ==================== ROTATING WORD ANIMATION ====================
    // Rotates through words with typing effect and color changes

    const rotatingWord = document.querySelector('.rotating-word');

    if (rotatingWord) {
        const words = rotatingWord.dataset.words.split(',');
        const colors = rotatingWord.dataset.colors.split(',');
        let currentIndex = 0;

        // Set initial color
        rotatingWord.classList.add('color-' + colors[0]);

        function typeWord(word, colorClass, callback) {
            let charIndex = 0;
            rotatingWord.textContent = '';

            // Remove all color classes and add the new one
            colors.forEach(c => rotatingWord.classList.remove('color-' + c));
            rotatingWord.classList.add('color-' + colorClass);

            function typeChar() {
                if (charIndex < word.length) {
                    rotatingWord.textContent += word[charIndex];
                    charIndex++;
                    setTimeout(typeChar, 100);
                } else if (callback) {
                    setTimeout(callback, 2000); // Wait before deleting
                }
            }
            typeChar();
        }

        function deleteWord(callback) {
            function deleteChar() {
                const currentText = rotatingWord.textContent;
                if (currentText.length > 0) {
                    rotatingWord.textContent = currentText.slice(0, -1);
                    setTimeout(deleteChar, 50);
                } else if (callback) {
                    callback();
                }
            }
            deleteChar();
        }

        function rotateWords() {
            deleteWord(function() {
                currentIndex = (currentIndex + 1) % words.length;
                typeWord(words[currentIndex], colors[currentIndex], rotateWords);
            });
        }

        // Start rotation after initial delay
        setTimeout(rotateWords, 3000);
    }

    // ==================== PARALLAX EFFECT ====================
    // Subtle movement of hero visual elements on scroll

    const heroVisuals = document.querySelector('.hero-visuals');
    const badgeYears = document.querySelector('.badge-years');
    const badgeLocation = document.querySelector('.badge-location');

    function handleParallax() {
        const scrolled = window.scrollY;

        // Only apply parallax when hero section is visible
        if (scrolled < window.innerHeight) {
            if (badgeYears) {
                badgeYears.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            if (badgeLocation) {
                badgeLocation.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
        }
    }

    // Use requestAnimationFrame for smooth parallax
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ==================== BUTTON HOVER EFFECTS ====================
    // Adds ripple effect to buttons (optional enhancement)

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(function(button) {
        button.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0)';
        });
    });

    // ==================== PERFORMANCE OPTIMIZATION ====================
    // Throttle scroll events for better performance

    let scrollTimeout;

    function throttledScroll(callback) {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(callback);
    }

    // ==================== CONSOLE MESSAGE ====================
    // A little easter egg for developers who open the console

    console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold;');
    console.log('%cThis portfolio was crafted with care by Gloria Yunhan Gao.', 'font-size: 14px;');
    console.log('%cInterested in working together? Let\'s connect!', 'font-size: 14px;');

});

// ==================== CSS FOR SCROLL ANIMATIONS ====================
// Inject CSS for scroll animations (keeps all animation code in one file)

const scrollAnimationStyles = document.createElement('style');
scrollAnimationStyles.textContent = `
    /* Initial state for scroll animations */
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s cubic-bezier(0.25, 0.1, 0.25, 1),
                    transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    /* Visible state after scrolling into view */
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Active navigation link */
    .nav-link.active {
        color: var(--color-coral) !important;
    }
`;

document.head.appendChild(scrollAnimationStyles);
