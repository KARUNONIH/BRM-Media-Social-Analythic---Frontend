# Graph Report - frontend  (2026-10-22)

## Corpus Check
- 9 files · ~2,614 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 108 nodes · 102 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- compilerOptions
- compilerOptions
- devDependencies
- plugins
- dependencies
- package.json
- React + TypeScript + Vite
- lib
- tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 15 edges
3. `scripts` - 5 edges
4. `plugins` - 4 edges
5. `rules` - 3 edges
6. `lib` - 3 edges
7. `React + TypeScript + Vite` - 3 edges
8. `react` - 2 edges
9. `react/only-export-components` - 2 edges
10. `@refinedev/core` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.10
Nodes (20): src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, module (+12 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 2 - "devDependencies"
Cohesion: 0.11
Nodes (19): oxlint, devDependencies, oxlint, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom (+11 more)

### Community 3 - "plugins"
Cohesion: 0.15
Nodes (10): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, react, typescript (+2 more)

### Community 4 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, react, react-dom, react-router-dom, @refinedev/core, @refinedev/react-router, @refinedev/simple-rest, react (+5 more)

### Community 5 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 6 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 7 - "lib"
Cohesion: 0.67
Nodes (3): DOM, lib, ES2023

## Knowledge Gaps
- **66 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `lib`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._