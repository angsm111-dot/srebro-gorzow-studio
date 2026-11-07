# Runs ON THE HOSTING SERVER. Output contains only fixed counter names and HTTP codes.
# Never print log lines, request targets, IP addresses, referrers or user-agent strings.
function ipv4number(value, octets, n, i, result) {
    n=split(value,octets,"."); if(n!=4)return -1
    result=0
    for(i=1;i<=4;i++){if(octets[i]!~/^[0-9]+$/ || octets[i]>255)return -1;result=result*256+octets[i]}
    return result
}
BEGIN { total=0; parsed=0; bot=0; inspection=0; verifiedbot=0 }
{
    total++
    n=split($0, parts, "\"")
    if (n < 6) next
    split(parts[3], fields, " ")
    code=fields[1]
    if (code !~ /^[0-9][0-9][0-9]$/) next
    parsed++
    statuses[code]++
    if (parts[6] ~ /Googlebot/) {
        bot++; botstatuses[code]++
        split(parts[2],request," "); path=request[2]; sub(/\?.*$/,"",path)
        if(!(path in publicpaths))path="[other paths]"
        botpaths[path SUBSEP code]++
        client=-1
        for(i=1;i<=3;i++){candidate=ipv4number($i);if(candidate>=0){client=candidate;break}}
        isverified=0
        if(client>=0)for(i=1;i<=rangecount;i++)if(client>=rangefirst[i] && client<=rangelast[i]){isverified=1;break}
        if(isverified){verifiedbot++;verifiedstatuses[code]++;verifiedpaths[path SUBSEP code]++}
    }
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
    printf "},\"claimed_googlebot_public_urls\":["; separator=""
    for (key in botpaths) {split(key,pair,SUBSEP); printf "%s{\"path\":\"%s\",\"status\":%s,\"count\":%d}",separator,pair[1],pair[2],botpaths[key];separator=","}
    printf "],\"verified_googlebot_requests\":%d,\"google_ipv4_ranges_loaded\":%d,\"verified_googlebot_http_statuses\":{",verifiedbot,rangecount;separator=""
    for(code in verifiedstatuses){printf "%s\"%s\":%d",separator,code,verifiedstatuses[code];separator=","}
    printf "},\"verified_googlebot_public_urls\":[";separator=""
    for(key in verifiedpaths){split(key,pair,SUBSEP);printf "%s{\"path\":\"%s\",\"status\":%s,\"count\":%d}",separator,pair[1],pair[2],verifiedpaths[key];separator=","}
    printf "],\"privacy\":\"Only counters and pre-approved public sitemap URLs leave hosting; no IPs, unknown paths, queries or user agents. IPv6 or proxied identities remain unverified.\"}\n"
}
