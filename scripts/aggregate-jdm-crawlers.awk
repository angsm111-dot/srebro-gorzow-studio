# Runs ON THE HOSTING SERVER. Output contains only fixed counter names and HTTP codes.
# Never print log lines, request targets, IP addresses, referrers or user-agent strings.
BEGIN { total=0; parsed=0; bot=0; inspection=0 }
{
    total++
    n=split($0, parts, "\"")
    if (n < 6) next
    split(parts[3], fields, " ")
    code=fields[1]
    if (code !~ /^[0-9][0-9][0-9]$/) next
    parsed++
    statuses[code]++
    if (parts[6] ~ /Googlebot/) { bot++; botstatuses[code]++ }
    if (parts[6] ~ /Google-InspectionTool/) { inspection++; inspectstatuses[code]++ }
}
END {
    printf "{\"scope\":\"Server-side aggregation of access.log and four rotations\",\"total_lines\":%d,\"parsed_requests\":%d,\"claimed_googlebot_requests\":%d,\"inspection_tool_requests\":%d,",total,parsed,bot,inspection
    printf "\"all_http_statuses\":{"; separator=""
    for (code in statuses) { printf "%s\"%s\":%d",separator,code,statuses[code]; separator="," }
    printf "},\"claimed_googlebot_http_statuses\":{"; separator=""
    for (code in botstatuses) { printf "%s\"%s\":%d",separator,code,botstatuses[code]; separator="," }
    printf "},\"inspection_tool_http_statuses\":{"; separator=""
    for (code in inspectstatuses) { printf "%s\"%s\":%d",separator,code,inspectstatuses[code]; separator="," }
    printf "},\"google_identity_verified\":false,\"privacy\":\"Only aggregate counters leave the hosting server; no IPs, paths, queries or user agents. Agent claims alone do not verify Google identity.\"}\n"
}
