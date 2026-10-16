#!/usr/bin/env bash
# Zpracování videa na pozadí: seamless smyčka 6–8 s, bez zvuku, WebM (VP9) + MP4 (H.264), desktop + mobil, poster.
#
#   scripts/video.sh <název> <zdroj.mp4> [hflip]
#   např. scripts/video.sh ambient assets/video/ambient.mp4
#
# Výstup do public/video/: <název>.webm|.mp4 (1280×720), <název>-m.webm|.mp4 (360×640, výřez na výšku),
# <název>.webp a <název>-m.webp (první snímek, ztmavený).
# Kratší zdroj než ~9 s se zpomalí s interpolací snímků (klidnější pohyb), delší se ořízne.
# Cesty k binárkám lze přepsat proměnnými FFMPEG a FFPROBE.
set -euo pipefail
export LC_ALL=C

NAME=${1:?název}
SRC=${2:?zdroj}
FLIP=${3:-}
FFMPEG=${FFMPEG:-ffmpeg}
FFPROBE=${FFPROBE:-ffprobe}
OUT=public/video
FPS=24
X=1    # délka crossfadu konce do začátku (s)
L=9    # délka před smyčkou → výsledná smyčka L − X = 8 s

mkdir -p "$OUT"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

D=$("$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$SRC")
F=$(awk -v d="$D" -v l="$L" 'BEGIN { f = l / d; if (f < 1) f = 1; printf "%.4f", f }')
echo "zdroj ${D}s → zpomalení ×$F"

PRE=""
[[ "$FLIP" == "hflip" ]] && PRE="hflip,"
if awk -v f="$F" 'BEGIN { exit !(f > 1.001) }'; then
  PRE="${PRE}minterpolate=fps=$(awk -v f="$F" -v r=$FPS 'BEGIN { printf "%.3f", f * r }'):mi_mode=mci:mc_mode=aobmc:vsbmc=1,setpts=$F*PTS,"
fi
PRE="${PRE}scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720"

# Master: smyčka přes xfade – posledních X s přechází do prvních X s, výstup začíná snímkem v čase X
"$FFMPEG" -v error -y -i "$SRC" -an -filter_complex "
  [0:v]$PRE,fps=$FPS,trim=0:$L,setpts=PTS-STARTPTS,split[a][b];
  [a]trim=$X:$L,setpts=PTS-STARTPTS[a1];
  [b]trim=0:$X,setpts=PTS-STARTPTS[b1];
  [a1][b1]xfade=transition=fade:duration=$X:offset=$((L - 2 * X)),format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -crf 10 -preset medium "$TMP/master.mp4"

MOBILE="crop=ih*9/16:ih,scale=360:640"

enc() { # <vstupní filtr> <přípona> <crf webm> <crf mp4>
  "$FFMPEG" -v error -y -i "$TMP/master.mp4" -an -vf "$1" \
    -c:v libvpx-vp9 -b:v 0 -crf "$3" -row-mt 1 -deadline good -cpu-used 2 -g 96 "$OUT/$NAME$2.webm"
  "$FFMPEG" -v error -y -i "$TMP/master.mp4" -an -vf "$1" \
    -c:v libx264 -crf "$4" -preset slow -profile:v high -pix_fmt yuv420p -g 96 -movflags +faststart "$OUT/$NAME$2.mp4"
}
enc "null" "" 40 30
enc "$MOBILE" "-m" 38 28

# Poster: první snímek smyčky, ztmavený
"$FFMPEG" -v error -y -i "$TMP/master.mp4" -frames:v 1 -vf "eq=brightness=-0.06:contrast=0.92" -c:v libwebp -quality 55 "$OUT/$NAME.webp"
"$FFMPEG" -v error -y -i "$TMP/master.mp4" -frames:v 1 -vf "$MOBILE,eq=brightness=-0.06:contrast=0.92" -c:v libwebp -quality 55 "$OUT/$NAME-m.webp"

"$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$OUT/$NAME.mp4" | xargs printf "smyčka %.2f s\n"
ls -l "$OUT/$NAME"* | awk '{ printf "%-28s %6.0f KB\n", $NF, $5 / 1024 }'
