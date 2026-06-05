# PhishShield - Phishing URL Detector

PhishShield is a fully client-side, responsive web application designed to help users identify potential phishing URLs in real-time. It evaluates suspicious links through a multi-factor heuristic engine that runs directly in the user's web browser. By performing all analyses locally, PhishShield provides instant feedback without compromising user privacy or transmitting sensitive URLs to third-party servers.

---

## Description

Cybersecurity threats frequently rely on social engineering techniques to trick users into visiting malicious sites that imitate reputable organizations. Attackers manipulate links, use deceptive domains, and embed high-risk keywords to steal sensitive credentials and personal data. PhishShield addresses this problem by offering an interactive tool that dissects, evaluates, and ranks URLs based on their risk indicators.

### Key Objectives
*   **Privacy-First Verification:** Perform all structural and lexicographical URL checks client-side, ensuring that zero user data is collected, stored, or sent over the network.
*   **Transparent Risk Assessment:** Provide users with an interactive, animated risk-percent gauge alongside a granular breakdown of failing/passing parameters.
*   **Educational Outreach:** Inform users about standard phishing signs, including mismatched domains, lack of encryption, and deceptive keywords, through dedicated content and tips sections.

### Core Features
*   **Real-Time URL Checking:** Instantly detects key indicators of malicious links, from insecure HTTP connections and suspicious characters to hostnames saturated with subdomains or hyphens.
*   **Weighted Heuristic Scoring Engine:** Dynamically calculates a danger percentage (0% to 100%) across seven discrete parameters with customizable weights.
*   **Interactive Visual Analytics:** Displays an animated circular SVG gauge representing the URL's danger score, color-coded by severity (Safe, Low Risk, Warning, and Dangerous).
*   **Comprehensive Risk Breakdown:** Renders granular progress bars representing the severity of each individual threat vector checked.
*   **Detected Issues Log:** Formulates a direct, user-friendly summary of safe attributes versus flagged anomalies for every scan.
*   **Cross-Page Seamless Redirection:** Allows users to input a suspicious URL directly on the homepage and redirects them to the checker page with automated scanning preloaded.

---

## Architecture

PhishShield uses a lightweight client-side architecture composed of static HTML views, modular CSS files, and native JavaScript controllers. The system relies entirely on native browser features and lightweight front-end assets to deliver highly responsive performance.

### Directory Structure

The workspace is organized into modular files separating layout, styling, and application logic:

*   **HTML Views (Root Directory):**
    *   `index.html`: The main landing page, presenting an input interface, general workflow guides, and promotional highlights.
    *   `scanner.html`: The core interactive workspace containing the dynamic evaluation gauge, risk indicators, and descriptive logs.
    *   `tips.html`: A dedicated informational reference page highlighting security habits and typical indicators of cyber threats.
    *   `about.html`: A page outlining the project's mission, mechanics, and security focus.
    *   `contact.html`: A communication view equipped with a form pointing to Formspree to collect user reports or feedback.
*   **Styling Sheets (`assets/css/`):**
    *   `common.css`: Contains global theme rules, layout resets, persistent navigation styling, and footer formatting.
    *   `index.css`: Styles specific to the homepage layout, hero section, interactive grid cards, and feature lists.
    *   `scanner.css`: Contains complex animation layouts, circular SVG transitions, and layout containers for the risk reports.
    *   `pages.css`: Manages styles for the standard static views, card-based layouts, and form fields.
*   **Interactive Scripts (`js/`):**
    *   `nav.js`: Handles navigation states, applying highlights based on the active path.
    *   `index.js`: Manages user interactions on the homepage, validating inputs and passing data to the scanner.
    *   `scanner.js`: Hosts the multi-factor detection engine, evaluation rules, rendering operations, and animation routines.

---

## MVC Details

PhishShield implements a structured Model-View-Controller (MVC) logic sequence adapted to static client-side execution. By separating core detection configuration (Model) from interface rendering (View) and interface interaction handlers (Controller), the codebase remains easy to maintain, scale, and test.

