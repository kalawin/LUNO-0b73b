# Luno E-Learning Platform — Project Specification & Architecture

> **ชื่อโปรแกรม**: โปรแกรมพัฒนาภาวะผู้นำดิจิทัลสำหรับผู้บริหารสถานศึกษาขนาดเล็ก แบบ 4 ด่านต่อเนื่อง ไม่ผูกเวลา  
> **(Digital Leadership Development Program: Luno)**  
> **บริบท**: การวิจัยและพัฒนา (R&D) ระยะที่ 3–4 การทดลองใช้และประเมินผลรูปแบบ  
> **เป้าหมาย**: ผู้บริหารสถานศึกษาขนาดเล็ก (อายุ 45–60 ปี)  

---

## 🔗 ลิงก์สำคัญของโปรเจกต์ (Important Links)

* **GitHub Repository (Private):** [https://github.com/atsadatan/LUNO](https://github.com/atsadatan/LUNO)
* **Google Apps Script Web App (API):** `https://script.google.com/macros/s/AKfycbxXzOQjibeWZCDTXHscNihZZp3e3C4Gm4EvjOJJ5LcZ_1-TCsUh9ji7HHNTbaauCMLQ/exec`
* **Google Sheet Database:** [https://docs.google.com/spreadsheets/d/1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk/edit](https://docs.google.com/spreadsheets/d/1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk/edit)
* **Google Apps Script Dashboard:** [https://script.google.com](https://script.google.com)

---

## 1. หลักการและเหตุผล (Rationale & Context)

โปรแกรมพัฒนาเชิงปฏิบัติการนี้ออกแบบโดยยึดหลัก **"ขั้นตอนน้อยที่สุด ไม่ผูกเวลา และไร้แรงเสียดทาน (Zero Friction)"** เพื่อให้ตอบโจทย์ผู้บริหารสถานศึกษาขนาดเล็กที่มีภาระงานมากและเวลาว่างไม่แน่นอน:
* **ไม่ผูกเวลา:** ไม่มีระบบนับถอยหลัง ไม่มีเงื่อนไขต้องรอข้ามวันหรือข้ามสัปดาห์
* **ยืดหยุ่นสูง:** ผู้บริหารที่มีเวลา 40 นาทีสามารถทำรวดเดียวจบ หรือจะแบ่งทำช่วงละ 10 นาทีก็ได้
* **จำจุดที่ค้างไว้เสมอ (Persistent State):** ไม่ว่าจะปิดเบราว์เซอร์ เน็ตหลุด หรือเปลี่ยนเครื่อง เมื่อเข้าสู่ระบบใหม่จะกลับมายังจุดล่าสุดทันที 100%
* **เป็นมิตรกับผู้ใช้งานวัย 45–60 ปี (Age-Friendly UI):** ตัวอักษรขนาดใหญ่ ปุ่มกดชัดเจน สีสันสบายตา ไม่ใช้เมนูซับซ้อน

---

## 2. โครงสร้างเส้นทางการเรียนรู้ (Linear Journey Flow)

```text
[ 1. เข้าสู่ระบบ / ระบุตัวตน (ข้อมูลผู้บริหาร) ]
              │
              ▼
[ 2. แบบทดสอบก่อนเรียน (Pre-test 4 ข้อ) ] ── (ทำเสร็จ -> บันทึกคะแนน) ──▶ ปลดล็อก ด่านที่ 1
              │
              ▼
[ 3. ด่านที่ 1: นักสื่อสารดิจิทัล ] ── (ดูวิดีโอ 3 ตอน / กิจกรรมจัดหมวดหมู่ 6 ช่องทาง) ──▶ ปลดล็อก ด่านที่ 2
              │
              ▼
[ 4. ด่านที่ 2: นักออกแบบการเรียนรู้ ] ── (ดูวิดีโอ 3 ตอน / คำนวณ ROI จำลอง & สถานการณ์) ──▶ ปลดล็อก ด่านที่ 3
              │
              ▼
[ 5. ด่านที่ 3: ต้นแบบทีมงาน ] ── (ดูวิดีโอ 2 ตอน / เคสจำลองครูมาลี & Buddy Coaching) ──▶ ปลดล็อก ด่านที่ 4
              │
              ▼
[ 6. ด่านที่ 4: ผู้นำค่านิยมดิจิทัล ] ── (ดูวิดีโอ 2 ตอน / ประกอบวิสัยทัศน์ & PDPA) ──▶ ปลดล็อก Post-test
              │
              ▼
[ 7. แบบทดสอบหลังเรียน (Post-test 4 ข้อ) ] ── (ทำเสร็จ -> บันทึกคะแนนเปรียบเทียบ)
              │
              ▼
[ 8. แบบประเมินรูปแบบ Luno (5 ระดับ) ] ── (ความเหมาะสม, ความเป็นไปได้, ความเป็นประโยชน์)
              │
              ▼
[ 9. สรุปผลสัมฤทธิ์ & เกียรติบัตร (Bar & Radar Charts + Printable Certificate) ]
```

---

## 3. สถาปัตยกรรมระบบ (System Architecture)

* **Front-end:**
  * **Framework:** React + Vite (Static Web App โหลดเร็ว น้ำหนักเบา)
  * **Styling:** Tailwind CSS (ออกแบบเฉพาะสำหรับหน้าจอผู้บริหาร: ฟอนต์ขนาดใหญ่ คอนทราสต์ชัดเจน)
  * **Components:** Radix UI / shadcn สไตล์เรียบหรู พร้อม Lucide Icons
  * **State & Persistence:** LocalStorage (จำจุดค้างไว้ทันที) ซิงก์ร่วมกับ Google Apps Script API
  * **Video Integration:** ฝังวิดีโอ YouTube / HTML5 ตรวจจับการเล่นจบเพื่อปลดล็อกด่าน
* **Back-end & Database:**
  * **Backend:** Google Apps Script (GAS) Web App
  * **Database:** Google Sheets (`1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk`)
  * **Protocol:** RESTful JSON / JSONP (แก้ปัญหา CORS ได้ 100%)

---

## 4. โครงสร้างฐานข้อมูล Google Sheets (Database Schema)

### Sheet 1: `users_progress` (ข้อมูลผู้บริหารและด่านล่าสุด)
| คอลัมน์ | คำอธิบาย | ตัวอย่างข้อมูล |
|---|---|---|
| `user_id` | รหัสผู้ใช้งาน / เบอร์โทร / รหัสโรงเรียน | `USR001` |
| `name` | ชื่อ-นามสกุล ผู้บริหาร | `ดร.สมศักดิ์ พัฒนาการ` |
| `school` | ชื่อสถานศึกษา | `โรงเรียนบ้านหนองบัว` |
| `current_step` | ขั้นตอนปัจจุบันที่กำลังทำอยู่ | `level-2` |
| `pre_test_status` | สถานะการทำ Pre-test | `COMPLETED` |
| `level_1_status` | สถานะ Level 1 | `COMPLETED` |
| `level_2_status` | สถานะ Level 2 | `IN_PROGRESS` |
| `level_3_status` | สถานะ Level 3 | `LOCKED` |
| `level_4_status` | สถานะ Level 4 | `LOCKED` |
| `post_test_status` | สถานะ Post-test | `LOCKED` |
| `evaluation_status`| สถานะแบบประเมินรูปแบบ | `LOCKED` |
| `last_active_at` | เวลาที่เข้าใช้งานล่าสุด | `2026-09-19T13:00:00Z` |

### Sheet 2: `quiz_scores` (คะแนนแบบทดสอบเพื่อการวิเคราะห์ทางสถิติ)
| คอลัมน์ | คำอธิบาย | ตัวอย่างข้อมูล |
|---|---|---|
| `user_id` | รหัสผู้ใช้งาน | `USR001` |
| `pre_score` | คะแนน Pre-test รวม (เต็ม 10) | `6` |
| `post_score` | คะแนน Post-test รวม (เต็ม 10) | `9` |
| `diff_score` | ผลต่างการพัฒนา (`post_score - pre_score`) | `+3` |
| `pre_q1` .. `pre_q10` | คะแนนรายข้อ Pre-test | `1, 0, 1, 1, 0, ...` |
| `post_q1` .. `post_q10`| คะแนนรายข้อ Post-test | `1, 1, 1, 1, 1, ...` |
| `completed_at` | เวลาที่ทำเสร็จสมบูรณ์ | `2026-09-19T13:40:00Z` |

### Sheet 3: `model_evaluation` (แบบประเมินรูปแบบการวิจัยตามเกณฑ์)
| คอลัมน์ | คำอธิบาย | ตัวอย่างข้อมูล |
|---|---|---|
| `user_id` | รหัสผู้ใช้งาน | `USR001` |
| `propriety_avg` | ความเหมาะสมของรูปแบบ (เฉลี่ย 5 ระดับ) | `4.80` |
| `feasibility_avg`| ความเป็นไปได้ในการนำไปใช้ (เฉลี่ย 5 ระดับ) | `4.75` |
| `utility_avg` | ความเป็นประโยชน์ต่อการบริหาร (เฉลี่ย 5 ระดับ) | `4.90` |
| `comments` | ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงเล่มวิจัย | `เนื้อหากระชับ นำไปปฏิบัติได้จริง` |
| `evaluated_at` | เวลาที่ประเมิน | `2026-09-19T13:45:00Z` |
