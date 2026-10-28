#!/usr/bin/env bash
# Exercise an update in an isolated temporary directory, never in public_html.
set -euo pipefail
: "${SSHPASS:?Missing JDM password}"
ssh_command=(sshpass -e ssh -p 2233 -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -o ServerAliveInterval=15 smxkojwd@web15.jdm.pl)
export RSYNC_RSH='sshpass -e ssh -p 2233 -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -o ServerAliveInterval=15'
local_dir=$(mktemp -d)
remote_dir=''
cleanup() {
  rm -rf -- "$local_dir"
  if [[ "$remote_dir" == /tmp/jdm-transfer.* ]]; then
    "${ssh_command[@]}" "rm -rf -- '$remote_dir'" || true
  fi
}
trap cleanup EXIT
remote_dir=$("${ssh_command[@]}" 'mktemp -d /tmp/jdm-transfer.XXXXXXXX')
[[ "$remote_dir" =~ ^/tmp/jdm-transfer\.[a-zA-Z0-9]+$ ]] || exit 1
remote="smxkojwd@web15.jdm.pl:${remote_dir}/"
rsync --version | head -n 1
"${ssh_command[@]}" 'rsync --version' | head -n 1
cp deployment/jdm-public/blog.html "$local_dir/fixture.html"
rsync --whole-file --checksum --checksum-choice=md5 "$local_dir/fixture.html" "$remote"
printf '\n<!-- isolated rsync update regression test -->\n' >> "$local_dir/fixture.html"
# Diagnose the old delta path. A failure is recorded, never treated as a successful transfer.
delta_status=0
rsync --no-whole-file --checksum --checksum-choice=md5 "$local_dir/fixture.html" "$remote" || delta_status=$?
printf 'Delta update exit status: %s\n' "$delta_status"
# Exercise an actual modification with the production mode even if delta succeeded.
printf '\n<!-- whole-file update verification -->\n' >> "$local_dir/fixture.html"
rsync --whole-file --checksum --checksum-choice=md5 "$local_dir/fixture.html" "$remote"
local_hash=$(sha256sum "$local_dir/fixture.html")
remote_hash=$("${ssh_command[@]}" "sha256sum '$remote_dir/fixture.html'")
[[ "${local_hash%% *}" == "${remote_hash%% *}" ]] || { echo 'SHA-256 mismatch after whole-file update.' >&2; exit 1; }
echo 'Whole-file update verified independently by SHA-256.'
