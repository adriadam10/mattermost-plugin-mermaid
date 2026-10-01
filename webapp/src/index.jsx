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
.mermaid-plugin__diagram svg { max-width: 100%; height: auto; }
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
