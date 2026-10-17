#!/usr/bin/env bash
# Uploads the sample pack zips from Google Drive to the R2 bucket.
#
# The object keys here must stay in sync with functions/_products.js.
#
# Requires rclone and an R2 API token exported in the environment:
#
#   brew install rclone
#   export RCLONE_CONFIG_R2_TYPE=s3
#   export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
#   export RCLONE_CONFIG_R2_ENDPOINT=https://4a555e0015a78f527ae10d4b815ba8e6.r2.cloudflarestorage.com
#   export RCLONE_CONFIG_R2_ACCESS_KEY_ID=<access key id>
#   export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=<secret access key>
#
# Then: ./scripts/upload-packs.sh
# Safe to re-run — rclone skips files already uploaded with a matching size.

set -euo pipefail

BUCKET="r2:mcp-audio-downloads"
SRC="$HOME/Library/CloudStorage/GoogleDrive-sprawlic@gmail.com/My Drive/SAMPLEBOX"

if [ -z "${RCLONE_CONFIG_R2_ACCESS_KEY_ID:-}" ]; then
  echo "error: R2 credentials are not exported. See the header of this script." >&2
  exit 1
fi

# key : source path (relative to SRC)
PACKS=(
  "vol-1.zip|MISCHA CHILLAK VOL1/FINALS/ Mischa Chillak VOL1 16bit/Mischa Chillak VOL1.zip"
  "vol-2.zip|MISCHA CHILLAK VOL2/Mischa Chillak Vol2.zip"
  "vol-3.zip|MISCHA CHILLAK VOL.3/Mischa Chillak Vol 3.zip"
  "vol-4.zip|Mischa Chillak Vol.4.zip"
  "vol-5.zip|Mischa Chillak Vol.5.zip"
  "accents-vol-1.zip|Mischa Chillak Accents Vol1/Mischa_Chillak_Accents_Vol1.zip"
)

# Verify every source exists before transferring anything, so a typo fails fast
# rather than three gigabytes in.
missing=0
for entry in "${PACKS[@]}"; do
  path="$SRC/${entry#*|}"
  if [ ! -f "$path" ]; then
    echo "missing: $path" >&2
    missing=1
  fi
done
[ "$missing" -eq 0 ] || { echo "aborting — fix the paths above." >&2; exit 1; }

for entry in "${PACKS[@]}"; do
  key="${entry%%|*}"
  path="$SRC/${entry#*|}"
  echo ""
  echo "==> $key"
  # One transfer at a time: these stream out of the Google Drive mount, which
  # does not cope well with parallel reads of multi-gigabyte files.
  rclone copyto "$path" "$BUCKET/$key" \
    --progress \
    --transfers 1 \
    --s3-chunk-size 64M \
    --s3-upload-concurrency 4 \
    --s3-no-check-bucket \
    --retries 5 \
    --low-level-retries 20
done

echo ""
echo "done. verify with: wrangler r2 object get mcp-audio-downloads/vol-1.zip --file /dev/null"
