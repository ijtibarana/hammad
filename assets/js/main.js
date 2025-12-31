// Main JS for Hammad Portfolio - Powered by GSAP & Three.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis & GSAP
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, Draggable);

        // Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Connect Lenis to ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Animations
        initHeroRevealV2();
        initPlaybookSlider();
        initFooterMarquee();
        initGlobalReveals();
        init3DHeader();
        initMobileMenu();
        init3DParallax();
        initReviewsSlider();

        // Scroll to Top Logic
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                lenis.scrollTo(0);
            });
        }
    }

    // 2. Preloader Logic (Robust & Simple)
    const initPreloader = () => {
        const leftPct = document.getElementById('loader-pct-left');
        const rightPct = document.getElementById('loader-pct-right');
        const preloader = document.getElementById('preloader');
        const count = { val: 0 };

        if (!preloader) return;

        // Ensure we reveal even if something fails
        const forceReveal = setTimeout(() => {
            document.body.classList.add('loaded');
        }, 5000);

        gsap.to(count, {
            val: 100,
            duration: 2.5,
            ease: "power2.inOut",
            onUpdate: () => {
                const p = Math.floor(count.val) + "%";
                if (leftPct) leftPct.innerText = p;
                if (rightPct) rightPct.innerText = p;
            },
            onComplete: () => {
                clearTimeout(forceReveal);

                // Premium Curtain Reveal Animation
                const tl = gsap.timeline({
                    onComplete: () => {
                        document.body.classList.add('loaded');
                        if (preloader) preloader.style.display = "none";
                        ScrollTrigger.refresh(); // Crucial for Lenis/GSAP sync
                    }
                });

                tl.to(preloader, {
                    y: "-100%",
                    duration: 1.2,
                    ease: "expo.inOut"
                }, 0)
                    .fromTo("#loader-curtain", {
                        y: "100%"
                    }, {
                        y: "-100%",
                        duration: 1.5,
                        ease: "expo.inOut",
                        display: "block"
                    }, 0.1);
            }
        });
    };

    initPreloader();
    initCustomCursor();
});

/* --- GRAPH STYLE CUSTOM CURSOR --- */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const hLine = document.querySelector('.crosshair-h');
    const vLine = document.querySelector('.crosshair-v');
    if (!cursor || !hLine || !vLine) return;

    let cursorVisible = false;

    window.addEventListener('mousemove', (e) => {
        if (!cursorVisible) {
            cursorVisible = true;
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
        }

        const x = e.clientX;
        const y = e.clientY;

        // Move the lines
        gsap.to(hLine, { top: y, duration: 0.1, ease: "power2.out" });
        gsap.to(vLine, { left: x, duration: 0.1, ease: "power2.out" });

        // Update CSS variable for the center circle
        cursor.style.setProperty('--cursor-x', `${x}px`);
        cursor.style.setProperty('--cursor-y', `${y}px`);
    });

    // Interactive elements scaling
    const interactiveElements = document.querySelectorAll('a, button, .action-pill, .scroll-top-btn, .project-item, .nav__mobile-toggle, .menu-close-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { opacity: 0.5, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
        });
    });
}

/* --- GLOBAL REVEALS (Fast Loading) --- */
function initGlobalReveals() {
    // Fast Staggered Text Reveal
    gsap.utils.toArray('.thunder-title, .block-text, .philosophy-quote p, .toolkit-grid').forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05
        });
    });

    // Section-wide transitions removed per user request

    // Bio Section Animation
    gsap.from('.bio-text p', {
        scrollTrigger: {
            trigger: '.bio-section',
            start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.bio-right', {
        scrollTrigger: {
            trigger: '.bio-section',
            start: 'top 75%',
        },
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });
}


