document.addEventListener("DOMContentLoaded", function() {
    console.log("Forgot Password Page Loaded!");

    document.getElementById("resetForm").addEventListener("submit", function(event) {
        let phoneField = document.getElementById("phone").value.trim();
        let newPassword = document.getElementById("new-password").value;
        let confirmPassword = document.getElementById("confirm-password").value;
        let errorAlert = document.getElementById("errorAlert");
        
        errorAlert.style.display = "none";
        errorAlert.innerHTML = "";

        let errors = [];

        // Validate phone number (must be exactly 10 digits)
        if (!/^\d{10}$/.test(phoneField)) {
            errors.push("Phone number must be exactly 10 digits long.");
        }

        // Validate password length (at least 6 characters)
        if (newPassword.length < 6) {
            errors.push("Password must be at least 6 characters long.");
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
            errors.push("Passwords do not match.");
        }

        // Show errors if any
        if (errors.length > 0) {
            event.preventDefault();
            errorAlert.style.display = "block";
            errorAlert.innerHTML = errors.join("<br>");
        }
    });
});
