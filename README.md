# Mattermost Mermaid plugin

Renders ` ```mermaid ` code blocks in Mattermost posts as diagrams.

- Follows the user's light/dark theme.
- "Show code" / "Show diagram" toggle under each diagram.
- Invalid diagrams fall back to the normal code block with the Mermaid error above it.
- Webapp-only plugin (no server part). Works in the browser and the desktop app; the mobile app keeps showing the code block.

## How it works

Mattermost has no plugin hook to replace a code block, and the code block plugin
components (`registerCodeBlockActionComponent`) only receive the code, not the fence
language. The plugin registers one of those components, checks against the loaded post
messages whether the code came from a ` ```mermaid ` fence, and if so renders the diagram
through a portal placed right before the code block, hiding the original block.

Diagrams are rendered with `securityLevel: 'strict'`.

## Build

Only Docker is needed:

```sh
./build.sh
# -> dist/com.github.adriadam10.mermaid-<version>.tar.gz
```

## CI and releases

- Every push and PR runs the tests and the build; the plugin `.tar.gz` is attached to the run as an artifact.
- Pushing a tag `vX.Y.Z` (matching `version` in `plugin.json`) publishes a GitHub release with the plugin.
- Dependabot checks npm and GitHub Actions weekly. Patch/minor updates merge automatically once CI passes; majors wait for review.

## Install

System Console → Plugins → Plugin Management → Upload Plugin, or with `mmctl`:

```sh
mmctl plugin add dist/com.github.adriadam10.mermaid-<version>.tar.gz
mmctl plugin enable com.github.adriadam10.mermaid
```

Uploading requires `PluginSettings.EnableUploads = true`.

Tested on Mattermost 11.11 with Mermaid 12.

## License

MIT
