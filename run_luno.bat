@echo off
title Luno E-Learning Platform Dev Server
echo ========================================================
echo     Starting Luno Platform (Vite + React)
echo ========================================================
echo.
set "PATH=C:\Users\Kalawin\.gemini\antigravity-ide\scratch\mingit\cmd;C:\Users\Kalawin\.gemini\antigravity-ide\scratch\nodejs22;%PATH%"
if exist "C:\Users\Kalawin\.gemini\antigravity-ide\scratch\nodejs22\node.exe" (
    start "" http://localhost:5173/
    "C:\Users\Kalawin\.gemini\antigravity-ide\scratch\nodejs22\node.exe" .\node_modules\vite\bin\vite.js --port 5173 --host
) else (
    npm run dev
)
pause
