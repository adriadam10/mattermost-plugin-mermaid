import manifest from '../../plugin.json';

import MermaidCodeBlock from './mermaid_block.jsx';

const STYLES = `
.mermaid-plugin { margin: 5px 0; }
.mermaid-plugin__diagram {
    overflow-x: auto;
    padding: 8px;
    border: 1px solid rgba(var(--center-channel-color-rgb), 0.16);
    border-radius: 4px;
}
.mermaid-plugin__diagram { cursor: zoom-in; }
.mermaid-plugin__diagram svg { max-width: 100%; height: auto; }
.mermaid-plugin__overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.8);
    cursor: zoom-out;
}
.mermaid-plugin__overlay-diagram {
    width: 94vw;
    height: 88vh;
    overflow: hidden;
    border-radius: 4px;
    background: var(--center-channel-bg);
    cursor: grab;
}
.mermaid-plugin__overlay-content { width: 100%; height: 100%; padding: 16px; box-sizing: border-box; }
/* Mermaid sets an inline max-width; the zoomed copy must fill the window instead. */
.mermaid-plugin__overlay-content svg { width: 100%; height: 100%; max-width: none !important; }
.mermaid-plugin__overlay-close {
    position: fixed;
    top: 12px;
    right: 20px;
    border: none;
    background: none;
    color: #fff;
    font-size: 32px;
    line-height: 1;
    cursor: pointer;
}
.mermaid-plugin__overlay-hint {
    position: fixed;
    bottom: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
}
.mermaid-plugin__toggle {
    padding: 2px 0;
    border: none;
    background: none;
    color: var(--link-color);
    font-size: 12px;
    cursor: pointer;
}
.mermaid-plugin__error { color: var(--error-text); font-size: 12px; }
`;

class Plugin {
    initialize(registry) {
        this.style = document.createElement('style');
        this.style.textContent = STYLES;
        document.head.appendChild(this.style);

        registry.registerCodeBlockActionComponent(MermaidCodeBlock);
    }

    uninitialize() {
        this.style?.remove();
    }
}

window.registerPlugin(manifest.id, new Plugin());
