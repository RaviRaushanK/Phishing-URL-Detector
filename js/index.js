
const scanBtn = document.getElementById("scanBtn");
const homeInput = document.getElementById("homeInput");
const homeClearBtn = document.getElementById("homeClearBtn");
const homeAlert = document.getElementById("homeAlert");
let homeAlertTimer;

scanBtn.addEventListener("click", () => {

    const url = homeInput.value.trim();

    if(url === ""){
        showPageAlert(homeAlert, "Please enter a URL before scanning.", "warning");
        return;
    }

    hidePageAlert(homeAlert);

    /* Save URL with the same key scanner.js reads for automatic scanning. */
    localStorage.setItem("scanURL", url);

    /* Redirect to scanner page */
    window.location.href = "scanner.html";

});

homeClearBtn.addEventListener("click", () => {

    homeInput.value = "";
    homeInput.focus();
    hidePageAlert(homeAlert);

});


// ENTER KEY SUPPORT

homeInput
.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        scanBtn.click();

    }

});

homeInput.addEventListener("input", () => {

    if(homeInput.value.trim() !== ""){
        hidePageAlert(homeAlert);
    }

});

function showPageAlert(alertBox, message, type = "warning"){

    clearTimeout(homeAlertTimer);
    alertBox.textContent = message;
    alertBox.classList.remove("d-none", "page-alert-warning", "page-alert-danger", "page-alert-success");
    alertBox.classList.add(`page-alert-${type}`);
    homeAlertTimer = setTimeout(() => hidePageAlert(alertBox), 3500);

}

function hidePageAlert(alertBox){

    clearTimeout(homeAlertTimer);
    alertBox.classList.add("d-none");

}
