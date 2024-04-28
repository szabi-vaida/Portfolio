const skillsContainer = document.getElementById('skills');

skillsContainer.querySelectorAll('i').forEach((icon) => {
    icon.style.animationDelay = `${getRandomDelay()}s`; // Set animation delay
});

function getRandomDelay(){
    return Math.random() * 5;
}


