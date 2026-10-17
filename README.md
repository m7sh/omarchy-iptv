# omarchy-iptv (Enhanced)

Lightweight, enhanced single-provider IPTV browser for Omarchy Linux with Hyprland and Quickshell.

* **One provider**: m3u playlist **or** Xtream Codes (Live + VOD)
* **★ Dedicated Favorites**: Instant 1-click access tab, custom reordering (▲/▼), and export/import backup
* **Channel Logos**: High-resolution logos rendered with aspect fit and clean fallback icons
* **Quality Badges**: Automatic detection and display of stream quality tags (`4K`, `FHD`, `HD`, `SD`)
* **Live EPG Guide**: XMLTV now/next guide with search, favorite stars, and "★ Favorites only" filter
* **Active Playback & Stop Controls**: Status bar indicator, playing highlight, and quick 1-click stop button
* **Smart Multi-Token Search**: Find channels fast (e.g. `star hd` matches `Star Movies (India) HD`)
* **Recent History**: Automatically tracks recently watched channels for quick return
* **Smooth MPV Playback**: Network buffering cache (`--cache=yes`, `--demuxer-max-bytes=64MiB`), Wayland app-id (`omarchy-iptv-player`), and optional `~/.config/omarchy-iptv/mpv.conf`
* **Themed & Secure**: Zero hardcoded colors; themed via Omarchy shell tokens. Stream URLs and Xtream passwords stay in secure cache files and keyring (`secret-tool`).

## Authorized Use

This plugin is a player. It does not provide, sell, or host any streams. You must only connect playlists and Xtream accounts you are authorized to use (your own provider subscription, officially redistributable public lists, etc.).

Unauthorized access to copyrighted broadcasts is your responsibility, not the authors'. The software is provided as-is; see `LICENSE`.

## Install

```sh
omarchy plugin add https://github.com/m7sh/OmarchyIPTV.git --enable
omarchy pkg add mpv
```

Requires `mpv` for playback. `python` (stdlib only) and `secret-tool` (libsecret) are used for sync and the Xtream password.

## Configure

Open the IPTV panel → **Setup**. Pick Xtream or M3U, fill the fields, **Save & sync**.

The Xtream password is stored in the keyring (`secret-tool`), not in `provider.json`. Leave the password blank on later saves to keep the current one.

Advanced: `~/.config/omarchy-iptv/provider.json` (mode 600) still works if you prefer files:

```json
{"type": "xtream", "host": "http://host:8080", "username": "myuser"}
```

```json
{"type": "m3u", "url": "https://example.com/playlist.m3u", "epg": "https://example.com/xmltv.xml"}
```

Optional `"user_agent"` key if the provider whitelists a player UA.

### Optional Custom MPV Configuration

You can place custom MPV player settings in `~/.config/omarchy-iptv/mpv.conf` (e.g. `hwdec=auto`, custom audio device, or keybindings). If present, it is automatically passed to mpv via `--include`.

### Limits

Sync caps what a provider may send, so a broken or hostile server (or a gzip bomb) cannot exhaust memory:

| input | on the wire | after gzip |
|---|---|---|
| m3u playlist | 32 MiB | 128 MiB |
| Xtream JSON (per call) | 32 MiB | 128 MiB |
| XMLTV guide | 256 MiB | 2 GiB (streamed into sqlite, never held whole) |

## Use

* **Left click bar icon**: open browser panel (**★ Favs / Live / VOD / Guide / Setup**)
* **Middle click bar icon**: stop mpv playback immediately
* **Right click bar icon**: re-sync provider + EPG
* **⏹ Stop button in panel**: stop current stream with 1 click
* **✕ Clear button in search**: instantly clear filter text
* **⛶ in panel**: open fullscreen 10-foot TV browser mode
* **Click on any channel row**: play in external mpv
* **▲ / ▼ in Favs tab**: reorder favorite channels up or down
* **Export / Import Favs in Setup**: backup favorites or restore on new machines

### Favorites & Backup

- Favorite channels are stored cleanly in `~/.config/omarchy-iptv/favorites.json`.
- In Setup, click **Export Favs** to create a backup at `~/.config/omarchy-iptv/favorites-export.json`.
- Click **Import Favs** to restore from the backup at any time.

### Fullscreen TV Mode

Keyboard-first navigation:
- `↑ / ↓`: navigate channel list
- `← / →`: cycle categories/groups
- `Enter`: play selected stream in mpv
- `Ctrl+F`: toggle favorite on selected channel
- `Tab / Shift+Tab`: cycle between **Live**, **★ Favorites**, and **VOD**
- `Type to filter`: instant smart search (multi-word support)
- `Esc`: clear search filter or exit fullscreen mode

## Architecture & Layout

```
manifest.json   # Plugin manifest (kinds: [bar-widget, overlay, service])
BarWidget.qml   # Status bar widget with playing status & quick panel loader
Panel.qml       # Enhanced panel: Favs, Live, VOD, Guide, Setup
IptvOverlay.qml # Fullscreen 10-foot TV browser with logos & quality badges
IptvService.qml # Singleton service: process managers, playback state, favorites & history
IptvModel.js    # Multi-token search, EPG filtering, badge parsing, favorite reordering
bin/iptv-sync   # Python stdlib helper: m3u/Xtream parser, XMLTV sqlite guide, dumps, export/import
bin/iptv-play   # Stream launcher with mpv buffering, Wayland app-id, and custom config
```

Cache: `~/.cache/omarchy-iptv/` (`channels.json`, `vod.json`, `epg.db`, mode 600).
Config: `~/.config/omarchy-iptv/` (`provider.json`, `favorites.json`, `history.json`, mode 600).

## Remove

```sh
omarchy plugin remove io.github.sam-blakeman.iptv
rm -rf ~/.config/omarchy-iptv ~/.cache/omarchy-iptv
```

## Credits

Forked from [sam-blakeman/OmarchyIPTV](https://github.com/sam-blakeman/OmarchyIPTV) and enhanced by [@m7sh](https://github.com/m7sh). Licensed under MIT.
