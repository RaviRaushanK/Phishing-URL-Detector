
const scanBtn = document.getElementById("scanBtn");
const homeInput = document.getElementById("homeInput");
const homeClearBtn = document.getElementById("homeClearBtn");

scanBtn.addEventListener("click", () => {

    const url = homeInput.value.trim();

    if(url === ""){
        alert("Please enter a URL");
        return;
    }

    /* Save URL with the same key scanner.js reads for automatic scanning. */
    localStorage.setItem("scanURL", url);

    /* Redirect to scanner page */
    window.location.href = "scanner.html";

});

homeClearBtn.addEventListener("click", () => {

    homeInput.value = "";
    homeInput.focus();

});


// ENTER KEY SUPPORT

homeInput
.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        scanBtn.click();

    }

});
