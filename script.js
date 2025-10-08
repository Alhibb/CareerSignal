document.addEventListener('DOMContentLoaded', () => {

    const phrases = [
        "Stop Searching. Start Receiving.",
        "AI-Powered Job Alerts. Instantly.",
        "Your Next Career Move. Delivered.",
        "The Perfect Job Signal. Just for you."
    ];
    const heroTextElement = document.querySelector('.hero-animated-text');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let deletingSpeed = 50;
    let pauseBeforeDelete = 2000;
    let pauseBeforeType = 1000;

    function typeWriter() {
        if (!heroTextElement) return;

        const currentPhrase = phrases[phraseIndex];
        let delay = typingSpeed;

        if (isDeleting) {
            delay = deletingSpeed;
            heroTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            heroTextElement.classList.add('show-cursor');
            isDeleting = true;
            delay = pauseBeforeDelete;
        } else if (isDeleting && charIndex === 0) {
            heroTextElement.classList.remove('show-cursor');
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = pauseBeforeType;
        } else {
            heroTextElement.classList.add('show-cursor');
        }

        setTimeout(typeWriter, delay);
    }

    typeWriter();

    const animatedTextElements = document.querySelectorAll('.animate-text');
    animatedTextElements.forEach(element => {
        element.style.opacity = 0;
        setTimeout(() => {
            element.style.opacity = 1;
        }, 100);
    });

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

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

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

    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(signupForm);
        const userData = Object.fromEntries(formData.entries());
        console.log('User Data:', userData);
        closeModal();
        signupForm.reset();
        setTimeout(() => {
            alert(`Thank you for signing up for the ${userData.tier} plan! Check your WhatsApp for a confirmation.`);
        }, 300);
    });
});