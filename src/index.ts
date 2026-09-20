import { spawn, type ChildProcess, type SpawnOptions } from "child_process";
import type { InitializeOptions } from "./type.ts";

type ExitCallback = (
    code: number | null,
    signal: NodeJS.Signals | null,
) => void;

export class MPVPaper {
    private mpvpaper: ChildProcess | undefined;

    private readonly exitCallbacks = new Set<ExitCallback>();
    private readonly errorCallbacks = new Set<(err: Error) => void>();

    constructor(private options: InitializeOptions) {}

    private buildArgs(): string[] {
        const o = this.options.options ?? {};
        const args: string[] = [];

        if (o.help) args.push("--help");
        if (o.helpOutput) args.push("--help-output");
        if (o.verbose) args.push(o.verbose === 2 ? "-vv" : "-v");
        if (o.fork) args.push("--fork");
        if (o.autoPause) args.push("--auto-pause");
        if (o.autoStop) args.push("--auto-stop");
        if (o.autoMode) args.push("--auto-mode", o.autoMode);
        if (o.slideshow !== undefined) {
            args.push("--slideshow", String(o.slideshow));
        }
        if (o.layer) args.push("--layer", o.layer);
        if (o.mpvOptions) args.push("--mpv-options", o.mpvOptions);

        args.push(this.options.output, this.options.video);

        return args;
    }

    /**
     * Starts mpvpaper.
     *
     * The promise is rejected if the launch fails.
     * Does nothing if mpvpaper is already running.
     */
    public spawn(): Promise<void> {
        if (this.mpvpaper) {
            return Promise.resolve();
        }

        const args = this.buildArgs();

        const stdioConfig: SpawnOptions["stdio"] =
            this.options.stdin === false
                ? ["ignore", "inherit", "inherit"]
                : ["pipe", "inherit", "inherit"];

        const child = spawn(
            this.options.mpvpaper_path ?? "mpvpaper",
            args,
            {
                stdio: stdioConfig,
            },
        );

        return new Promise((resolve, reject) => {
            let settled = false;

            child.once("error", (err) => {
                // spawn() failed before the process was created.
                if (this.mpvpaper === child) {
                    this.mpvpaper = undefined;
                }

                for (const callback of this.errorCallbacks) {
                    callback(err);
                }

                if (!settled) {
                    settled = true;
                    reject(err);
                }
            });

            child.once("spawn", () => {
                if (settled) return;

                settled = true;
                this.mpvpaper = child;

                resolve();
            });

            child.once("exit", (code, signal) => {
                // Only clear the current process reference.
                //
                // This check matters if another process has already
                // been spawned after this child exited.
                if (this.mpvpaper === child) {
                    this.mpvpaper = undefined;
                }

                for (const callback of this.exitCallbacks) {
                    callback(code, signal);
                }
            });
        });
    }

    /**
     * Writes data to mpvpaper's stdin.
     */
    public writeStdin(data: string | Buffer): void {
        if (!this.mpvpaper) {
            throw new Error(
                "mpvpaper is not running – cannot write to stdin",
            );
        }

        if (!this.mpvpaper.stdin) {
            throw new Error(
                "mpvpaper stdin is not available",
            );
        }

        this.mpvpaper.stdin.write(data);
    }

    /**
     * Stops the mpvpaper process.
     */
    public stop(): void {
        this.mpvpaper?.kill();
    }

    /**
     * Subscribes to process exit events.
     *
     * The callback remains registered until removed with offExit().
     */
    public onExit(callback: ExitCallback): void {
        this.exitCallbacks.add(callback);
    }

    /**
     * Removes an exit callback.
     */
    public offExit(callback: ExitCallback): void {
        this.exitCallbacks.delete(callback);
    }

    /**
     * Subscribes to process errors.
     *
     * The callback remains registered until removed with offError().
     */
    public onError(callback: (err: Error) => void): void {
        this.errorCallbacks.add(callback);
    }

    /**
     * Removes an error callback.
     */
    public offError(callback: (err: Error) => void): void {
        this.errorCallbacks.delete(callback);
    }

    /**
     * Whether mpvpaper is currently running.
     */
    public get isRunning(): boolean {
        return this.mpvpaper !== undefined;
    }
}
