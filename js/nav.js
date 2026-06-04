/* Highlight the current nav link when this page is opened directly or by navigation. */
setActiveNavLink();

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