### Model (Data Logic & Heuristics)

The Model encapsulates the rule configurations, weighting parameters, scoring rules, and state management utilities.

#### Heuristic Definitions
The core data structure is the `urlChecks` array located inside `js/scanner.js`. Each object in this array represents a distinct phishing threat metric and contains:
*   `title` (String): The category label shown in the breakdown.
*   `icon` (String): The Font Awesome CSS class assigned to the metric.
*   `max` (Number): The weighted score penalty applied if the metric is violated.
*   `test` (Function): A custom javascript check validating the input string.
*   `message` (String): The text displayed when an anomaly is detected.
*   `safeMessage` (String): The text displayed when the URL passes the parameter safely.

#### Rule-by-Rule Analysis Logic
*   **Insecure Protocol Check:** Flags URLs running on standard `http://` or containing malformed protocol characters, alerting the user to missing SSL encryption.
*   **URL Length Check:** Scans the length of the string, penalizing URLs that exceed 30 characters, which is a common tactic for masking hostnames.
*   **At-Symbol Check:** Scans for `@` signs which attackers insert to hide actual domain details before redirection.
*   **Suspicious Format Verification:** Flags IP addresses or excessive symbols such as repeating percentage, dollar, or equals signs.
*   **Keyword Detection:** Decodes percent-encoded URL values and scans for high-risk words (such as login, verification, or reward) using regular expressions capable of identifying words even when characters are separated.
*   **Too Many Dots Evaluation:** Counts domain-level dot separations and raw dot occurrences, flag-marking subdomains representing nested fraud paths.
*   **Hyphen Check:** Flags repeating hyphens in domains, which are used to mimic legitimate trade names.

#### Persistence Layer
Temporary persistence is handled through browser `localStorage`.
*   `scanURL`: Set by the homepage to forward inputs to the scanner.
*   `scannedURL`: Cached reference to maintain states between session operations.

### View (Interface Components & Templates)

The View manages the visual rendering, theme, responsive grids, animations, and custom SVGs.

#### UI Components
*   **The SVG Gauge:** Built with dual overlapping circles representing background shadow and interactive color fills. Stroke configurations (`strokeDasharray` and `strokeDashoffset`) control the visual filling animation of the circle in real-time.
*   **The Risk Breakdown Card:** A dynamic container (`riskBreakdownBody`) populated with metric bars that animate and expand according to calculated ratios.
*   **The Detected Issues Log:** A live card (`detectedIssuesBody`) filled with colored indicators (green for passing, red for flagged anomalies) mapping directly to the heuristic results.
*   **Navigation Bar:** A universal container (`cust-nav`) providing accessible page linkages across all viewport dimensions.

#### Visual Styling and Feedback
Dynamic classes (`result-state-safe`, `result-state-warning`, and `result-state-danger`) alter root element styling across the entire layout based on the current scoring severity, changing text colors, gradients, and backgrounds dynamically.

### Controller (Interaction Handlers)

The Controllers listen to event signals, coordinate browser state updates, sanitize user entries, and invoke evaluation calculations.

#### Navigation Controller (`js/nav.js`)
Calculates the current page pathname on load, updates link styles, and assigns ARIA roles to support screen readers and navigation aids.

#### Index Controller (`js/index.js`)
*   Binds click listeners to scanning buttons and watches input keydowns for quick enter-key submissions.
*   Validates input strings, triggering temporary alerts if inputs are blank.
*   Saves valid inputs to `localStorage` and changes pages to launch automated checking on load.

#### Scanner Controller (`js/scanner.js`)
*   Coordinates window page-loads, retrieving saved inputs and starting evaluations immediately.
*   Drives input sanitization, stripping surrounding whitespaces.
*   Directs timing loops (`progressTimer`) using incremental intervals that step-animate the SVG circle and percentage output dynamically.
*   Controls the structural rebuilding of risk cards and issue items by transforming arrays of checks into dynamic markup templates.

---

