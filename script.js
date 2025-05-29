document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value;
        const comments = document.getElementById('comments').value;

        formStatus.classList.add('hidden'); // Hide previous status
        formStatus.textContent = ''; // Clear previous message

        // Basic client-side validation
        if (!email || !comments) {
            formStatus.textContent = 'Please fill in all fields.';
            formStatus.className = 'error';
            formStatus.classList.remove('hidden');
            return;
        }

        // Disable button to prevent multiple submissions
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Point this to your Cloudflare Pages Function endpoint
            // Cloudflare Pages Functions typically live under /_worker.js or /api/
            // For Pages Functions, the route might be /api/submit-form
            const response = await fetch('/api/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, comments })
            });

            if (response.ok) {
                const result = await response.json();
                formStatus.textContent = result.message || 'Message sent successfully!';
                formStatus.className = 'success';
                contactForm.reset(); // Clear the form
            } else {
                const errorData = await response.json();
                formStatus.textContent = errorData.message || 'Failed to send message. Please try again.';
                formStatus.className = 'error';
            }
            formStatus.classList.remove('hidden');

        } catch (error) {
            console.error('Error submitting form:', error);
            formStatus.textContent = 'An error occurred. Please try again later.';
            formStatus.className = 'error';
            formStatus.classList.remove('hidden');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
});