
const scannerInput = document.getElementById("scannerInput");
const analyzeBtn = document.getElementById("analyzeBtn");

/* CHANGE: Highlight the current nav link when this page is opened directly or by navigation. */
setActiveNavLink();

const resultContainer = document.getElementById("resultContainer");
const bodyImage = document.querySelector(".body-image");

const label = document.getElementById("label");

const heading1 = document.getElementById("heading-1");
const heading2 = document.getElementById("heading-2");
const description = document.getElementById("description");
const suggestion = document.getElementById("suggestion");
/* CHANGE: Main result card gets safe/warning/danger colors without boxing the summary text. */
const resultSummaryCard = document.querySelector(".box-left");
const resultSuggestionBox = document.querySelector(".box-bottom");

const progress = document.querySelector(".progress");
const glow = document.querySelector(".glow");

/* CHANGE: Targets for dynamic Risk Breakdown and Detected Issues cards. */
const riskBreakdownBody = document.getElementById("riskBreakdownBody");
const detectedIssuesBody = document.getElementById("detectedIssuesBody");

let progressTimer;
let currentRiskScore = 0;




// ============================================
// URL CHECK SETTINGS
// ============================================

/* CHANGE: One list controls score, icons, breakdown bars, and detected issue messages. */
const urlChecks = [
    {
        title: "HTTPS Check",
        icon: "fa-lock-open",
        max: 20,
        /* CHANGE: Catch insecure HTTP and malformed protocol text like "http:-----". */
        test: url => hasInsecureOrMalformedProtocol(url),
        message: "URL uses insecure or malformed HTTP format",
        safeMessage: "HTTPS format looks clean"
    },
    {
        title: "URL Length",
        icon: "fa-ruler-horizontal",
        max: 15,
        test: url => url.length > 30,
        message: "URL is longer than usual",
        safeMessage: "URL length looks normal"
    },
    {
        title: "@ Symbol",
        icon: "fa-at",
        max: 20,
        test: url => url.includes("@"),
        message: "URL contains '@' symbol",
        safeMessage: "No '@' symbol found"
    },
    {
        title: "Suspicious Format",
        icon: "fa-network-wired",
        max: 15,
        /* CHANGE: Flag IP URLs and heavy symbol patterns that are not normal URLs. */
        test: url => hasIPAddress(url) || hasSuspiciousFormat(url),
        message: "URL has an IP address or suspicious symbol pattern",
        safeMessage: "URL format looks normal"
    },
    {
        title: "Suspicious Keywords",
        icon: "fa-triangle-exclamation",
        max: 20,
        /* CHANGE: Detect suspicious words even when separated, encoded, or mixed with symbols. */
        test: url => hasSuspiciousKeywords(url),
        message: "URL contains suspicious keywords",
        safeMessage: "No suspicious keywords found"
    },
    {
        title: "Too Many Dots",
        icon: "fa-ellipsis",
        max: 15,
        /* CHANGE: Check raw URL too, because malformed URLs may not parse into a hostname. */
        test: url => hasTooManyDots(url),
        message: "Too many dots in domain",
        safeMessage: "Domain dot count looks normal"
    },
    {
        title: "Hyphen Check",
        icon: "fa-minus",
        max: 10,
        /* CHANGE: Detect repeated hyphen patterns even when the hostname is invalid. */
        test: url => hasHyphenPattern(url),
        message: "URL contains hyphens in the domain",
        safeMessage: "No hyphen pattern found"
    }
];


// ============================================
// CIRCLE SETTINGS
// ============================================

const radius = 70;

const circumference = 2 * Math.PI * radius;

[progress, glow].forEach(el => {

    el.style.strokeDasharray = circumference;
    el.style.strokeDashoffset = circumference;

});



// ============================================
// PAGE LOAD
// ============================================

window.addEventListener("load", () => {

    /* CHANGE: Auto-scan only when a URL was sent from the home page. */
    const savedURL = localStorage.getItem("scanURL") || localStorage.getItem("scannedURL");

    if(savedURL){

        scannerInput.value = savedURL;

        analyzeURL(savedURL);

        /* CHANGE: Clear storage after use so nav/direct visits keep the normal scanner flow. */
        localStorage.removeItem("scanURL");
        localStorage.removeItem("scannedURL");
    }

});


// ============================================
// ANALYZE BUTTON 
// ============================================

analyzeBtn.addEventListener("click", () => {

    const url = scannerInput.value.trim();

    if(url === ""){
        alert("Please enter URL");
        return;
    }

    analyzeURL(url);

});

// ENTER KEY SUPPORT
document.getElementById("scannerInput")
.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        analyzeBtn.click();

    }

});



// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

