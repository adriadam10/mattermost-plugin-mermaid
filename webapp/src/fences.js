// Mattermost's code block components only receive the code, not the fence language,
// so we find out whether a block was ```mermaid by looking at the post messages.

const OPEN = /^ {0,3}(`{3,}|~{3,})[ \t]*([^\s`]*)/;

// Returns the bodies of every ```mermaid fenced block in a markdown message.
export function mermaidBlocks(message) {
    const blocks = [];
    let fence = null;
    let lines = [];

    for (const line of message.split('\n')) {
        if (!fence) {
            const m = OPEN.exec(line);
            if (m) {
                fence = {marker: m[1], mermaid: m[2].toLowerCase() === 'mermaid'};
                lines = [];
            }
            continue;
        }

        const close = line.trim();
        if (close[0] === fence.marker[0] && close.length >= fence.marker.length && /^(`+|~+)$/.test(close)) {
            if (fence.mermaid) {
                blocks.push(lines.join('\n').trim());
            }
            fence = null;
            continue;
        }
        lines.push(line);
    }

    // An unclosed fence runs to the end of the message.
    if (fence?.mermaid) {
        blocks.push(lines.join('\n').trim());
    }
    return blocks;
}

const cache = new WeakMap();

function blocksOf(post) {
    let blocks = cache.get(post);
    if (!blocks) {
        blocks = post.message?.includes('mermaid') ? mermaidBlocks(post.message) : [];
        cache.set(post, blocks);
    }
    return blocks;
}

let lastPosts = null;
let lastBodies = new Set();

// Whether `code` comes from a ```mermaid block of any post loaded in the store.
// Runs on every store update, so the set is only rebuilt when the posts change.
export function isMermaidCode(posts, code) {
    if (posts !== lastPosts) {
        lastBodies = new Set(Object.values(posts).flatMap(blocksOf));
        lastPosts = posts;
    }
    return lastBodies.has(code.trim());
}
