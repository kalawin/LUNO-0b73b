@echo off
chcp 65001 >nul
title Luno - เปิดโฟลเดอร์ dist เพื่ออัพเดต Netlify
color 0b

echo ========================================================
echo       LUNO PLATFORM - อัพเดต NETLIFY ด้วยตนเอง
echo ========================================================
echo.
echo กำลังเปิดโฟลเดอร์ dist ในเครื่อง...
start explorer "%~dp0dist"

echo.
echo --------------------------------------------------------
echo วิธีอัพเดต Netlify ใน 10 วินาที:
echo 1. เข้าไปที่หน้าเว็บ Netlify Dashboard ของคุณ (แท็บ Deploys)
echo 2. เลื่อนลงมาที่ช่องสี่เหลี่ยมประ "Drag and drop your site output folder here"
echo 3. ลากโฟลเดอร์ "dist" ทั้งโฟลเดอร์ไปหย่อนลงในช่องนั้น
echo --------------------------------------------------------
echo.
pause
