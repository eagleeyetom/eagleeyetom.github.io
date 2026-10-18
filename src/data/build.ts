// One value per build, appended to the CSS and JS URLs that live in public/ and so keep
// fixed file names. A new deploy then changes those URLs, and returning visitors never
// pair the new HTML with a cached old stylesheet.
export const assetVersion = Date.now().toString(36);
