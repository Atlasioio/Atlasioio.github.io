// Body illumination effect
const body = document.body;
const illuminate = document.createElement('div');
illuminate.classList.add('illuminate');
body.appendChild(illuminate);

document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    
    illuminate.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3), rgba(255,255,255,0) 50%)`;
});

// Scroll to content on Enter press
const contentDiv = document.getElementById('content');

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        contentDiv.scrollIntoView({ behavior: 'smooth' });
    }
});

// Handle degree div hover and click
const degreeDivs = document.getElementsByClassName("degreeDiv");

for (let i = 0; i < degreeDivs.length; i++) {
    degreeDivs[i].addEventListener("mouseover", (event) => {
        degreeDivs[i].querySelector(".uniTitle").style.color = "#56D5E0";
        const externalLinkImg = degreeDivs[i].querySelector(".degreeImg");
        externalLinkImg.src = "media/externalLinkHover.svg";
        externalLinkImg.classList.add("moveImage");
    });

    degreeDivs[i].addEventListener("mouseout", (event) => {
        degreeDivs[i].querySelector(".uniTitle").style.color = "";
        const externalLinkImg = degreeDivs[i].querySelector(".degreeImg");
        externalLinkImg.src = "media/externalLink.svg";
        externalLinkImg.classList.remove("moveImage");
    });
}

const degreeDiv1 = document.getElementById("degreeDiv1");
const degreeDiv2 = document.getElementById("degreeDiv2");
const degreeDiv3 = document.getElementById("degreeDiv3");


degreeDiv1.addEventListener("click", (event) => {
    window.open("https://itustudent.itu.dk/Your-Programme/MSc-Programmes/MSc-in-Software-Design", "_blank"); 
});

degreeDiv2.addEventListener("click", (event) => {
    window.open("https://mau.se/en/study-education/programme/tgide/", "_blank"); 
});

degreeDiv3.addEventListener("click", (event) => {
    window.open("https://www.youtube.com/watch?v=e5PXhn1zg7A&ab_channel=LukasA", "_blank"); 
});


// Section scroll-based icon change
window.addEventListener('scroll', () => {
    const aboutSection = document.getElementById('aboutSection');
    const skillSection = document.getElementById('skillSection');
    const personalIcon = document.querySelector('.icon img');

    const aboutRect = aboutSection.getBoundingClientRect();
    const skillRect = skillSection.getBoundingClientRect();

    if (aboutRect.top < window.innerHeight && aboutRect.bottom >= 0) {
        personalIcon.src = "media/profileImgToggle.svg";
    } 
    
    if (skillRect.top < window.innerHeight && skillRect.bottom >= 0) {
        personalIcon.src = "media/personal.svg";
    }
});

// Typing effect for placeholders
const placeholderText = ["work", "play", "rock", "paper", "scissor", "shoot"];
let currentWordIndex = 0;
let currentCharacterIndex = 0;
let isDeleting = false;
const typingSpeed = 150;
const pauseTime = 1000;
const deleteSpeed = 100;

const aboutInput = document.getElementById('contactAbout');

function typePlaceholder() {
    const currentWord = placeholderText[currentWordIndex];

    if (!isDeleting && currentCharacterIndex <= currentWord.length) {
        aboutInput.placeholder = currentWord.substring(0, currentCharacterIndex + 1);
        currentCharacterIndex++;
    } else if (isDeleting && currentCharacterIndex > 0) {
        aboutInput.placeholder = currentWord.substring(0, currentCharacterIndex - 1);
        currentCharacterIndex--;
    }

    if (!isDeleting && currentCharacterIndex === currentWord.length) {
        setTimeout(() => {
            isDeleting = true;
        }, pauseTime);
    } else if (isDeleting && currentCharacterIndex === 0) {
        isDeleting = false;
        currentWordIndex++;
        if (currentWordIndex >= placeholderText.length) {
            currentWordIndex = 0;
        }
    }

    const speed = isDeleting ? deleteSpeed : typingSpeed;
    setTimeout(typePlaceholder, speed);
}

typePlaceholder();

// Typing effect for message placeholder
const messagePlaceholderText = ["Hi Lukas!", "howdy Luke", "hi there,", "greetings", "hej", "xyz"];
let messageWordIndex = 0;
let messageCharacterIndex = 0;
let isMessageDeleting = false;
const messageTypingSpeed = 150;
const messagePauseTime = 1000;
const messageDeleteSpeed = 100;

const messageInput = document.getElementById('contactMessage');

function typeMessagePlaceholder() {
    const currentMessage = messagePlaceholderText[messageWordIndex];

    if (!isMessageDeleting && messageCharacterIndex <= currentMessage.length) {
        messageInput.placeholder = currentMessage.substring(0, messageCharacterIndex + 1);
        messageCharacterIndex++;
    } else if (isMessageDeleting && messageCharacterIndex > 0) {
        messageInput.placeholder = currentMessage.substring(0, messageCharacterIndex - 1);
        messageCharacterIndex--;
    }

    if (!isMessageDeleting && messageCharacterIndex === currentMessage.length) {
        setTimeout(() => {
            isMessageDeleting = true;
        }, messagePauseTime);
    } else if (isMessageDeleting && messageCharacterIndex === 0) {
        isMessageDeleting = false;
        messageWordIndex++;
        if (messageWordIndex >= messagePlaceholderText.length) {
            messageWordIndex = 0;
        }
    }

    const speed = isMessageDeleting ? messageDeleteSpeed : messageTypingSpeed;
    setTimeout(typeMessagePlaceholder, speed);
}

typeMessagePlaceholder();

// Navigation scroll and underline effect
const sections = {
    about: document.getElementById("aboutSection"),
    projects: document.getElementById("projectSection"),
    contact: document.getElementById("contactSection")
};

const navItems = {
    about: document.querySelector("#navMiddle p:nth-child(1)"),
    projects: document.querySelector("#navMiddle p:nth-child(2)"),
    contact: document.querySelector("#navMiddle p:nth-child(3)")
};

function clearActiveClasses() {
    Object.values(navItems).forEach(item => item.classList.remove('active'));
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            clearActiveClasses();
            if (entry.target.id === "aboutSection") {
                navItems.about.classList.add('active');
            } else if (entry.target.id === "projectSection") {
                navItems.projects.classList.add('active');
            } else if (entry.target.id === "contactSection") {
                navItems.contact.classList.add('active');
            }
        }
    });
}, { threshold: 0.5 });

Object.values(sections).forEach(section => observer.observe(section));

// Scroll to section on nav item click
Object.keys(navItems).forEach((key) => {
    navItems[key].addEventListener('click', () => {
        sections[key].scrollIntoView({ behavior: 'smooth' });
    });
});
