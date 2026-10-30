# 🎓 Luno — Digital Leadership Development Platform

> **โปรแกรมพัฒนาภาวะผู้นำดิจิทัลสำหรับผู้บริหารสถานศึกษาขนาดเล็ก แบบ 4 ด่านต่อเนื่อง ไม่ผูกเวลา**  
> *(Digital Leadership Development Program: Luno — งานวิจัยและพัฒนาทางการศึกษา ระยะที่ 3–4)*

---

## 🔗 สารบัญลิงก์สำคัญของโปรเจกต์ (Important Links)

| รายการ | ลิงก์ (URL) | หมายเหตุ |
|---|---|---|
| 🐙 **GitHub Repository** | [https://github.com/atsadatan/LUNO](https://github.com/atsadatan/LUNO) | คลังโค้ดหลักของโปรเจกต์ (Private) |
| 🌐 **Apps Script Web App (API)** | `https://script.google.com/macros/s/AKfycbxFx_OGc4YO8XFu-KVh0toM4Lse0pwcCttTeEXTwc3XbF11DljJ8NrbqHiDZxo3KxUM/exec` | Endpoint เชื่อมต่อรับ-ส่งข้อมูลกับ Google Sheets |
| 📊 **Google Sheet Database** | [คลิกเปิด Google Sheet ของโปรเจกต์](https://docs.google.com/spreadsheets/d/1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk/edit) | ชีทเก็บผลคะแนนและข้อมูลงานวิจัย 3 แท็บ |
| ⚙️ **Google Apps Script Editor** | [https://script.google.com/home/projects/17fgQia1Be4McPJWRm619IKI0ZJ2HqdUqcj_x6RQ-BEBCxSxtTpEm585t/edit](https://script.google.com/home/projects/17fgQia1Be4McPJWRm619IKI0ZJ2HqdUqcj_x6RQ-BEBCxSxtTpEm585t/edit) | พื้นที่แก้ไขโค้ด backend ของสคริปต์ (เปิดโปรเจกต์โดยตรง) |
| 💻 **Local Development** | [http://127.0.0.1:5173/](http://127.0.0.1:5173/) | หน้าเว็บทดสอบบนเครื่อง Local |
| 🔍 **UI Diagnosis Report** | [docs/UI_DIAGNOSIS.md](file:///Users/macbook/Desktop/Luno/docs/UI_DIAGNOSIS.md) | รายงานตรวจวินิจฉัยปัญหา UI และแผนปรับปรุง |
| 💡 **UI Prompt Guide** | [docs/PROMPT_GUIDE_FOR_UI.md](file:///Users/macbook/Desktop/Luno/docs/PROMPT_GUIDE_FOR_UI.md) | ชุด Prompt สำเร็จรูปสำหรับสั่ง AI ปรับแต่ง UI |

---

## 🧭 ลำดับขั้นตอนการเรียนรู้ 4 ด่านต่อเนื่อง (Linear Flow)

```text
[ 1. ลงทะเบียนเข้าสู่ระบบ ]
              │
              ▼
[ 2. แบบทดสอบก่อนเรียน (Pre-test 10 ข้อ) ] ──▶ ปลดล็อก ด่านที่ 1 ทันที
              │
              ▼
[ 3. ด่านที่ 1: ภาวะผู้นำการเปลี่ยนแปลงเชิงดิจิทัล ] (10 นาที) ──▶ ปลดล็อก ด่านที่ 2
              │
              ▼
[ 4. ด่านที่ 2: การบริหารจัดการเทคโนโลยีและทรัพยากรดิจิทัล ] (10 นาที) ──▶ ปลดล็อก ด่านที่ 3
              │
              ▼
[ 5. ด่านที่ 3: การสร้างวัฒนธรรมและนวัตกรรมการเรียนรู้ดิจิทัล ] (10 นาที) ──▶ ปลดล็อก ด่านที่ 4
              │
              ▼
[ 6. ด่านที่ 4: ธรรมาภิบาล ความมั่นคงปลอดภัย และจริยธรรมดิจิทัล ] (10 นาที) ──▶ ปลดล็อก Post-test
              │
              ▼
[ 7. แบบทดสอบหลังเรียน (Post-test 10 ข้อ) ] ──▶ วัดผลสัมฤทธิ์และพัฒนาการ (+/-)
              │
              ▼
[ 8. แบบประเมินรูปแบบการวิจัย (15 ข้อ 5 ระดับ) ] ──▶ ประเมินความเหมาะสม, เป็นไปได้, เป็นประโยชน์
              │
              ▼
[ 9. สรุปผลสำเร็จและรับเกียรติบัตร (Certificate) ] ──▶ สั่งพิมพ์หรือเซฟเป็น PDF ได้ทันที
```

---

## 🗄️ โครงสร้างฐานข้อมูลใน Google Sheets (3 แท็บ)

1. **`users_progress`**:
   * เก็บข้อมูลผู้บริหาร: `user_id`, `name`, `school`, `current_step`, สถานะการผ่านแต่ละด่าน และ `last_active_at`
   * หน้าเว็บใช้อ่านค่าเพื่อดึงจุดที่ค้างไว้ให้ผู้บริหารกลับมาทำต่อได้ทันที (Auto-resume)
2. **`quiz_scores`**:
   * เก็บผลคะแนน: `user_id`, `name`, `pre_score`, `post_score`, `diff_score` (ผลต่างคะแนน) และคำตอบรายข้อ
   * พร้อมนำคอลัมน์ `pre_score` และ `post_score` ไปรันสถิติวิจัย **t-test Dependent** ได้ทันที
3. **`model_evaluation`**:
   * เก็บผลการประเมินรูปแบบตามเกณฑ์มาตรฐาน:
     * `propriety_avg` (ด้านความเหมาะสม)
     * `feasibility_avg` (ด้านความเป็นไปได้)
     * `utility_avg` (ด้านความเป็นประโยชน์)
     * `total_avg` (เฉลี่ยรวมทุกด้าน)
     * `comments` (ข้อเสนอแนะเชิงคุณภาพเพื่อปรับปรุงเล่มวิจัย)

---

## 🛠️ วิธีการติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. รัน Local Development Server
npm run dev

# 3. Build ตรวจสอบความถูกต้องของโค้ด
npm run build
```

---

## ✏️ คู่มือการปรับปรุงเนื้อหาและข้อสอบ (สำหรับทีมงาน)

ไฟล์ข้อมูลทั้งหมดถูกแยกออกจากส่วนแสดงผลเพื่อให้แก้ไขได้ง่าย ไม่ต้องเขียนโค้ด:
* **แก้ไขข้อความ / วิดีโอ / ข้อสอบ 10 ข้อ:** เข้าไปแก้ที่ไฟล์ [`src/data/courseData.ts`](src/data/courseData.ts)
* **แก้ไขโค้ด Backend Google Apps Script:** เข้าไปดูที่ไฟล์ [`backend/Code.gs`](backend/Code.gs)
* **อ่านเอกสารสเปกงานวิจัยฉบับเต็ม:** อ่านได้ที่ [`docs/LUNO_SPEC.md`](docs/LUNO_SPEC.md)

---

### จัดทำขึ้นเพื่อ:
งานวิจัยและพัฒนา (R&D) การพัฒนาภาวะผู้นำดิจิทัลของผู้บริหารสถานศึกษาขนาดเล็ก ระยะที่ 3–4
