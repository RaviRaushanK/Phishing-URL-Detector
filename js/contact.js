<script>
emailjs.init("YOUR_PUBLIC_KEY");

document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {

    e.preventDefault();

    const templateParams = {
        from_name: document.getElementById("name").value,
        from_email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams
    )
    .then(function () {
        alert("Message sent successfully!");

        document.getElementById("contactForm").reset();
    })
    .catch(function (error) {
        alert("Failed to send message.");
        console.error(error);
    });
});
</script>