function analyzeURL(url){

    // Hide image
    bodyImage.classList.add("d-none");

    // Show result
    resultContainer.classList.remove("d-none");

    /* CHANGE: Generate detailed result so cards only show matching URL issues. */
    const analysis = analyzeURLChecks(url);
    const score = analysis.score;

    animateCircle(score);

    updateText(score);

    updateRiskBreakdown(analysis.checks);

    updateDetectedIssues(analysis.checks);

}


// ============================================
// RISK SCORE GENERATOR
// ============================================

function analyzeURLChecks(url){

    /* CHANGE: Score is calculated from matched checks and capped at 100%. */
    const checks = urlChecks.map(check => {

        const detected = check.test(url.trim());

        return {
            ...check,
            value: detected ? check.max : 0,
            detected
        };

    });

    const score = checks.reduce((total, check) => total + check.value, 0);

    return {
        score: Math.min(score, 100),
        checks,
        detectedChecks: checks.filter(check => check.detected)
    };

}


// ============================================
// ANIMATE CIRCLE
// ============================================

function animateCircle(target){

    let current = 0;
    currentRiskScore = target;

    /* CHANGE: Clear the old animation before starting a new scan. */
    clearInterval(progressTimer);

    updateCircle(0);

    if(target <= 0){

        return;

    }

    progressTimer = setInterval(() => {

        current++;

        updateCircle(current);

        if(current >= target){
            clearInterval(progressTimer);

        }

    }, 15);

}


// ============================================
// UPDATE CIRCLE
// ============================================

function updateCircle(percent){

    /* CHANGE: A clean URL stays 0% risk, with a tiny green fill so the circle is still visible. */
    const visualPercent = currentRiskScore === 0 ? 2 : percent;

    const offset =
        circumference -
        (visualPercent / 100) * circumference;

    progress.style.strokeDashoffset = offset;
    glow.style.strokeDashoffset = offset;

    /* CHANGE: Circle progress color now matches the summary card risk state. */
    const color = getProgressColor(currentRiskScore);

    progress.style.stroke = color;
    glow.style.stroke = color;

    label.innerHTML = `${percent}%`;

}


// ============================================
// DYNAMIC COLORS
// ============================================

function getColor(percent){

    if(percent < 30){

        return "#00ff88";

    }else if(percent < 70){

        return "#ffb700";

    }else{

        return "#ff3b3b";

    }

}


function getProgressColor(percent){

    if(percent <= 15){

        return "#00ff88";

    }else if(percent < 70){

        return "#ffb700";

    }else{

        return "#ff3b3b";

    }

}


// ============================================
// UPDATE TEXT
// ============================================

function updateText(score){

    /* CHANGE: Keep text in the same place, but color the whole result card by risk. */
    const stateClass = getResultStateClass(score);

    resultSummaryCard.classList.remove("result-state-safe", "result-state-warning", "result-state-danger");
    resultSuggestionBox.classList.remove("result-state-safe", "result-state-warning", "result-state-danger");
    resultSummaryCard.classList.add(stateClass);
    resultSuggestionBox.classList.add(stateClass);

    if(score >= 60){

        heading1.innerHTML = "DANGEROUS";

        heading2.innerHTML = "High Risk Detected";

        description.innerHTML =
            "This URL shows strong phishing indicators.";

        suggestion.innerHTML =
            "Do not visit this website.";

    }

    else if(score >= 30){

        heading1.innerHTML = "WARNING";

        heading2.innerHTML = "Suspicious URL";

        description.innerHTML =
            "Some phishing indicators were detected.";

        suggestion.innerHTML =
            "Proceed carefully.";

    }

    else if(score > 15){

        heading1.innerHTML = "LOW RISK";

        heading2.innerHTML = "Minor Issue Found";

        description.innerHTML =
            "This URL has a small warning point.";

        suggestion.innerHTML =
            "Review the details before visiting.";

    }

    else{

        heading1.innerHTML = "SAFE";

        heading2.innerHTML = "No Major Risk";

        description.innerHTML =
            "This URL appears safe to visit.";

        suggestion.innerHTML =
            "Website looks secure.";

    }

}


// ============================================
// UPDATE RISK BREAKDOWN CARD
// ============================================

