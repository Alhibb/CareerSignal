document.addEventListener('DOMContentLoaded', () => {
    // Text animation for hero
    const animatedTextElements = document.querySelectorAll('.animate-text');
    animatedTextElements.forEach(element => {
        element.style.opacity = 0;
        setTimeout(() => {
            element.style.opacity = 1;
        }, 100);
    });

    // Scroll reveal
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach((element) => {
        scrollObserver.observe(element);
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Modal handling
    const modal = document.getElementById('signupModal');
    const signupButtons = document.querySelectorAll('[data-tier]');
    const closeButton = document.querySelector('.close-button');
    const selectedTierInput = document.getElementById('selectedTier');

    const openModal = (tier) => {
        selectedTierInput.value = tier;
        modal.showModal();
    };

    const closeModal = () => {
        modal.close();
    };

    signupButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tier = button.getAttribute('data-tier');
            openModal(tier);
        });
    });

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // Form submission
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const userData = Object.fromEntries(formData.entries());
        console.log('--- Form Submitted ---');
        console.log('User Data:', userData);
        closeModal();
        signupForm.reset();
        setTimeout(() => {
            alert(`Thank you for signing up for the ${userData.tier} plan! Check your WhatsApp for a confirmation.`);
        }, 300);
    });
});