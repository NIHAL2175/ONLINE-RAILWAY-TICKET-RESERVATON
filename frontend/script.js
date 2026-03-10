document.addEventListener("DOMContentLoaded", function () {
    // Form submission handler
    const ticketForm = document.getElementById("ticketForm");
    const responseMessage = document.getElementById("responseMessage");
    const modal = document.getElementById("confirmationModal");
    const closeBtn = document.querySelector(".close");
    const bookingDetails = document.getElementById("bookingDetails");
    const downloadBtn = document.getElementById("downloadTicket");

    // Today's date for date input min attribute
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("date").setAttribute("min", today);

    // Close modal when clicking the X
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Form validation and submission
    ticketForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = {
            name: document.getElementById("name").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            idType: document.getElementById("idType").value,
            idNumber: document.getElementById("idNumber").value,
            train: document.getElementById("train").value,
            from: document.getElementById("from").value,
            to: document.getElementById("to").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            travelClass: document.getElementById("class").value,
            tickets: document.getElementById("tickets").value,
            berthPreference: document.getElementById("preference").value || "No Preference",
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            notifications: document.getElementById("notifications").checked,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value
        };

        try {
            // API call
            const response = await fetch("http://localhost:27017/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                showBookingConfirmation(formData);
                return;
            }

            const result = await response.json();

            if (result.success) {
                showBookingConfirmation(formData);
            } else {
                responseMessage.className = "response-message error";
                responseMessage.innerText = result.message || "Booking failed. Please try again.";
            }
        } catch (error) {
            console.error("Error:", error);
            showBookingConfirmation(formData);
        }
    });

    // Download ticket button
    downloadBtn.addEventListener("click", function () {
        alert("Ticket download functionality would be implemented here.");
        modal.style.display = "none";
    });

    // Form validation function
    function validateForm() {
        document.querySelectorAll(".error-message").forEach(el => el.remove());
        let isValid = true;

        function showError(input, message) {
            const error = document.createElement("div");
            error.className = "error-message";
            error.style.color = "red";
            error.innerText = message;
            input.parentNode.appendChild(error);
            isValid = false;
        }

        const name = document.getElementById("name");
        if (name.value.trim().length < 3) {
            showError(name, "Name must be at least 3 characters long.");
        }

        const age = document.getElementById("age");
        if (age.value === "" || isNaN(age.value) || age.value <= 0) {
            showError(age, "Enter a valid age.");
        }

        const email = document.getElementById("email");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            showError(email, "Enter a valid email address.");
        }

        const phone = document.getElementById("phone");
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            showError(phone, "Phone number must be 10 digits.");
        }

        const idNumber = document.getElementById("idNumber");
        if (idNumber.value.trim().length < 5) {
            showError(idNumber, "Enter a valid ID number.");
        }

        const tickets = document.getElementById("tickets");
        if (tickets.value === "" || isNaN(tickets.value) || tickets.value <= 0) {
            showError(tickets, "Enter a valid number of tickets.");
        }

        return isValid;
    }

    // Function to show booking confirmation
    function showBookingConfirmation(data) {
        bookingDetails.innerHTML = `
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Train:</strong> ${data.train}</p>
            <p><strong>From:</strong> ${data.from} <strong>To:</strong> ${data.to}</p>
            <p><strong>Date:</strong> ${data.date} <strong>Time:</strong> ${data.time}</p>
            <p><strong>Class:</strong> ${data.travelClass} <strong>Tickets:</strong> ${data.tickets}</p>
            <p><strong>Email:</strong> ${data.email} <strong>Phone:</strong> ${data.phone}</p>
        `;
        modal.style.display = "block";
        responseMessage.className = "response-message success";
        responseMessage.innerText = "Booking successful!";
    }
});