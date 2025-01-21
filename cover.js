// Toggle Dark Mode with Sun and Moon Icons
const toggle = document.getElementById("darkModeToggle");
toggle.addEventListener("click", () => {
    const body = document.body;

    if (body.getAttribute("data-theme") === "light") {
        body.setAttribute("data-theme", "dark");
        toggle.textContent = "🌙 Dark Mode"; // Set moon icon
    } else {
        body.setAttribute("data-theme", "light");
        toggle.textContent = "☀️ Light Mode"; // Set sun icon
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    if (body.getAttribute("data-theme") === "light") {
        toggle.textContent = "☀️ Light Mode";
    } else {
        toggle.textContent = "🌙 Dark Mode";
    }
});

// Function to create raindrops
function createRain() {
    const rainContainer = document.createElement('div');
    rainContainer.style.position = 'fixed';
    rainContainer.style.top = 0;
    rainContainer.style.left = 0;
    rainContainer.style.width = '100%';
    rainContainer.style.height = '100%';
    rainContainer.style.pointerEvents = 'none'; // Avoid interference with clicks
    rainContainer.style.zIndex = '9999'; // Ensure it's above other content
    document.body.appendChild(rainContainer);

    for (let i = 0; i < 200; i++) { // Increase number of drops for dense rain
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = Math.random() * 100 + 'vw'; // Random horizontal position
        raindrop.style.animationDuration = Math.random() * 2 + 1 + 's'; // Random fall speed
        raindrop.style.animationDelay = Math.random() * 2 + 's'; // Random delay
        rainContainer.appendChild(raindrop);
    }
}

document.addEventListener('DOMContentLoaded', createRain);

