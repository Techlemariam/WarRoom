param(
    [int]$Days = 14
)

$BrainPath = Join-Path $env:USERPROFILE ".gemini\antigravity\brain"
$CutoffDate = (Get-Date).AddDays(-$Days)

if (-not (Test-Path $BrainPath)) {
    Write-Error "Brain directory not found at $BrainPath"
    exit 1
}

$OutputData = @()

# Get all UUID-looking directories
$Conversations = Get-ChildItem -Path $BrainPath -Directory | Where-Object { $_.Name -match "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" }

foreach ($Conv in $Conversations) {
    $TaskFile = Join-Path $Conv.FullName "task.md"
    
    if (Test-Path $TaskFile) {
        $FileItem = Get-Item $TaskFile
        if ($FileItem.LastWriteTime -lt $CutoffDate) {
            continue
        }
        $Tasks = @()
        $TaskContent = Get-Content $TaskFile -Encoding UTF8 -ErrorAction SilentlyContinue
        
        foreach ($Line in $TaskContent) {
            # Match uncompleted "[ ]" or in-progress "[/]" or "[-]"
            if ($Line -match '^\s*-\s*\[[ /-]\]\s*(.*)$') {
                $Tasks += $Matches[1].Trim()
            }
        }

        # Only include if there are actually open tasks
        if ($Tasks.Count -gt 0) {
            
            # Attempt to extract some context from overview.txt if it exists
            $OverviewFile = Join-Path $Conv.FullName ".system_generated\logs\overview.txt"
            $ProjectContext = "Unknown Project"
            
            if (Test-Path $OverviewFile) {
                # Just grabbing the first few log lines might give the LLM enough context
                # but to keep it fast, we can let the LLM do deeper context retrieval if needed.
                $ProjectContext = "Context available in overview.txt"
            }

            $OutputData += [PSCustomObject]@{
                ConversationId = $Conv.Name
                LastModified   = $Conv.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
                OpenTasksCount = $Tasks.Count
                Tasks          = $Tasks
                Context        = $ProjectContext
            }
        }
    }
}

$JsonOutput = $OutputData | ConvertTo-Json -Depth 3 -Compress
$JsonOutput
