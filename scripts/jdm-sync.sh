#!/usr/bin/env bash
set -euo pipefail

# Run from the repository root. Never enable shell tracing: SSHPASS is secret.
: "${SSHPASS:?Missing GitHub secret JDM_SSH_PASSWORD}"
mode="${JDM_MODE:-compare}"
case "$mode" in
  compare) options=(--dry-run) ;;
  deploy) options=() ;;
  *) echo 'Mode must be compare or deploy.' >&2; exit 1 ;;
esac
source_dir='deployment/jdm-public/'
test -s "${source_dir}index.html"
test -s "${source_dir}kontakt.html"
if find "$source_dir" -type l -print -quit | grep -q .; then
  echo 'Refusing to publish a source tree containing symbolic links.' >&2
  exit 1
fi
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
# Trust the first host key, then reject changes. Never disable host-key checking.
export RSYNC_RSH='sshpass -e ssh -p 2233 -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -o ServerAliveInterval=15 -o NumberOfPasswordPrompts=1'
# No --delete: files present only on JDM are retained. Checksum comparison ignores timestamps.
# Do not preserve local file permissions; keep server permissions/defaults.
rsync --recursive --checksum --itemize-changes --human-readable \
  "${options[@]}" \
  --exclude='private-config/' \
  --exclude='.env' --exclude='.env.*' --exclude='.git/' \
  --exclude='/studio.html' \
  "$source_dir" 'smxkojwd@web15.jdm.pl:/home/smxkojwd/public_html/'
if [[ "$mode" == compare ]]; then
  echo 'Comparison complete. No server files were changed. Listed files would be uploaded by deploy.'
else
  echo 'Upload complete. No extra server files were deleted; private-config was excluded.'
fi
