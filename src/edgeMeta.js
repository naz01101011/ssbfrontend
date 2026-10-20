// The Netlify edge function (netlify/edge-functions/article-meta.ts) puts the
// article's title, description, canonical and Open Graph tags into the HTML so
// crawlers see them. Once the app has rendered its own tags, those must go,
// otherwise the page would carry every tag twice.
export const removeEdgeMeta = () => {
    document.querySelectorAll('[data-edge]').forEach((node) => node.remove());
};
