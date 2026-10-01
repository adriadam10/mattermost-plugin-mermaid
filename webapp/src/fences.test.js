import assert from 'node:assert/strict';
import {test} from 'node:test';

import {isMermaidCode, mermaidBlocks} from './fences.js';

test('extracts only mermaid blocks', () => {
    const msg = [
        'text',
        '```mermaid',
        'graph TD',
        '  A --> B',
        '```',
        '```js',
        'graph TD',
        '```',
        '~~~~ Mermaid',
        'pie',
        '~~~~',
    ].join('\n');
    assert.deepEqual(mermaidBlocks(msg), ['graph TD\n  A --> B', 'pie']);
});

test('a shorter or different marker does not close the fence', () => {
    const msg = '````mermaid\ngraph TD\n```\nA-->B\n~~~~\n````';
    assert.deepEqual(mermaidBlocks(msg), ['graph TD\n```\nA-->B\n~~~~']);
});

test('unclosed fence runs to the end', () => {
    assert.deepEqual(mermaidBlocks('```mermaid\npie'), ['pie']);
});

test('isMermaidCode ignores untagged blocks with the same content', () => {
    const posts = {
        a: {message: '```\ngraph TD\n```'},
        b: {message: '```mermaid\nsequenceDiagram\n```'},
    };
    assert.equal(isMermaidCode(posts, 'graph TD'), false);
    assert.equal(isMermaidCode(posts, 'sequenceDiagram\n'), true);
});
