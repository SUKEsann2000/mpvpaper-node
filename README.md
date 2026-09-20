# mpvpaper-node

A lightweight **TypeScript** wrapper for **mpvpaper**, the Wayland video‑wallpaper utility.

---

## 📦 Installation

```bash
npm install mpvpaper-node
```

> **Note**: `mpvpaper` itself is **not** bundled. Install it separately and ensure it is on your `PATH`, or provide its absolute path via `InitializeOptions.mpvpaper_path`.

---

## 🛠️ Usage

```ts
import { MPVPaper } from "mpvpaper-node";

const paper = new MPVPaper({
    output: "DP-1",               // e.g. DP-1, HDMI-A-1, ALL
    video: "/path/to/video.mp4", // local file or URL
    options: {
        autoMode: "FULL",        // FULL | MAX | ACTIVE
        autoPause: true,
        mpvOptions: "no-audio --loop-playlist",
        verbose: 2,              // -vv (1 = -v, 2 = -vv)
    },
});

await paper.spawn(); // throws on failure

// Send an mpv command while the wallpaper is running
paper.writeStdin("set volume 30\n");

// When finished
paper.stop();
```

---

## 📚 API Reference

| Member | Type / Signature | Description |
|--------|------------------|-------------|
| **constructor** | `new MPVPaper(options: InitializeOptions)` | Creates a wrapper instance. `output` and `video` are required; `mpvpaper_path` is optional. |
| **spawn** | `spawn(): Promise<void>` | Starts the `mpvpaper` process. Resolves when the process is successfully spawned; rejects on launch errors. No‑op if already running. |
| **stop** | `stop(): void` | Terminates the running `mpvpaper` process (if any). |
| **writeStdin** | `writeStdin(data: string \| Buffer): void` | Writes raw data to the child process’s stdin. Throws if the process is not running or stdin is unavailable. |
| **onExit** | `onExit(cb: ExitCallback): void` | Registers a callback that is invoked once when the process exits. |
| **offExit** | `offExit(cb: ExitCallback): void` | Unregisters a previously added exit callback. |
| **onError** | `onError(cb: (err: Error) => void): void` | Registers a callback for launch‑time errors (e.g., binary not found). |
| **offError** | `offError(cb: (err: Error) => void): void` | Unregisters a previously added error callback. |
| **isRunning** | `readonly isRunning: boolean` | Returns `true` while the child process is alive. |

### Types

```ts
export type InitializeOptions = {
    /** Full path to the mpvpaper binary. If omitted, "mpvpaper" from PATH is used */
    mpvpaper_path?: string;
    /** Output identifier (e.g. "DP-1", "HDMI-A-1", "ALL") */
    output: string;
    /** Path or URL of the video to play */
    video: string;
    /** Additional command‑line flags */
    options?: MPVPaperOptions;
    /** If true, a pipe to stdin is opened (default: true) */
    stdin?: boolean;
};

export type MPVPaperOptions = {
    help?: boolean;          // --help
    helpOutput?: boolean;    // --help-output
    verbose?: 1 | 2;         // -v / -vv
    fork?: boolean;          // --fork
    autoPause?: boolean;     // --auto-pause
    autoStop?: boolean;      // --auto-stop
    autoMode?: "FULL" | "MAX" | "ACTIVE"; // --auto-mode
    slideshow?: number;      // --slideshow <seconds>
    layer?: string;          // --layer <layer>
    mpvOptions?: string;     // --mpv-options "<options>"
};
```

---

## 📖 Further Reading

- **mpvpaper manual** – <https://github.com/GhostNaN/mpvpaper/blob/master/mpvpaper.man>
- **mpv command reference** – <https://mpv.io/manual/master/#command-interface>

---

## 🛡️ License

Apache‑2.0 © 2026 SUKEsann2000
