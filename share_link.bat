@echo off
title Luno Public Tunnel (Share Link)
echo ========================================================
echo     Starting Luno Public Share Link (Localtunnel)
echo ========================================================
echo.
echo Make sure "run_luno.bat" is already running in another window!
echo.
set "PATH=C:\Users\Kalawin\.gemini\antigravity-ide\scratch\nodejs22;%PATH%"

echo Creating public internet tunnel for port 5173...
echo.
echo --------------------------------------------------------
echo When the URL appears below, copy and send it to others.
echo (If prompted on the first visit, enter your external IP)
echo --------------------------------------------------------
echo.

npx -y localtunnel --port 5173

pause
