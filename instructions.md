# Modernization plan for masska.org for the cursor application

# --- Stage 1: Automatic Analysis and Preparation ---

# 1.1. Structure Scanning
#    - Analyze the files: index.html, online.html, azdaki.html.
#    - Identify obsolete HTML tags (e.g., <font>, <center>) and deprecated attributes.
#    - Check the heading structure (H1, H2, H3) for a logical hierarchy.

# 1.2. CSS Analysis
#    - Identify inline styles and move them to an external CSS file.
#    - Check if the site is responsive. If not, mark this as a critical point for improvement.

# 1.3. Accessibility Assessment
#    - Audit the site against WCAG 2.1 standards.
#    - Check the color contrast on the site.
#    - Verify that all images have 'alt' attributes.

# --- Stage 2: Structure and Design Modernization ---

# 2.1. HTML Refactoring
#    - Replace obsolete tags with modern equivalents (e.g., use <nav>, <main>, <section>, <article>, <footer>).
#    - Ensure each page has one and only one H1 heading.
#    - Organize the heading hierarchy.

# 2.2. Implementation of Modern Design (CSS)
#    - Create a new, clean CSS file.
#    - Implement 'mobile-first' RWD (Responsive Web Design) using media queries.
#    - Use a modern font that is readable and aesthetically pleasing.
#    - Apply dummy-images (placeholder images) in all places where graphics appear. You can use the placeholder.com service to generate images with the appropriate dimensions.
#      Example: <img src="https://via.placeholder.com/800x400" alt="Image description">

# --- Stage 3: Implementation of Accessibility Features ---

# 3.1. Contrast Change
#    - Create an alternative high-contrast color version of the site.
#    - Add a button that will switch between the standard and high-contrast versions (e.g., by adding a 'high-contrast' class to the <body>).

# 3.2. Text Size Change
#    - Add buttons to increase and decrease the font size on the page.
#    - The implementation should dynamically change the base font size (e.g., in the <html> element), using 'rem' units for all text, which will allow for easy scaling.

# 3.3. Language Switcher
#    - Implement a language switcher (PL/EN) based on the existing URL structure (/pl/, /en/).
#    - The switcher should be clearly visible in the site's header.

# 3.4. Saving User Settings
#    - All accessibility settings (contrast, text size, language) should be saved in the browser's Local Storage.
#    - Upon returning to the site, the saved settings should be automatically loaded and applied.

# --- Stage 4: Finalization and Testing ---

# 4.1. Verification
#    - Check if all changes have been implemented correctly.
#    - Test the site on different browsers (Chrome, Firefox, Safari, Edge).
#    - Test the site on different devices (desktop, tablet, smartphone).

# 4.2. Final Report
#    - Generate a report on the changes made and the post-modernization accessibility audit.