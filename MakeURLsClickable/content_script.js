(function() {
    'use strict';

    // Function to linkify plain text URLs
    function linkifyText(node) {
        if (node.nodeType === 3) { // nodeType3 is a Text node
			const urlRegex = /((https?:\/\/|www\.)[^\s"<>;()[\]]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\/[^\s"<>;()[\]]*)?)(?=\s|\b)(?![.,;()[\]])(?:\b|$)/gi; // Updated the regex with a Lookahead with special Characters, Space, Period
			
            //Add Email Regex                  AAA@bbb.com
            //Add URL Prefix FTP Regex         ftp://ftp.com
            //Add URL Prefix File Regex        file:///Drive/file.txt
            const text = node.nodeValue;
            const matches = text.match(urlRegex);
            if (matches) {
                const span = document.createElement('span');
                let lastIndex = 0;
                matches.forEach(url => {
                    const index = text.indexOf(url, lastIndex);
                    if (index > lastIndex) {
                        span.appendChild(document.createTextNode(text.substring(lastIndex, index)));
                    }

					
                    if (url === 'www.' || url === 'http://' || url === 'https://' || /^www\.[\'\`~!@#$%^&*()_+=\[\]{}|\\;:"<>,/?\s]/.test(url) || /^http:\/\/[\'\`~!@#$%^&*()_+={};:"<>,?.]/.test(url) || /^https:\/\/[\'\`~!@#$%^&*()_+={};:"<>,?.]/.test(url) )// Special exceptions to NOT linkify. If its www.;   where there is an unnaceptable char following URL Prefix;
                    {
                        span.appendChild(document.createTextNode(url));
                    } 
                    else if (/\.{2,}/.test(url)) // Special exceptions to NOT linkify. If its multiple consecutive dots
                    {
                        span.appendChild(document.createTextNode(url));
                    } 
                    else
                    {
                        let href = url;
                        if (!href.match(/^https?:\/\//i))
                        {
                            href = 'https://' + href;
                        }
                        const a = document.createElement('a');
                        a.href = href;
                        a.target = '_blank';
                        //a.style.userSelect = 'none'; //This is what made the new Clickable URL Link Un-highlightable.
                        a.textContent = url;
                        span.appendChild(a);
                    }
                    lastIndex = index + url.length;
                });
                if (lastIndex < text.length)//If there is any remaining text, append it
                {
                    span.appendChild(document.createTextNode(text.substring(lastIndex)));
                }
                node.parentNode.replaceChild(span, node);
            }
        }
    }

    // Function to go throughout the DOM reading each line and checking for elements that both match and is not excluded, then it applies "Linkification" to the text
    function readANDwriteTheDOM(node) {

        const excludedTags = ['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'OPTION'];
        if (node.nodeType === 1 && !excludedTags.includes(node.nodeName) && node.tagName !== 'A') { // Element node    added     node.tagName !== 'A'
            for (let child = node.firstChild; child; child = child.nextSibling) {
                readANDwriteTheDOM(child);
            }
        } else if (node.nodeType === 3) {
            linkifyText(node);
        }

    }

    // Apply linkifyText to the entire document body
    readANDwriteTheDOM(document.body);
})();
