/**
 * ============================================================================
 * 📁 ไฟล์สำหรับแก้ไข: ข้อมูลบทเรียนและคลิปวิดีโอทั้ง 4 ด่าน (Lessons & Videos)
 * ============================================================================
 * 
 * 💡 คำแนะนำสำหรับเพื่อน:
 * - สามารถแก้ไขข้อความภาษาไทยในเครื่องหมายคำพูด '...' ได้ตามต้องการ
 * - เปลี่ยนลิงก์วิดีโอ YouTube ในช่อง videoUrl ได้ทันที (รูปแบบ https://www.youtube.com/embed/รหัสคลิป)
 * - หากต้องการปรับระยะเวลา ให้แก้ตัวเลขใน durationMinutes
 */

export interface LevelContent {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  videoUrl: string;
  description: string;
  keyTakeaways: string[];
  actionPrompt: string;
}

export const LESSONS_CONTENT: LevelContent[] = [
  {
    id: 'level-1',
    levelNumber: 1,
    title: 'ด่านที่ 1: นักสื่อสารดิจิทัล',
    subtitle: 'Digital Communicator',
    durationMinutes: 8,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ใส่ลิงก์ YouTube ที่นี่
    description: 'พัฒนาทักษะการวางแผน การบริหารช่องทางสื่อสาร และการสร้างภาพลักษณ์ที่ดีแก่โรงเรียนขนาดเล็กในยุคสารสนเทศ',
    keyTakeaways: [
      'วางแผนการสื่อสารดิจิทัล จำแนกกลุ่มเป้าหมาย (ครู ผู้ปกครอง คณะกรรมการสถานศึกษา)',
      'สร้างเครือข่ายความร่วมมือผ่าน LINE Official และ Social Media อย่างมืออาชีพ',
      'ยกระดับภาพลักษณ์สถานศึกษาด้วยการเล่าเรื่องเชิงบวก (Storytelling)'
    ],
    actionPrompt: 'จัดสรรช่องทางการสื่อสารดิจิทัลของสถานศึกษาให้ตรงตามวัตถุประสงค์การใช้งานจริง'
  },
  {
    id: 'level-2',
    levelNumber: 2,
    title: 'ด่านที่ 2: นักออกแบบการเรียนรู้',
    subtitle: 'Learning Designer',
    durationMinutes: 8,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ใส่ลิงก์ YouTube ที่นี่
    description: 'นำการเปลี่ยนแปลงด้านการจัดการเรียนรู้ดิจิทัล เลือกใช้แพลตฟอร์มอย่างคุ้มค่า และสนับสนุนครูออกแบบชั้นเรียนที่ตอบโจทย์นักเรียน',
    keyTakeaways: [
      'เกณฑ์การเลือกเครื่องมือดิจิทัลฟรีและคลังสื่อเปิด OER ที่ไม่สร้างภาระงบประมาณ',
      'การจัดสภาพแวดล้อมห้องเรียนดิจิทัล (BYOD / สลับรอบใช้) ในบริบททรัพยากรจำกัด',
      'การวัดผลด้วยเครื่องมือดิจิทัลที่ง่ายดาย ลดภาระงานเอกสารครู'
    ],
    actionPrompt: 'คำนวณและประเมินดัชนีผลตอบแทนความคุ้มค่าการเรียนรู้ดิจิทัล (Digital Learning ROI)'
  },
  {
    id: 'level-3',
    levelNumber: 3,
    title: 'ด่านที่ 3: ต้นแบบทีมงาน',
    subtitle: 'Role Model & Team Collaborator',
    durationMinutes: 6,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ใส่ลิงก์ YouTube ที่นี่
    description: 'สร้างความร่วมมือ สร้างความมั่นใจให้แก่ครูทุกวัย และเป็นแบบอย่างในการประยุกต์ใช้เทคโนโลยีด้วยความเข้าใจ (Empathy)',
    keyTakeaways: [
      'การเป็นแบบอย่างที่ดีในการใช้ดิจิทัล (Walk the Talk) ผู้นำที่กล้าเปิดใจเรียนรู้พร้อมครู',
      'การทำงานเป็นทีมและระบบพี่เลี้ยงดิจิทัล (Buddy Coaching) จับคู่ครูรุ่นใหม่กับครูอาวุโส',
      'การลดความวิตกกังวลต่อเทคโนโลยี (Tech Anxiety) ด้วยการให้เกียรติและรับฟัง'
    ],
    actionPrompt: 'ตัดสินใจจำลองสถานการณ์การให้คำปรึกษาและสนับสนุนครูผู้ใหญ่ในการปรับใช้ระบบดิจิทัล'
  },
  {
    id: 'level-4',
    levelNumber: 4,
    title: 'ด่านที่ 4: ผู้นำค่านิยมดิจิทัล',
    subtitle: 'Digital Value Leader',
    durationMinutes: 6,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ใส่ลิงก์ YouTube ที่นี่
    description: 'กำหนดวิสัยทัศน์ วางแนวปฏิบัติด้านความปลอดภัยทางไซเบอร์ จริยธรรมดิจิทัล และสร้างความยั่งยืนในสถานศึกษาขนาดเล็ก',
    keyTakeaways: [
      'การสร้างวิสัยทัศน์ดิจิทัลที่จับต้องได้และครู-ชุมชนมีส่วนร่วมขับเคลื่อน',
      'จริยธรรมดิจิทัลและการปกป้องข้อมูลส่วนบุคคลของเด็กนักเรียน (PDPA)',
      'การสร้างวัฒนธรรมความปลอดภัยไซเบอร์และการใช้เทคโนโลยีอย่างมีวิจารณญาณ'
    ],
    actionPrompt: 'สร้างแถลงการณ์วิสัยทัศน์ดิจิทัลประจำสถานศึกษา (Digital Vision Statement)'
  }
];
