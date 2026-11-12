// The Netlify edge function (netlify/edge-functions/page-meta.ts) puts a page's
// own tags into the HTML so crawlers see them. Once the app has rendered its
// own, those must go, otherwise the page would carry every tag twice.
export const removeEdgeMeta = () => {
    document.querySelectorAll('[data-edge]').forEach((node) => node.remove());
};

// Structured data (JSON-LD) describes the page that was loaded. It stays while
// that page is shown, for crawlers that render it, and goes when the visitor
// navigates elsewhere, so it can never describe the wrong page.
export const removeEdgeStructuredData = () => {
    document.querySelectorAll('script[data-edge-ld]').forEach((node) => node.remove());
};