/* --- MOBILE MENU LOGIC --- */
function initMobileMenu() {
    const toggle = document.querySelector('.nav__mobile-toggle');
    const nav = document.querySelector('.nav-new');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.menu-close-btn');
    const links = document.querySelectorAll('.menu-item, .email-capsule, .social-circle');

    if (!toggle || !nav || !overlay) return;

    const openMenu = () => {
        nav.classList.add('menu-open');
        gsap.to(overlay, { opacity: 1, visibility: 'visible', duration: 0.5, ease: "power2.out" });
        gsap.from('.menu-item', { y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", delay: 0.2 });
    };

    const closeMenu = () => {
        nav.classList.remove('menu-open');
        gsap.to(overlay, {
            opacity: 0,
            visibility: 'hidden',
            duration: 0.5,
            ease: "power2.in"
        });
    };

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('menu-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close menu when links are clicked
    const menuLinks = document.querySelectorAll('.menu-item'); // Re-selecting for clarity, or use existing 'links' if appropriate
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* --- HERO REVEAL v2 (Staggered) --- */
function initHeroRevealV2() {
    const revealItems = document.querySelectorAll('.hero-v2 .reveal-item');
    if (revealItems.length === 0) return;

    // Timeline for hero reveal
    const tl = gsap.timeline({
        delay: 0.5 // Start after preloader starts clearing
    });

    tl.to(revealItems, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "expo.out"
    });
}

/* --- 3D INTERACTIVE HEADER --- */
function init3DHeader() {
    const nav = document.querySelector('.nav-new');
    if (!nav) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to(nav, {
            rotateY: x,
            rotateX: -y,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    // Scrolled state
    ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
            if (self.direction === 1) {
                nav.classList.add('scrolled');
                gsap.to(nav, { yPercent: -10, duration: 0.3 });
            } else {
                nav.classList.remove('scrolled');
                gsap.to(nav, { yPercent: 0, duration: 0.3 });
            }
        }
    });
}

/* --- PARALLAX & MOUSE EFFECTS --- */
function initParallax() {
    document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);

        const parallaxElements = document.querySelectorAll("[data-depth], .decoration, .script-accent, .floating-img");

        parallaxElements.forEach(el => {
            const depth = el.getAttribute("data-depth") || 0.3;
            const moveX = x * 150 * depth;
            const moveY = y * 150 * depth;
            const rotateX = y * 30 * depth;
            const rotateY = x * -30 * depth;

            gsap.to(el, {
                x: moveX,
                y: moveY,
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 1.5,
                ease: "power3.out",
                transformPerspective: 1200
            });
        });
    });

    // Simple scroll parallax for titles
    gsap.utils.toArray(".thunder-text, .thunder-title").forEach(title => {
        gsap.to(title, {
            scrollTrigger: {
                trigger: title,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: -50,
            ease: "none"
        });
    });
}

/* --- THREE.JS SMOKE (DISABLED AS REQ) --- */
function initSmoke() {
    // Hidden per request
}

/* --- GSAP ANIMATIONS --- */
function initHeroAnimation() {
    const bannerTitle = document.querySelector(".ban__title");
    if (bannerTitle) {
        gsap.from(".ban__title .a-word", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            delay: 1.2
        });
    }

    gsap.from(".ban__desc", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1.8,
        ease: "power2.out"
    });
}

function initHeroMarquee() {
    const track = document.querySelector('.hero__footer-text .marquee-track');
    if (!track) return;

    // Create a seamless loop
    const items = track.querySelectorAll('.marquee-item');
    const totalWidth = track.scrollWidth;

    gsap.to(track, {
        x: -totalWidth / 2,
        duration: 30,
        ease: "none",
        repeat: -1
    });
}

function initScrollAnimations() {
    // Typography Section Animation
    gsap.utils.toArray('.line').forEach((line, i) => {
        const block = line.querySelector('.block-text');
        const script = line.querySelector('.script-text');

        if (block) {
            gsap.from(block, {
                scrollTrigger: {
                    trigger: line,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                },
                y: 100,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });
        }

        if (script) {
            gsap.from(script, {
                scrollTrigger: {
                    trigger: line,
                    start: "top 85%",
                    scrub: 1
                },
                x: i % 2 === 0 ? -50 : 50,
                duration: 1
            });
        }
    });
}

function initMenu() {
    const btn = document.querySelector('.nav__menu-btn');
    const menu = document.querySelector('.nav__menu');
    const bg = document.querySelector('.nav__menu__bg');
    const content = document.querySelector('.nav__menu__content');
    const links = document.querySelectorAll('.menu__links a');

    if (!btn || !menu) return;

    let isOpen = false;

    btn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            menu.style.pointerEvents = 'all';
            gsap.to(bg, { height: '100%', duration: 0.6, ease: 'power3.inOut' });
            gsap.to(content, { opacity: 1, duration: 0.4, delay: 0.3 });
            gsap.to(links, { y: '0%', stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.4 });
        } else {
            menu.style.pointerEvents = 'none';
            gsap.to(links, { y: '100%', duration: 0.3, stagger: 0.05, ease: 'power2.in' });
            gsap.to(content, { opacity: 0, duration: 0.3 });
            gsap.to(bg, { height: '0%', duration: 0.6, ease: 'power3.inOut', delay: 0.2 });
        }
    });
}

