# 👋 ยินดีต้อนรับสู่ Luno Project (คู่มือสำหรับเพื่อนร่วมงาน)

> เอกสารฉบับนี้จัดทำขึ้นเพื่อให้คุณสามารถเข้ามาร่วมพัฒนาและแก้ไขเนื้อหาบทเรียนได้ทันที **โดยไม่ต้องมีความรู้ด้านการเขียนโค้ดเว็บไซต์เลยครับ!**

---

## 🗂️ กฎเหล็กของโฟลเดอร์ (Folder Structure)

เพื่อให้ระบบทำงานได้ราบรื่นตลอดเวลา เราได้จัดระเบียบไฟล์ไว้เป็น 2 กลุ่มชัดเจน:

| โฟลเดอร์ | หน้าที่ | คำแนะนำสำหรับเพื่อน |
|---|---|---|
| 🟢 **`1_EDIT_CONTENT_HERE/`** | **แก้เนื้อหาทั้งหมดที่นี่** | ✅ **ทำงานในนี้ได้ 100%** (เปลี่ยนข้อความ, เปลี่ยนลิงก์วิดีโอ YouTube, แก้ข้อสอบ) |
| 🟡 **`2_BACKEND_APPS_SCRIPT/`** | เก็บโค้ดสำหรับ Google Sheet | 📄 เอาไว้ก๊อปปี้ไปวางใน Apps Script (เมื่อมีการปรับปรุงชีท) |
| 🔴 **`src/`, `node_modules/`, ไฟล์ config** | ระบบเครื่องยนต์เว็บไซต์ (Tech) | ❌ **ไม่ต้องแตะต้อง** (ระบบจัดสรรและดึงข้อมูลจากโฟลเดอร์สีเขียวให้อัตโนมัติ) |

---

## ✏️ วิธีแก้ไขเนื้อหา (ทำในโฟลเดอร์ `1_EDIT_CONTENT_HERE/`)

ในโฟลเดอร์ **`1_EDIT_CONTENT_HERE/`** มีไฟล์หลัก 3 ไฟล์ตามการใช้งาน:

### 1. `lessons_and_videos.ts` (เปลี่ยนวิดีโอและเนื้อหา 4 ด่าน)
* ต้องการเปลี่ยนคลิป YouTube: แก้ตรง `videoUrl: 'https://www.youtube.com/embed/...'`
* ต้องการแก้ชื่อด่าน หรือข้อความสรุป: แก้ข้อความในเครื่องหมายคำพูด `'...'` ได้เลย

### 2. `quizzes_and_evaluation.ts` (แก้ข้อสอบ Pre-test, Post-test และแบบประเมิน)
* มีคำถาม 4 ข้อก่อนเรียน และ 4 ข้อหลังเรียน
* แก้ตัวเลือกคำตอบ ก. ข. ค. ง. ได้อิสระ
* ตั้งเฉลยในช่อง `correctIndex` (0 = ก, 1 = ข, 2 = ค, 3 = ง)

### 3. `interactive_scenarios.ts` (แก้กิจกรรมจำลอง)
* ด่าน 1: 6 ช่องทางสื่อสารที่ให้ลากวาง
* ด่าน 2: ตัวเลขคำนวณความคุ้มค่า ROI
* ด่าน 3: เรื่องราวเคสจำลอง "ครูมาลี อายุ 56 ปี"
* ด่าน 4: คำศัพท์ตัวเลือกประกอบวิสัยทัศน์

> 💡 **ทุกครั้งที่คุณแก้ไขข้อความในโฟลเดอร์นี้ แล้วกดบันทึก หน้าเว็บจะอัปเดตข้อความใหม่ให้ทันทีแบบสดๆ ครับ!**

---

## 🔗 ลิงก์สำคัญทั้งหมดของระบบ

1. **หน้าเว็บทดสอบบนเครื่อง:**  
   👉 [http://127.0.0.1:5173/](http://127.0.0.1:5173/)
2. **Google Sheet (ฐานข้อมูลที่ข้อมูลจะวิ่งเข้าไป):**  
   👉 [https://docs.google.com/spreadsheets/d/1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk/edit](https://docs.google.com/spreadsheets/d/1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk/edit)  
   *(ดูข้อมูลผู้เข้าอบรมที่แท็บ `data1` และ `users_progress`)*
3. **Google Apps Script Editor:**  
   👉 [https://script.google.com/home/projects/17fgQia1Be4McPJWRm619IKI0ZJ2HqdUqcj_x6RQ-BEBCxSxtTpEm585t/edit](https://script.google.com/home/projects/17fgQia1Be4McPJWRm619IKI0ZJ2HqdUqcj_x6RQ-BEBCxSxtTpEm585t/edit)
4. **GitHub Repository:**  
   👉 [https://github.com/atsadatan/LUNO](https://github.com/atsadatan/LUNO)
