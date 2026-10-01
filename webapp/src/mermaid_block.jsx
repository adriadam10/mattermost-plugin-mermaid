import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {useSelector} from 'react-redux';

import {isMermaidCode} from './fences.js';

const STRINGS = {
    en: {showCode: 'Show code', showDiagram: 'Show diagram', error: 'Mermaid error'},
    es: {showCode: 'Ver código', showDiagram: 'Ver diagrama', error: 'Error de Mermaid'},
};

let mermaidPromise;
let renderCount = 0;

function isDarkTheme() {
    const rgb = getComputedStyle(document.body).getPropertyValue('--center-channel-bg-rgb').split(',').map(Number);
    if (rgb.length !== 3 || rgb.some(Number.isNaN)) {
        return false;
    }
    const [r, g, b] = rgb;
    return (0.299 * r) + (0.587 * g) + (0.114 * b) < 128;
}

async function renderSvg(code) {
    mermaidPromise ??= import('mermaid').then((m) => m.default);
    const mermaid = await mermaidPromise;
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        suppressErrorRendering: true,
        theme: isDarkTheme() ? 'dark' : 'default',
    });
    const {svg} = await mermaid.render(`mermaid-plugin-${++renderCount}`, code);
    return svg;
}

// Registered as a code block action: it is mounted inside every code block's hover
// overlay, so it renders the diagram through a portal placed just before the block.
export default function MermaidCodeBlock({code}) {
    const mermaid = useSelector((state) => isMermaidCode(state.entities.posts.posts, code));
    return mermaid ? <Diagram code={code}/> : null;
}

function Diagram({code}) {
    const anchor = useRef(null);
    const [target, setTarget] = useState(null);
    const [result, setResult] = useState(null);
    const [showCode, setShowCode] = useState(false);

    // Re-render when the user changes theme.
    const preferences = useSelector((state) => state.entities.preferences.myPreferences);
    const locale = useSelector((state) => state.entities.users.profiles[state.entities.users.currentUserId]?.locale);
    const t = STRINGS[locale?.split('-')[0]] || STRINGS.en;

    useLayoutEffect(() => {
        const block = anchor.current?.closest('.post-code');
        if (!block) {
            return undefined;
        }
        const container = document.createElement('div');
        container.className = 'mermaid-plugin';
        block.before(container);
        setTarget({block, container});
        return () => {
            container.remove();
            block.style.display = '';
        };
    }, []);

    useEffect(() => {
        let alive = true;
        renderSvg(code).then(
            (svg) => alive && setResult({svg}),
            (err) => alive && setResult({error: err?.message || String(err)}),
        );
        return () => {
            alive = false;
        };
    }, [code, preferences]);

    // The code stays hidden while rendering so it doesn't flash before the diagram.
    const codeVisible = showCode || Boolean(result?.error);
    useLayoutEffect(() => {
        if (target) {
            target.block.style.display = codeVisible ? '' : 'none';
        }
    }, [target, codeVisible]);

    let panel = null;
    if (result?.error) {
        panel = <div className='mermaid-plugin__error'>{`${t.error}: ${result.error}`}</div>;
    } else if (result?.svg) {
        panel = (
            <>
                {!showCode && (
                    <div
                        className='mermaid-plugin__diagram'
                        dangerouslySetInnerHTML={{__html: result.svg}}
                    />
                )}
                <button
                    type='button'
                    className='mermaid-plugin__toggle'
                    onClick={() => setShowCode(!showCode)}
                >
                    {showCode ? t.showDiagram : t.showCode}
                </button>
            </>
        );
    }

    return (
        <span
            ref={anchor}
            style={{display: 'none'}}
        >
            {target && ReactDOM.createPortal(panel, target.container)}
        </span>
    );
}