## Project Flow

The system flows through a unified input-to-render sequence, starting either on the homepage or directly inside the scanner interface.

### End-to-End Workflow Diagram

```
[User Input] 
     │
     ▼
[Index Controller / Scanner Input Field]
     │
     ├─► Validate (Empty check triggers Page Alert)
     │
     ▼
[Local Storage Cache] (Keys: 'scanURL' / 'scannedURL')
     │
     ▼
[Scanner Page Load / Direct Submission]
     │
     ▼
[Scanner Controller (analyzeURL)]
     │
     ├─► Read string input
     ├─► Execute 7 Heuristic Rules in Model (analyzeURLChecks)
     │         │
     │         └─► Calculate Weighted Risk Score (0 - 100)
     │
     ▼
[View Update Procedures]
     ├─► Animate Circle Progress & Text Count
     ├─► Colorize Theme based on Risk Category
     ├─► Compile Risk Breakdown Bars
     └─► Compile Detected Issues Logs
```

### Step-by-Step Flow Explanation

1.  **User Entry:** The user inserts a suspicious web link into an input field on either the Home page or the URL Checker page.
2.  **Input Verification:** The controller intercepts the submission. If the input is empty, an warning alert is rendered. If a valid string is detected, the workflow proceeds.
3.  **State Hand-off:** If submitted on the Home page, the string is saved to the browser's local storage and the browser redirects to the URL Checker page. Upon loading, the scanner page detects the cached item, clears the storage, and triggers evaluation.
4.  **Heuristic Scanning:** The scanner loops over the 7 parameters inside `urlChecks`. Each test function parses the URL string, analyzes its pattern, and applies its score penalty if validation flags a risk.
5.  **Score Compilation:** The system sums the penalty scores, capping the maximum risk score at 100%.
6.  **UI Redirection & Animation:** The system clears active animations, hides static hero graphics, and renders the result layout. An interval updates the circular gauge and risk percentage in small steps for a clean visual.
7.  **Template Generation:** The controller maps the check results to HTML layouts, populating the risk bars and issue rows with contextual icons and colors based on severity.

---

## Installation

PhishShield is a client-side application. It does not require database software, compilers, node packages, or back-end environments to run.

### Running Locally

1.  **Download or Clone the Repository:**
    ```bash
    git clone https://github.com/RaviRaushanK/URL-Detector.git
    cd Phishing-URL-Detector
    ```
2.  **Launch the Application:**
    Since the project uses vanilla JavaScript and HTML5, you can run it directly using any modern web browser:
    *   Double-click the `index.html` file in your system's file manager.
    *   Alternatively, right-click `index.html` in your editor (e.g., VS Code) and select **Open with Live Server** to view the application with automatic live-reloading.

---

## Usage

PhishShield provides intuitive workflows across its interfaces:

### Checking a URL from the Home Page
1.  Navigate to `index.html`.
2.  Enter a URL (e.g., `http://secure-login-bank-reward.com@192.168.1.1/verify`) into the central input field.
3.  Click **Check URL** or press the **Enter** key.
4.  The application redirects to `scanner.html`, initiates the scan, and renders the interactive report.

### Evaluating URLs Directly in the Checker
1.  Navigate to `scanner.html`.
2.  Enter any URL in the analyzer search bar.
3.  Click **Analyze** to compute the risk score and refresh the visual reports.
4.  Click the **Clear** (X) button to reset the view and start over.

### Reading Safety Tips and Guidance
*   Open the **Tips** page to review standard phishing warning signs.
*   Open the **About** page to learn more about the project's background and privacy design.
*   Use the **Contact** page to send reports or share feedback through the integrated messaging form.

---

## License

This project is licensed as an open-source software project. 

### Disclaimer

The scanning engine operates purely on static heuristic checks of URL structures, lengths, domains, and keywords. It does not access external threat databases or crawl websites. While highly effective at identifying common URL structures used in fraud campaigns, it should be used alongside other cybersecurity practices to ensure complete safety online.
