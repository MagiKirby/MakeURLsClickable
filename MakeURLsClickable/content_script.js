
(function() {
    'use strict';

    // Function to linkify plain text URLs
    function linkifyText(node) {
        if (node.nodeType === 3) { // Text node
            const urlRegex = /((https?:\/\/|www\.)[^\s/$.?#].[^\s]*|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/[^\s]*)?)/gi; // Updated regex to capture entire URL
            const text = node.nodeValue;
            if (urlRegex.test(text)) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(urlRegex, function(url) {
                    let href = url;
                    if (!href.match(/^https?:\/\//i)) {
                        href = 'http://' + href;
                    }
                    return '<a href="' + href + '" target="_blank" style="user-select: none;">' + url + '</a>';
                });
                node.parentNode.replaceChild(span, node);
            }
        } else if (node.nodeType === 1 && node.tagName !== 'A') { // Element node, not a link
            /**
            * List of additional tags that might be useful to skip:
            * SCRIPT: To avoid modifying script tags.
            * STYLE: To avoid modifying style tags.
            * IMG: To avoid modifying images.
            * IFRAME: To avoid modifying iframes.
            * CANVAS: To avoid modifying canvas elements.
            * SVG: To avoid modifying SVG elements.
            * CODE: To avoid modifying code snippets.
            * PRE: To avoid modifying preformatted text.
            * TEXTAREA: To avoid modifying text areas.
            * BUTTON: To avoid modifying button text.
            * INPUT: To avoid modifying input fields.
            * SELECT: To avoid modifying select dropdowns.
            * OPTION: To avoid modifying options within select dropdowns.
            */
            const skipTags = ['SCRIPT', 'STYLE', 'IMG', 'IFRAME', 'CANVAS', 'SVG'];
            if (!skipTags.includes(node.tagName)) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    linkifyText(node.childNodes[i]);
                }
            }
        }
    }

    // Apply the function to the entire document body
    linkifyText(document.body);
})();