function initDraggable() {
    const track = document.querySelector('.track');
    if (typeof Draggable !== 'undefined' && track) {
        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;

        Draggable.create(track, {
            type: "x",
            inertia: true,
            bounds: {
                minX: - (trackWidth - windowWidth + 50),
                maxX: 0
            },
            edgeResistance: 0.65,
            cursor: "grab",
            activeCursor: "grabbing"
        });
    }
}

/* --- PLAYBOOK SLIDER (INFINITE MARQUEE) --- */
function initPlaybookSlider() {
    const slider = document.querySelector('.playbook-slider');
    if (!slider) return;

    // Get the actual width of the slider content
    const sliderWidth = slider.offsetWidth;

    // Create an infinite horizontal scroll
    // We animate the xPercent of the entire track
    // Since we duplicated content in HTML, we can loop seamlessly

    const animation = gsap.to(slider, {
        x: () => -(slider.scrollWidth / 2) - 16, // Half the width (since we duplicated) 
        duration: 40,
        ease: "none",
        repeat: -1,
        transformOrigin: "left center"
    });

    // Slow down on hover
    slider.addEventListener('mouseenter', () => {
        gsap.to(animation, { timeScale: 0.2, duration: 1, ease: "power2.out" });
    });

    slider.addEventListener('mouseleave', () => {
        gsap.to(animation, { timeScale: 1, duration: 1, ease: "power2.out" });
    });
}

