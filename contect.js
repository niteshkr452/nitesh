document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Show loading spinner and hide messages
        document.querySelector(".loading").style.display = "block";
        document.querySelector(".error-message").style.display = "none";
        document.querySelector(".sent-message").style.display = "none";

        try {
            const response = await fetch("http://localhost:3000/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            const data = await response.json();

            // Hide loading spinner
            document.querySelector(".loading").style.display = "none";

            if (response.ok) {
                document.querySelector(".sent-message").style.display = "block";
                form.reset(); // clear form
            } else {
                document.querySelector(".error-message").textContent = data.message || "Something went wrong.";
                document.querySelector(".error-message").style.display = "block";
            }
        } catch (error) {
            document.querySelector(".loading").style.display = "none";
            document.querySelector(".error-message").textContent = "Server error. Please try again later.";
            document.querySelector(".error-message").style.display = "block";
        }
    });
});