function updateRiskBreakdown(checks){

    /* CHANGE: Rebuild Risk Breakdown with Font Awesome icons and animated values. */
    riskBreakdownBody.innerHTML = checks.map((check, index) => {

        /* CHANGE: Clean checks animate as full green bars; detected checks animate red. */
        const fillClass = check.detected ? getRiskClass(check.value, check.max) : "safe";
        const fillWidth = check.detected ? (check.value / check.max) * 100 : 100;
        const iconColor = check.detected ? "#ff3b3b" : "#00ff88";

        return `
            <div class="risk-item result-row-animate d-flex justify-content-between" style="animation-delay: ${index * 70}ms">
                <div class="result-card-left">
                    <i class="fa-solid ${check.icon}" style="font-size: 0.75rem; color:${iconColor}"></i>
                    <span class="small">${check.title}</span>
                </div>

                <div class="result-card-right d-flex align-items-center">
                    <div class="risk-bar">
                        <div class="risk-fill ${fillClass}" style="--risk-width: ${fillWidth}%;"></div>
                    </div>
                    <div class="ms-2 risk-score">
                        <span>${check.value}</span>/<span>${check.max}</span>
                    </div>
                </div>
            </div>
        `;

    }).join("");

}


// ============================================
// UPDATE DETECTED ISSUES CARD
// ============================================

function updateDetectedIssues(checks){

    /* CHANGE: Always show every check so the Detected Issues card never looks empty. */
    detectedIssuesBody.innerHTML = checks.map((check, index) => {

        const rowClass = check.detected ? "issue-danger" : "issue-safe";
        const icon = check.detected ? check.icon : "fa-circle-check";
        const iconColor = check.detected ? "#ff3b3b" : "#00ff88";
        const message = check.detected ? check.message : check.safeMessage;

        return `
            <div class="issue-item ${rowClass} result-row-animate" style="animation-delay: ${index * 65}ms">
                <i class="fa-solid ${icon}" style="font-size: 0.8rem; color:${iconColor}"></i>
                <span class="small">${message}</span>
            </div>
        `;

    }).join("");

}


function getResultStateClass(score){

    if(score >= 70) return "result-state-danger";

    /* CHANGE: Scores below 15% still use the green safe background. */
    if(score > 15) return "result-state-warning";

    return "result-state-safe";

}


// ============================================
// URL HELPERS
// ============================================

function hasInsecureOrMalformedProtocol(url){

    const normalizedURL = url.trim().toLowerCase();

    return normalizedURL.startsWith("http://") ||
        (/^https?:/.test(normalizedURL) && !/^https?:\/\//.test(normalizedURL)) ||
        !/^https:\/\//.test(normalizedURL);

}


function getHostname(url){

    /* CHANGE: Normalize URLs so checks work even when the user omits https://. */
    try{

        return new URL(url).hostname;

    }catch(error){

        try{

            return new URL(`https://${url}`).hostname;

        }catch(innerError){

            return url;

        }

    }

}


function hasIPAddress(url){

    const hostname = getHostname(url);

    return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);

}


function hasSuspiciousFormat(url){

    /* CHANGE: Catch repeated symbols and encoded-looking noise in malformed URLs. */
    return /[$%=]{2,}/.test(url) ||
        /[@$%=_-]{6,}/.test(url) ||
        /[^\w:/?#[\]@!$&'()*+,;=.-]/.test(url);

}


function hasSuspiciousKeywords(url){

    const normalizedURL = normalizeURLText(url);
    const compactURL = normalizedURL.replace(/[^a-z0-9]/g, "");
    const suspiciousKeywords = [
        "login",
        "signin",
        "verify",
        "verification",
        "secure",
        "security",
        "account",
        "bank",
        "password",
        "passwd",
        "reset",
        "update",
        "confirm",
        "billing",
        "wallet",
        "payment",
        "invoice",
        "support",
        "unlock",
        "limited",
        "urgent",
        "prize",
        "reward",
        "free"
    ];

    return suspiciousKeywords.some(keyword => {

        const spacedKeyword = keyword.split("").join("[^a-z0-9]*");
        const flexiblePattern = new RegExp(`(^|[^a-z0-9])${spacedKeyword}([^a-z0-9]|$)`, "i");

        return flexiblePattern.test(normalizedURL) || compactURL.includes(keyword);

    });

}


function normalizeURLText(url){

    /* CHANGE: Decode common URL encoding before checking keywords. */
    let normalizedURL = url.toLowerCase();

    try{

        normalizedURL = decodeURIComponent(normalizedURL);

    }catch(error){

        normalizedURL = normalizedURL.replace(/%20/g, " ");

    }

    return normalizedURL;

}


function hasTooManyDots(url){

    const hostname = getHostname(url);
    const hostnameDotCount = hostname.split(".").filter(Boolean).length;
    const rawDotCount = (url.match(/\./g) || []).length;

    return hostnameDotCount > 3 || rawDotCount > 3 || /\.{2,}/.test(url);

}


function hasHyphenPattern(url){

    const hostname = getHostname(url);

    return hostname.includes("-") || /-{2,}/.test(url);

}


function getRiskClass(value, max){

    const percent = (value / max) * 100;

    if(percent <= 10) return "safe";

    if(percent < 70) return "warning";

    return "danger";

}


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
