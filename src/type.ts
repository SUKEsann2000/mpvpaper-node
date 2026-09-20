export type AutoMode = "FULL" | "MAX" | "ACTIVE";

export type MPVPaperOptions = {
    /** --help: 使い方を表示して終了 */
    help?: boolean;
    /** --help-output: 利用可能な出力先を列挙して終了 */
    helpOutput?: boolean;
    /** -v / -vv: 冗長レベル (1 = -v, 2 = -vv) */
    verbose?: 1 | 2;
    /** --fork: 端末を閉じても動作を継続 */
    fork?: boolean;
    /** --auto-pause: 壁紙が隠れたときに自動で一時停止 */
    autoPause?: boolean;
    /** --auto-stop: 壁紙が隠れたときに自動で停止 */
    autoStop?: boolean;
    /** --auto-mode: 自動停止/一時停止のトリガー条件 */
    autoMode?: AutoMode;
    /** --slideshow: プレイリストの次へ進む秒数 */
    slideshow?: number;
    /** --layer: 表示レイヤー (既定: background) */
    layer?: string;
    /** --mpv-options: mpv に転送するオプション (例: "no-audio --loop-playlist") */
    mpvOptions?: string;
};

export type InitializeOptions = {
    /** mpvpaper バイナリのパス。省略時は PATH 上の "mpvpaper" を使用する */
    mpvpaper_path?: string;
    /** 出力先 (例: "DP-1", "HDMI-A-1", "ALL") */
    output: string;
    /** 再生する動画のパスまたは URL */
    video: string;
    /** 追加オプション */
    options?: MPVPaperOptions;
    /**
     * If true, the wrapper will open a pipe for stdin so that commands can be sent
     * to the running mpvpaper process via `MPVPaper.writeStdin`.
     * The default is `true` to keep backward compatibility while enabling the new feature.
     */
    stdin?: boolean;
};
