// Function to check if the current date is before a specific date
function isBeforeDate(targetDate) {
  const currentDate = new Date();
  return currentDate < targetDate;
}

// Date and time for when the redirection should stop (17.11.2024 at midnight)
const stopRedirectionDate = new Date("2024-11-07T00:00:00");

// Redirect subpages to "index.html" if the current date is before the stopRedirectionDate
if (
  isBeforeDate(stopRedirectionDate) &&
  window.location.pathname !== "./index.html"
) {
  window.location.href = "./index.html";
}
