@echo off
chcp 65001 >nul
title Luno Platform - สร้างลิงก์แชร์ออนไลน์ (Public Share Link)
color 0b

echo ========================================================
echo     LUNO PLATFORM - สร้างลิงก์สาธารณะส่งให้ผู้อื่นดู
echo ========================================================
echo.

set "PATH=C:\Program Files\Git\cmd;C:\Users\Kalawin\.gemini\antigravity-ide\scratch\nodejs22;%PATH%"

echo [1/2] กำลังตรวจสอบเซิร์ฟเวอร์ Luno ในเครื่อง...
netstat -ano | findstr :5173 >nul
if %errorlevel% neq 0 (
    echo กำลังเปิดเซิร์ฟเวอร์ Luno (Vite Dev Server)...
    start "Luno Server" /min cmd /c "cd /d "%~dp0" && set "PATH=C:\Users\Kalawin\.gemini\antigravity-ide\scratch\nodejs22;%PATH%" && "C:\Users\Kalawin\.gemini\antigravity-ide\scratch\nodejs22\node.exe" .\node_modules\vite\bin\vite.js --port 5173 --host"
    timeout /t 3 >nul
) else (
    echo เซิร์ฟเวอร์ Luno กำลังทำงานอยู่แล้วที่ Port 5173
)

echo.
echo [2/2] กำลังเชื่อมต่อเครือข่ายอินเทอร์เน็ตเพื่อสร้างลิงก์ HTTPS สาธารณะ...
echo ----------------------------------------------------------------------
echo เมื่อมีลิงก์ขึ้นมา (เช่น https://xxxx.loca.lt) สามารถคัดลอกส่งให้ผู้อื่นได้เลยครับ
echo *หมายเหตุ: หากหน้าเว็บถามหารหัสผ่าน ให้ใส่ IP ภายนอกของคุณ (สามารถดูได้ที่ https://loca.lt/mytunnelpassword)
echo ----------------------------------------------------------------------
echo.

call npx.cmd -y localtunnel --port 5173

pause
