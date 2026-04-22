
# DuckDNS Sync Script for Brotherhood Infrastructure
# Automatically updates the IP for all 5 project domains.

$token = $env:DUCKDNS_TOKEN
if (-not $token) {
    Write-Error "DUCKDNS_TOKEN environment variable is not set."
    exit 1
}

$domains = @(
    "ironforge-rpg",
    "ligan",
    "matlogistik",
    "panopti"
)

$ip = "77.42.45.229"

foreach ($domain in $domains) {
    Write-Host "Updating ${domain}.duckdns.org to ${ip}..."
    $url = "https://www.duckdns.org/update?domains=$domain&token=$token&ip=$ip"
    try {
        $response = Invoke-RestMethod -Uri $url
        if ($response -eq "OK") {
            Write-Host "Successfully updated ${domain}." -ForegroundColor Green
        } else {
            Write-Warning "Failed to update ${domain}. Response: ${response}"
        }
    } catch {
        Write-Error "Error updating ${domain}: $($_.Exception.Message)"
    }
}
