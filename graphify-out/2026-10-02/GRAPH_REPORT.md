# Graph Report - scrapingblog  (2026-09-30)

## Corpus Check
- 29 files · ~12,579 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .css 2, (none) 1)

## Summary
- 259 nodes · 405 edges · 12 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6a0c45d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- cn
- UpdatePost.tsx
- compilerOptions
- components.json
- dropdown-menu.tsx
- dependencies
- devDependencies
- compilerOptions
- api.ts
- compilerOptions
- React + TypeScript + Vite

## God Nodes (most connected - your core abstractions)
1. `cn()` - 32 edges
2. `compilerOptions` - 21 edges
3. `react` - 16 edges
4. `compilerOptions` - 15 edges
5. `lucide-react` - 9 edges
6. `@base-ui/react` - 7 edges
7. `react-router-dom` - 7 edges
8. `tailwind` - 6 edges
9. `aliases` - 6 edges
10. `Button()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuSubContent()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts
- `DropdownMenuRadioItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (12 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (35): name, private, scripts, build, dev, lint, preview, type (+27 more)

### Community 1 - "cn"
Cohesion: 0.11
Nodes (28): @base-ui/react, class-variance-authority, @tiptap/extension-highlight, ref_tiptap_extension_link, @tiptap/react, @tiptap/starter-kit, Button(), buttonVariants (+20 more)

### Community 2 - "UpdatePost.tsx"
Cohesion: 0.11
Nodes (27): html-react-parser, lucide-react, react, react-dom, react-draggable, react-router-dom, createBlog(), getBlogBySlug() (+19 more)

### Community 3 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations, jsx, lib (+14 more)

### Community 4 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "dropdown-menu.tsx"
Cohesion: 0.11
Nodes (16): deleteBlog(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+8 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, @base-ui/react, class-variance-authority, clsx, @fontsource-variable/geist, html-react-parser, lucide-react (+13 more)

### Community 7 - "devDependencies"
Cohesion: 0.11
Nodes (18): devDependencies, @babel/core, babel-plugin-react-compiler, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+10 more)

### Community 8 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 9 - "api.ts"
Cohesion: 0.18
Nodes (10): axios, BlogAPIURL, CreateBlogData, deleteBlogBySlug, DeleteBlogResponse, GetPaginatedBlogsData, SingleBlogData, SingleBlogResponse (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, ignoreDeprecations, paths, files, references

### Community 11 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **137 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 149 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `react` connect `UpdatePost.tsx` to `package.json`, `cn`, `dropdown-menu.tsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _137 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06401137980085349 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.11379800853485064 - nodes in this community are weakly interconnected._
- **Should `UpdatePost.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10960960960960961 - nodes in this community are weakly interconnected._