/* --- FOOTER MARQUEE --- */
function initFooterMarquee() {
    const track = document.querySelector('.footer-marquee-track');
    if (!track) return;

    const content = track.querySelector('.footer-marquee-content');
    if (!content) return;

    const totalWidth = content.offsetWidth;

    // Seamless loop using GSAP
    gsap.to(track, {
        x: -totalWidth,
        duration: 30,
        ease: "none",
        repeat: -1
    });

    // Slow down on hover
    track.addEventListener('mouseenter', () => {
        gsap.to(gsap.getTweensOf(track), { timeScale: 0.2, duration: 1 });
    });

    track.addEventListener('mouseleave', () => {
        gsap.to(gsap.getTweensOf(track), { timeScale: 1, duration: 1 });
    });
}
/* --- ADVANCED 3D PARALLAX SYSTEM --- */
/* --- CONSOLIDATED 3D PARALLAX & REVEAL SYSTEM --- */
function init3DParallax() {
    // 1. Scroll-Based Parallax for marked assets (Depth-aware)
    gsap.utils.toArray('[data-parallax-3d]').forEach(asset => {
        const depth = asset.getAttribute('data-parallax-3d') || 0.1;
        gsap.to(asset, {
            y: (i, target) => -ScrollTrigger.maxScroll(window) * depth * 0.1,
            z: depth * 100, // Added depth movement
            ease: "none",
            scrollTrigger: {
                trigger: asset,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 2. Global Text Parallax (General depth)
    gsap.utils.toArray('.thunder-title, .thunder-text:not(.reveal-stagger), .thunder-title-project, .praxis, .script-overlay').forEach(text => {
        gsap.to(text, {
            y: -100,
            ease: "none",
            scrollTrigger: {
                trigger: text,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 3. Staggered Reveal for Services Grid Headings (BRANDING, etc.)
    const serviceTitles = gsap.utils.toArray('.reveal-stagger');
    if (serviceTitles.length > 0) {
        gsap.to(serviceTitles, {
            scrollTrigger: {
                trigger: '.grid-container',
                start: "top 95%", // More sensitive for immediate reveal
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1, // Faster stagger
            ease: "power4.out"
        });
    }

    // 4. --- ADVANCED PROJECT 3D GLIDE ---
    gsap.utils.toArray('.project-item').forEach(item => {
        const media = item.querySelector('.media-container');
        const info = item.querySelector('.project-info');
        if (!media) return;

        // 3D Media Entrance & Glide
        gsap.fromTo(media, {
            z: -300,
            rotateX: 25,
            scale: 0.85,
            opacity: 0.3,
            transformPerspective: 2000
        }, {
            z: 150,
            rotateX: -25,
            scale: 1.1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: 1 // Weighted feel
            }
        });

        // Subtler Parallax for Text Info
        if (info) {
            gsap.fromTo(info, {
                y: 100,
                opacity: 0
            }, {
                y: -100,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: item,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5
                }
            });
        }
    });

    // 5. Mouse-Responsive 3D Tilt (Hero Section Enhancement)
    const hero = document.querySelector('.hero-v2');
    const heroContent = document.querySelector('.hero-v2__content');
    const assets = document.querySelectorAll('.asset-3d');

    if (hero && heroContent) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xRotation = (clientY / innerHeight - 0.5) * 10;
            const yRotation = (clientX / innerWidth - 0.5) * -10;

            gsap.to(heroContent, {
                rotateX: xRotation,
                rotateY: yRotation,
                duration: 1.5,
                ease: "power2.out",
                transformPerspective: 1000
            });

            assets.forEach((asset, i) => {
                const depth = (i + 1) * 20;
                gsap.to(asset, {
                    x: (clientX / innerWidth - 0.5) * depth,
                    y: (clientY / innerHeight - 0.5) * depth,
                    duration: 1.5 + (i * 0.2),
                    ease: "power3.out"
                });
            });
        });

        hero.addEventListener('mouseleave', () => {
            gsap.to([heroContent, ...assets], {
                rotateX: 0, rotateY: 0, x: 0, y: 0,
                duration: 2,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }


    // 6. Branding Section Animation (Footer)
    const brandingLogo = document.querySelector('.hammad-branding');
    if (brandingLogo) {
        gsap.from(brandingLogo.children, {
            scrollTrigger: {
                trigger: brandingLogo,
                start: "top 100%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
}

/* --- PREMIUM 3D CONVEYOR REVIEWS SLIDER --- */
function initReviewsSlider() {
    const container = document.querySelector('.reviews-container');
    const track = document.querySelector('.reviews-track');
    const cards = document.querySelectorAll('.review-card');

    if (!container || !track || cards.length === 0) return;

    let rotation = 0;
    // Responsive Radius calculation
    const getRadius = () => {
        if (window.innerWidth < 768) return window.innerWidth * 0.45;
        if (window.innerWidth < 1200) return window.innerWidth * 0.7;
        return 1000; // Increased for larger cards
    };

    let radius = getRadius();
    const angleStep = (Math.PI * 2) / cards.length;

    window.addEventListener('resize', () => {
        radius = getRadius();
        updateLayout();
    });

    // 1. Initial Position Setup
    function updateLayout() {
        cards.forEach((card, i) => {
            const angle = rotation + (i * angleStep);

            // Calculate 3D positions
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius - radius;
            const scale = 1 + (Math.cos(angle) * 0.4);
            const opacity = Math.max(0.1, (Math.cos(angle) + 1.2) / 2.2);

            // Rotation for face-on effect
            const rotY = (Math.sin(angle) * -25);

            gsap.set(card, {
                x: x,
                z: z,
                scale: scale,
                opacity: opacity,
                rotateY: rotY,
                zIndex: Math.round(z + radius),
                overwrite: "auto"
            });
        });
    }

    // 2. Continuous Auto-Rotation (Cranked Speed)
    const conveyorSpeed = 0.007; // Increased speed further for dynamic feel
    const autoRotate = () => {
        rotation -= conveyorSpeed;
        updateLayout();
        requestAnimationFrame(autoRotate);
    };

    // Start auto-rotation
    autoRotate();

    // 3. Draggable Interaction
    Draggable.create(document.createElement('div'), {
        trigger: container,
        type: "x",
        onDrag: function () {
            rotation += this.deltaX * 0.003;
            updateLayout();
        },
        onThrowUpdate: function () {
            rotation += this.deltaX * 0.003;
            updateLayout();
        }
    });

    // 4. Entrance Animation
    gsap.from(cards, {
        scrollTrigger: {
            trigger: ".reviews-section",
            start: "top 80%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 2,
        ease: "expo.out"
    });
}
