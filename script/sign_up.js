document.getElementById("phone").addEventListener("focus", function() {
    let phoneError = document.getElementById("phone-error");
    phoneError.textContent = "Enter a 10-digit phone number (e.g., 9876543210)";
    phoneError.style.color = "gray";
});

document.getElementById("phone").addEventListener("blur", function() {
    document.getElementById("phone-error").textContent = ""; // Clear message when focus is lost
});

const form = document.getElementById("signup-form");
const phoneInput = document.getElementById("phone");
const phoneErrorDiv = document.getElementById("phone-error");
// const emailInput = document.getElementById("email");
// const emailErrorDiv = document.getElementById("email-error");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordErrorDiv = document.getElementById("password-error");

form.addEventListener("submit", (e) => {
    let isValid = true;

    // Validate phone number
    const phone = phoneInput.value.trim();
    phoneErrorDiv.textContent = ""; // Clear previous errors
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        phoneErrorDiv.textContent = "Phone number must be exactly 10 digits and contain only numbers.";
        phoneErrorDiv.style.color = "red";
        isValid = false;
    }

    // Validate email (optional)
    let email = emailInput.value.trim();
    emailErrorDiv.textContent = ""; // Clear previous errors
    if (email) { // Only validate if an email is provided
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailErrorDiv.textContent = "Please enter a valid email address.";
            emailErrorDiv.style.color = "red";
            isValid = false;
        }
    }


    // Validate matching passwords
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    passwordErrorDiv.textContent = ""; // Clear previous errors
    if (password !== confirmPassword) {
        passwordErrorDiv.textContent = "Passwords do not match. Please re-enter.";
        passwordErrorDiv.style.color = "red";
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault(); // Prevent form submission if validation fails
    }
});