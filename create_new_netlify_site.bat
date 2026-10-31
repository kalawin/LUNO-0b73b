@echo off
chcp 65001 >nul
title Luno - สร้าง Netlify Project ใหม่ของคุณเอง
color 0b

echo ========================================================
echo       LUNO PLATFORM - สร้าง NETLIFY PROJECT ใหม่
echo ========================================================
echo.
echo [1/3] กำลัง Build โค้ดล่าสุดให้พร้อมใช้งาน...

set "PATH=C:\Program Files\Git\cmd;C:\Users\Kalawin\.gemini\antigravity-ide\scratch\nodejs22;%PATH%"
call npm.cmd run build

if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] การ Build ไม่สำเร็จ กรุณาตรวจสอบโค้ด
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] กำลังเปิดหน้าเว็บ Netlify Drop ในบราวเซอร์...
start https://app.netlify.com/drop

echo.
echo [3/3] กำลังเปิดโฟลเดอร์ dist ให้คุณลากวาง...
explorer.exe /select,"%~dp0dist"

echo.
echo ========================================================
echo                  ขั้นตอนง่ายๆ 3 ขั้นตอน:
echo ========================================================
echo 1. ล็อกอินเข้าบัญชี Netlify ของคุณในบราวเซอร์ (ถ้ายังไม่ได้ล็อกอิน)
echo 2. ลากโฟลเดอร์ "dist" ที่เลือกไว้ในหน้าต่างไฟล์ ไปปล่อยในกรอบสี่เหลี่ยม
echo    "Drag and drop your site output folder here" บนหน้าเว็บ Netlify Drop
echo 3. เว็บไซต์ใหม่ของคุณจะออนไลน์ทันที! คุณจะได้ลิงก์เฉพาะของคุณเอง
echo    (สามารถไปที่ Site configuration > Change site name เพื่อตั้งชื่อเว็บตามต้องการได้)
echo ========================================================
echo.
pause
