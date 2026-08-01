<#
.SYNOPSIS
Veritas Protocol CLI Mock

.DESCRIPTION
A mock CLI tool for developers to interact with the Veritas Protocol edge proxy and control plane.
#>

param (
    [string]$Command = "help"
)

$VeritasAscii = @"
__     __        _ _               ____           _                  _ 
\ \   / /__ _ __(_) |_ __ _ ___   |  _ \ _ __ ___| |_ ___   ___ ___ | |
 \ \ / / _ \ '__| | __/ _` / __|  | |_) | '__/ _ \ __/ _ \ / __/ _ \| |
  \ V /  __/ |  | | || (_| \__ \  |  __/| | | (_) | || (_) | (_| (_) | |
   \_/ \___|_|  |_|\__\__,_|___/  |_|   |_|  \___/ \__\___/ \___\___/|_|
"@

function Show-Help {
    Write-Host $VeritasAscii -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Veritas Protocol CLI (v1.0.0)"
    Write-Host "Usage: .\veritas.ps1 <command>"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  start    - Starts the Veritas Control Plane and Proxy via Docker Compose"
    Write-Host "  stop     - Stops the Veritas Docker containers"
    Write-Host "  status   - Checks the health of the Edge Proxy"
    Write-Host "  logs     - Tails the WORM Ledger logs"
    Write-Host ""
}

switch ($Command.ToLower()) {
    "start" {
        Write-Host "Starting Veritas Protocol..." -ForegroundColor Green
        docker-compose up -d --build
        Write-Host "Control Plane running at http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Edge Proxy running at http://localhost:8000" -ForegroundColor Cyan
    }
    "stop" {
        Write-Host "Stopping Veritas Protocol..." -ForegroundColor Yellow
        docker-compose down
    }
    "status" {
        Write-Host "Checking Edge Proxy Status..."
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
            if ($response.status -eq "Veritas Enclave Active") {
                Write-Host "[OK] Proxy is HEALTHY and actively intercepting traffic." -ForegroundColor Green
            } else {
                Write-Host "[WARN] Proxy returned unexpected status." -ForegroundColor Yellow
            }
        } catch {
            Write-Host "[ERROR] Proxy is unreachable. Is it running?" -ForegroundColor Red
        }
    }
    "logs" {
        Write-Host "Tailing cryptographic ledger..." -ForegroundColor Cyan
        docker-compose logs -f veritas-proxy
    }
    default {
        Show-Help
    }
}
