
/* Highlight the current nav link when this page is opened directly or by navigation. */
setActiveNavLink();

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


function setActiveNavLink(){

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-link-mid").forEach(link => {

        const linkPage = link.getAttribute("href");

        if(linkPage === currentPage){

            link.classList.add("active-page");
            link.setAttribute("aria-current", "page");

        }else{

            link.classList.remove("active-page");
            link.removeAttribute("aria-current");

        }

    });

}
