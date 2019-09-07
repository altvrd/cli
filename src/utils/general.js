const ensureNoSlash = (url) => (url.endsWith('/') ? url.substring(0, url.length - 1) : url);

module.exports = { ensureNoSlash };
