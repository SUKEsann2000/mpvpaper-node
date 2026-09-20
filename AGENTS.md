# mpvpaper-node – AI Agent Customization

## 📦 Project overview
- **Name**: `mpvpaper-node`
- **Description**: A lightweight TypeScript wrapper for **mpvpaper**, the Wayland video‑wallpaper utility.
- **Language / Runtime**: TypeScript (ESM), compiled with `tsc`.
- **Main entry point**: `src/index.ts` – exports the `MPVPaper` class.
- **Key types**: `src/type.ts` defines `InitializeOptions`, `MPVPaperOptions`, and `AutoMode`.
- **Repository**: https://github.com/SUKEsann2000/mpvpaper-node

## 🛠️ Build & development commands
| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript (`tsc`) → `dist/` |
| `npm run dev`   | Run `tsc -w` (watch mode) |
| `npm start`     | Build then execute `dist/index.js` |

> **Note for agents**: Use these commands when a task mentions building, testing, or running the library.

## 📚 Documentation links
- **README** – https://github.com/SUKEsann2000/mpvpaper-node#readme
- **mpvpaper manual** – https://github.com/GhostNaN/mpvpaper/blob/master/mpvpaper.man
- **mpv command reference** – https://mpv.io/manual/master/#command-interface

## ⚙️ Architectural notes
- All source files live under `src/` and are compiled to `dist/`.
- The library is **ESM** (`"type": "module"` in `package.json`). Import with `import { MPVPaper } from "mpvpaper-node"`.
- `MPVPaper` builds the argument list for the `mpvpaper` binary based on `InitializeOptions.options`.
- The class manages a single `ChildProcess` (`mpvpaper`) and exposes:
  - `spawn(): Promise<void>` – start the process (idempotent).
  - `stop(): void` – terminate the process.
  - Event helpers `onExit`, `onError`.
  - Getter `isRunning`.

## 🚩 Common pitfalls & gotchas
- **mpvpaper binary is external** – it must be installed separately and be on `PATH`. If not, provide `InitializeOptions.mpvpaper_path`.
- **Output identifier** – must match a Wayland output (e.g., `DP-1`, `HDMI-A-1`, `ALL`). Incorrect values cause launch failure.
- **Option types** – follow the definitions in `src/type.ts`. For example, `verbose` accepts `1 | 2`, `autoMode` must be one of `"FULL" | "MAX" | "ACTIVE"`.
- **Idempotent `spawn`** – calling `spawn` when already running resolves immediately; agents should check `isRunning` if they need to avoid redundant starts.
- **ESM import** – because the package is ESM, `require()` will not work; always use `import` syntax.

## 🤖 How agents should use this file
- When a user asks how to **build**, **run**, or **debug** the library, refer to the *Build & development commands* table.
- When a user asks about **usage**, point them to the README and the `MPVPaper` API summary above.
- When a user encounters an error related to the external `mpvpaper` binary, remind them of the *Common pitfalls* section.
- Keep responses concise; link to the full documentation instead of duplicating large blocks.

---
*This file is intentionally minimal and links to the full project documentation. It helps AI coding agents quickly understand how to interact with the mpvpaper-node codebase.*