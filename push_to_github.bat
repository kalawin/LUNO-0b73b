@echo off
chcp 65001 >nul
title Luno Platform - Push to GitHub
color 0b

echo ========================================================
echo       LUNO PLATFORM - GITHUB SYNC ^& PUSH
echo ========================================================
echo.
echo กำลังเตรียมการอัพโหลดโค้ดล่าสุดขึ้น GitHub (main branch)...
echo.

set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\mingw64\bin;C:\Users\Kalawin\.gemini\antigravity-ide\scratch\mingit\cmd;%PATH%"

echo ตรวจสอบสถานะ Git Remote...
git remote -v
echo.

echo --------------------------------------------------------
echo หมายเหตุ: หากมีหน้าต่างเบราว์เซอร์เด้งขึ้นมา ให้กด "Sign in with your browser"
echo และคลิกยืนยัน Authorize Git Credential Manager ได้เลยครับ
echo --------------------------------------------------------
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    color 0a
    echo ========================================================
    echo      [SUCCESS] อัพเดตข้อมูลขึ้น GitHub เรียบร้อยแล้ว!
    echo ========================================================
) else (
    echo.
    color 0c
    echo ========================================================
    echo      [ERROR] ไม่สามารถ Push ได้ กรุณาตรวจสอบข้อความด้านบน
    echo ========================================================
)

echo.
pause
