document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const loading = document.querySelector(".loading");
    const errorMessage = document.querySelector(".error-message");
    const sentMessage = document.querySelector(".sent-message");

    // Hide all messages initially
    loading.style.display = "none";
    errorMessage.style.display = "none";
    sentMessage.style.display = "none";

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Show loading message
        loading.style.display = "block";
        errorMessage.style.display = "none";
        sentMessage.style.display = "none";

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic client-side validation
        if (!data.name || data.name.trim().length < 2) {
            showError("Name must be at least 2 characters long");
            return;
        }

        if (!data.email || !isValidEmail(data.email)) {
            showError("Please enter a valid email address");
            return;
        }

        if (!data.subject || data.subject.trim().length < 5) {
            showError("Subject must be at least 5 characters long");
            return;
        }

        if (!data.message || data.message.trim().length < 10) {
            showError("Message must be at least 10 characters long");
            return;
        }

        try {
            // Try backend API first (for local development or if backend is available)
            let response;
            try {
                response = await fetch("/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
            } catch (localError) {
                // If local backend fails, try the deployed backend
                response = await fetch("https://primetask-backend.onrender.com/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
            }

            const result = await response.json();

            if (response.ok && result.success) {
                // Show success message
                sentMessage.innerHTML = result.message || "Thank you for contacting us! We will get back to you soon.";
                sentMessage.style.display = "block";
                contactForm.reset();
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    sentMessage.style.display = "none";
                }, 5000);
            } else {
                // Show error message from server
                showError(result.message || "Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            showError("Network error. Please check your connection and try again.");
        } finally {
            // Hide loading message
            loading.style.display = "none";
        }
    });

    // Helper function to show error messages
    function showError(message) {
        errorMessage.innerHTML = message;
        errorMessage.style.display = "block";
        loading.style.display = "none";
        
        // Auto-hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 5000);
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add real-time validation feedback
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.querySelector("textarea[name='message']");

    // Real-time validation for name
    if (nameInput) {
        nameInput.addEventListener("blur", () => {
            if (nameInput.value.trim().length < 2) {
                nameInput.style.borderColor = "#dc3545";
            } else {
                nameInput.style.borderColor = "#28a745";
            }
        });
    }

    // Real-time validation for email
    if (emailInput) {
        emailInput.addEventListener("blur", () => {
            if (!isValidEmail(emailInput.value)) {
                emailInput.style.borderColor = "#dc3545";
            } else {
                emailInput.style.borderColor = "#28a745";
            }
        });
    }

    // Real-time validation for subject
    if (subjectInput) {
        subjectInput.addEventListener("blur", () => {
            if (subjectInput.value.trim().length < 5) {
                subjectInput.style.borderColor = "#dc3545";
            } else {
                subjectInput.style.borderColor = "#28a745";
            }
        });
    }

    // Real-time validation for message
    if (messageInput) {
        messageInput.addEventListener("blur", () => {
            if (messageInput.value.trim().length < 10) {
                messageInput.style.borderColor = "#dc3545";
            } else {
                messageInput.style.borderColor = "#28a745";
            }
        });
    }
});