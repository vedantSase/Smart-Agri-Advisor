document.getElementById("phone").addEventListener("focus", function() {
    let phoneError = document.getElementById("phone-error");
    phoneError.textContent = "Enter a 10-digit phone number (e.g., 9876543210)";
    phoneError.style.color = "gray";
});

document.getElementById("phone").addEventListener("blur", function() {
    document.getElementById("phone-error").textContent = ""; // Clear message when focus is lost
});

const form = document.getElementById("login-form");
const phoneInput = document.getElementById("phone");
const phoneErrorDiv = document.getElementById("phone-error");

form.addEventListener("submit", (e) => {
    const phone = phoneInput.value.trim();
    phoneErrorDiv.textContent = ""; // Clear previous errors

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        phoneErrorDiv.textContent = "Please enter a valid 10-digit phone number.";
        phoneErrorDiv.style.color = "red";
        e.preventDefault(); // Prevent form submission if validation fails
    }
});
