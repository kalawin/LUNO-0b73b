/**
 * ============================================================================
 * 🧠 ระบบตรวจประเมินแบบฝึกหัดอัตโนมัติ (Automated Rubric Evaluation Engine)
 * ============================================================================
 * ทำหน้าที่ตรวจสอบเนื้อหาที่ผู้บริหารกรอกใน Step 4 เทียบกับเกณฑ์รูบริกของแต่ละหน่วย
 * คำนวณคะแนนอัตโนมัติ (เต็ม 10 คะแนน) พร้อมให้คำแนะนำเชิงพัฒนา (Formative Feedback)
 * เกณฑ์การผ่าน: ต้องได้คะแนนรวม >= 7/10 คะแนน (70%)
 */

export interface CriterionFeedback {
  criterionId: string;
  title: string;
  score: number;
  maxScore: number;
  status: 'high' | 'medium' | 'low';
  comment: string;
  suggestion?: string;
}

export interface UnitEvaluationResult {
  unitId: string;
  scores: Record<string, number>;
  totalScore: number;
  maxPossible: number;
  isPassed: boolean;
  feedbacks: CriterionFeedback[];
}

export class EvaluatorEngine {
  /**
   * ฟังก์ชันหลักสำหรับประเมินผลงานของแต่ละหน่วย
   */
  static evaluate(unitId: string, formData: Record<string, any>): UnitEvaluationResult {
    switch (unitId) {
      case '1.1':
        return this.eval1_1(formData);
      case '1.2':
        return this.eval1_2(formData);
      case '1.3':
        return this.eval1_3(formData);
      case '2.1':
        return this.eval2_1(formData);
      case '2.2':
        return this.eval2_2(formData);
      case '2.3':
        return this.eval2_3(formData);
      case '3.1':
        return this.eval3_1(formData);
      case '3.2':
        return this.eval3_2(formData);
      case '4.1':
        return this.eval4_1(formData);
      case '4.2':
        return this.eval4_2(formData);
      default:
        return this.fallbackEval(unitId, formData);
    }
  }

  // --------------------------------------------------------------------------
  // หน่วย 1.1: การวางแผนในการสื่อสาร 4 ช่อง (เป้าหมาย, ผู้รับสาร, ข้อความ, ช่องทาง)
  // เกณฑ์: r1_goal (3), r1_channel (4), r1_feasibility (3)
  // --------------------------------------------------------------------------
  private static eval1_1(data: Record<string, any>): UnitEvaluationResult {
    const goal = (data['เป้าหมาย'] || '').trim();
    const mainAud = (data['ผู้รับสารหลัก'] || '').trim();
    const subAud = (data['ผู้รับสารรอง'] || '').trim();
    const msg = (data['ข้อความหลัก'] || '').trim();
    const channels = (data['ช่องทางและเหตุผล'] || '').trim();

    // 1. ตรวจเป้าหมายและข้อความหลัก (เต็ม 3)
    let s1 = 1;
    let c1 = 'เป้าหมายสั้นเกินไปหรือไม่ชัดเจน';
    let sug1: string | undefined = 'ระบุให้ชัดเจนว่า ต้องการให้ [ใคร] [ทำอะไร] ภายใน [เวลาใด]';
    const hasTimeOrUrgency = /(เวลา|ก่อน|ภายใน|ด่วน|วัน|เช้า|โมง|0[0-9]|1[0-9]|2[0-9])/i.test(goal + msg);
    const hasWho = /(ผู้ปกครอง|ครู|นักเรียน|ชุมชน|ทุกคน)/i.test(goal + mainAud);
    
    if (goal.length >= 15 && msg.length >= 25 && hasWho) {
      if (hasTimeOrUrgency && msg.length <= 220) {
        s1 = 3;
        c1 = 'เป้าหมายระบุกลุ่มเป้าหมายและการกระทำชัดเจน ข้อความหลักกระชับ เข้าใจง่ายและนำไปปฏิบัติได้ทันที';
        sug1 = undefined;
      } else {
        s1 = 2;
        c1 = 'เป้าหมายชัดเจนดี แต่ข้อความหลักอาจยาวเกินไป หรือยังไม่ระบุกรอบเวลาที่ชัดเจน';
        sug1 = 'ระบุเวลาเดดไลน์ที่ผู้ปกครองต้องปฏิบัติตามให้ชัดเจนยิ่งขึ้น';
      }
    }

    // 2. ตรวจความเหมาะสมของช่องทางกับผู้รับสาร (เต็ม 4)
    let s2 = 1;
    let c2 = 'ระบุช่องทางน้อยเกินไปหรือไม่ครอบคลุมกลุ่มเป้าหมาย';
    let sug2: string | undefined = 'ควรมีทั้งช่องทางออนไลน์ด่วน (เช่น LINE) และช่องทางชุมชน/ออฟไลน์ (เช่น หอกระจายข่าว/ป้าย)';
    const hasOnline = /(line|ไลน์|facebook|เฟซ|เพจ|sms|แอป|เว็บไซต์|อินเทอร์เน็ต)/i.test(channels);
    const hasCommunity = /(หอ|กระจายข่าว|ผู้ใหญ่บ้าน|กำนัน|ป้าย|จดหมาย|โทร|อบต|ปากต่อปาก|เพื่อนบ้าน)/i.test(channels);
    
    if (hasOnline && hasCommunity && channels.length >= 30) {
      s2 = 4;
      c2 = 'ยอดเยี่ยม! ผสมผสานทั้งช่องทางดิจิทัลที่รวดเร็ว และช่องทางชุมชนสำหรับครอบครัวที่เข้าไม่ถึงอินเทอร์เน็ต';
      sug2 = undefined;
    } else if (hasOnline || hasCommunity) {
      s2 = 2;
      c2 = 'เลือกช่องทางได้ดีแต่พึ่งพาช่องทางดิจิทัลหรือชุมชนเพียงด้านเดียว อาจตกหล่นผู้รับสารบางกลุ่ม';
      sug2 = 'เพิ่มช่องทางสำรองสำหรับกลุ่มที่ไม่มีสมาร์ทโฟน เช่น ประสานผู้ใหญ่บ้านหรือหอกระจายข่าว';
    }

    // 3. ความเป็นไปได้ในการปฏิบัติจริง (เต็ม 3)
    let s3 = 1;
    let c3 = 'เหตุผลประกอบช่องทางยังสั้นเกินไป';
    let sug3: string | undefined = 'อธิบายเหตุผลเพิ่มเติมว่าช่องทางที่เลือกจะช่วยให้ข้อมูลส่งถึงทันสถานการณ์ได้อย่างไร';
    if (channels.length >= 40 && (mainAud.length >= 10 || subAud.length >= 10)) {
      s3 = 3;
      c3 = 'สอดคล้องกับบริบทโรงเรียนขนาดเล็ก ปฏิบัติได้ทันท่วงที ทรัพยากรที่มีอยู่รองรับได้จริง';
      sug3 = undefined;
    } else if (channels.length >= 20) {
      s3 = 2;
      c3 = 'ปฏิบัติได้จริง แต่อาจต้องใช้เวลาประสานงานเพิ่มเติม';
      sug3 = 'เขียนอธิบายบทบาทของผู้รับสารรองให้ชัดเจนขึ้น';
    }

    return this.buildResult('1.1', [
      { id: 'r1_goal', title: 'ความชัดเจนของเป้าหมายและข้อความหลัก', score: s1, max: 3, comment: c1, sug: sug1 },
      { id: 'r1_channel', title: 'ความเหมาะสมของช่องทางกับผู้รับสาร', score: s2, max: 4, comment: c2, sug: sug2 },
      { id: 'r1_feasibility', title: 'ความเป็นไปได้ในการปฏิบัติจริง', score: s3, max: 3, comment: c3, sug: sug3 }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 1.2: การสร้างเครือข่ายพันธมิตร 4 ทิศทาง
  // เกณฑ์: r2_network (3), r2_twoway (4), r2_impact (3)
  // --------------------------------------------------------------------------
  private static eval1_2(data: Record<string, any>): UnitEvaluationResult {
    const internal = (data['เครือข่ายภายในโรงเรียน'] || '').trim();
    const parents = (data['เครือข่ายผู้ปกครอง'] || '').trim();
    const community = (data['เครือข่ายชุมชนและท้องถิ่น'] || '').trim();
    const external = (data['เครือข่ายภายนอก'] || '').trim();
    const inquiry = (data['ข้อกังวลจากพันธมิตร'] || '').trim();
    const response = (data['ข้อความตอบกลับของผู้บริหาร'] || '').trim();

    // 1. เครือข่าย 4 ทิศทาง (เต็ม 3)
    let s1 = 1;
    let filledCount = [internal, parents, community, external].filter(t => t.length >= 8).length;
    if (filledCount >= 4) s1 = 3;
    else if (filledCount >= 2) s1 = 2;

    const c1 = s1 === 3
      ? 'ระบุพันธมิตรและช่องทางดิจิทัลครบทั้ง 4 ทิศทาง สอดคล้องกับบริบทจริงของโรงเรียนขนาดเล็ก'
      : 'ยังระบุกลุ่มพันธมิตรไม่ครบทั้ง 4 ทิศทาง';
    const sug1 = s1 < 3 ? 'เติมข้อมูลเครือข่ายให้ครบทั้งภายใน, ผู้ปกครอง, ชุมชน และภายนอก' : undefined;

    // 2. การสื่อสารสองทาง (เต็ม 4)
    let s2 = 1;
    const isPolite = /(ครับ|ค่ะ|ขอขอบคุณ|ยินดี|เคารพ|ขอเรียน|ชี้แจง)/i.test(response);
    const isSolutionOriented = /(แผน|พัฒนา|ร่วมมือ|เชิญ|พร้อม|ปรับปรุง|แก้ไข|หารือ)/i.test(response);
    
    if (response.length >= 40 && isPolite && isSolutionOriented) {
      s2 = 4;
    } else if (response.length >= 20) {
      s2 = 2;
    }

    const c2 = s2 === 4
      ? 'ตอบสนองด้วยน้ำเสียงที่สุภาพ ให้เกียรติ ชี้แจงข้อเท็จจริง และเปิดโอกาสให้ร่วมมือแก้ปัญหา'
      : 'ข้อความตอบกลับยังสั้นเกินไป หรือเป็นเพียงการปฏิเสธ/ชี้แจงฝ่ายเดียว';
    const sug2 = s2 < 4 ? 'เขียนตอบกลับโดยขอบคุณในความห่วงใย พร้อมอธิบายข้อเท็จจริงและเชิญชวนร่วมพูดคุย' : undefined;

    // 3. ผลลัพธ์ต่อการพัฒนาโรงเรียน (เต็ม 3)
    let s3 = (inquiry.length >= 15 && response.length >= 35) ? 3 : 2;
    const c3 = s3 === 3 ? 'สร้างความเข้าใจอันดีและรักษาความร่วมมือที่ยั่งยืน' : 'ควรแสดงแนวทางการมีส่วนร่วมของชุมชนให้เป็นรูปธรรมยิ่งขึ้น';

    return this.buildResult('1.2', [
      { id: 'r2_network', title: 'ความครอบคลุมของเครือข่ายพันธมิตร 4 ทิศทาง', score: s1, max: 3, comment: c1, sug: sug1 },
      { id: 'r2_twoway', title: 'คุณภาพของการสื่อสารสองทาง (Two-Way Communication)', score: s2, max: 4, comment: c2, sug: sug2 },
      { id: 'r2_impact', title: 'การนำไปใช้ประโยชน์เพื่อพัฒนาโรงเรียน', score: s3, max: 3, comment: c3 }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 1.3: ภาพลักษณ์ สื่อปลอดภัย และ PDPA
  // เกณฑ์: r3_pdpa (4), r3_story (3), r3_consent (3)
  // --------------------------------------------------------------------------
  private static eval1_3(data: Record<string, any>): UnitEvaluationResult {
    const checks = [
      data['ตรวจ_ไม่ระบุเลขบัตรประชาชน_ที่อยู่'],
      data['ตรวจ_เบลอชื่อเด็กหรือใช้ชื่อเล่น'],
      data['ตรวจ_มีหนังสือยินยอมจากผู้ปกครอง'],
      data['ตรวจ_ใช้ภาพถ่ายโรงเรียนหรือภาพฟรีลิขสิทธิ์'],
      data['ตรวจ_มีข้อความคุ้มครองข้อมูลส่วนบุคคล']
    ];
    const checkedCount = checks.filter(Boolean).length;
    const title = (data['หัวข้อประชาสัมพันธ์'] || '').trim();
    const highlight = (data['จุดเด่นที่ต้องการสื่อสาร'] || '').trim();
    const consent = (data['ข้อความขอความยินยอม'] || '').trim();

    let s1 = checkedCount === 5 ? 4 : checkedCount >= 3 ? 2 : 1;
    let s2 = (title.length >= 10 && highlight.length >= 25) ? 3 : 2;
    
    const hasConsentKeyword = /(ยินยอม|อนุญาต|pdpa|คุ้มครองข้อมูล|พระราชบัญญัติ)/i.test(consent);
    let s3 = (consent.length >= 25 && hasConsentKeyword) ? 3 : consent.length >= 15 ? 2 : 1;

    return this.buildResult('1.3', [
      { 
        id: 'r3_pdpa', 
        title: 'ความถูกต้องตามมาตรฐาน PDPA และลิขสิทธิ์', 
        score: s1, 
        max: 4, 
        comment: s1 === 4 ? 'ตรวจสอบครบถ้วนทุกข้อกำหนดความปลอดภัยของข้อมูลนักเรียน' : `ติ๊กตรวจสอบไป ${checkedCount}/5 ข้อ ควรตรวจสอบให้ครบทุกข้อ`,
        sug: s1 < 4 ? 'ติ๊กตรวจสอบความปลอดภัยข้อมูลและลิขสิทธิ์ภาพถ่ายให้ครบทั้ง 5 ข้อ' : undefined
      },
      { 
        id: 'r3_story', 
        title: 'การสื่อสารภาพลักษณ์เชิงบวก (Positive Storytelling)', 
        score: s2, 
        max: 3, 
        comment: s2 === 3 ? 'หัวข้อและจุดเด่นน่าสนใจ สะท้อนคุณค่าความอบอุ่นของโรงเรียนขนาดเล็ก' : 'ควรขยายความจุดเด่นของโรงเรียนให้เห็นภาพชัดเจนขึ้น' 
      },
      { 
        id: 'r3_consent', 
        title: 'ความสมบูรณ์ของแบบขอความยินยอม (Consent Note)', 
        score: s3, 
        max: 3, 
        comment: s3 === 3 ? 'ถ้อยคำขอความยินยอมชัดเจน ระบุวัตถุประสงค์และอิงกฎหมาย PDPA ถูกต้อง' : 'ข้อความขอความยินยอมยังสั้นหรือขาดการระบุเรื่อง PDPA',
        sug: s3 < 3 ? 'ระบุว่าได้รับความยินยอมจากผู้ปกครองตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562' : undefined
      }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 2.1: การโค้ชครู 3 ครั้ง (ชวนคุย -> ร่วมทำ -> ชื่นชม)
  // --------------------------------------------------------------------------
  private static eval2_1(data: Record<string, any>): UnitEvaluationResult {
    const teacher = (data['ครูเป้าหมายและปัญหา'] || '').trim();
    const tool = (data['เครื่องมือดิจิทัลที่เลือก'] || '').trim();
    const s1Text = (data['โค้ชครั้งที่1_ชวนคุยสาธิต'] || '').trim();
    const s2Text = (data['โค้ชครั้งที่2_ร่วมออกแบบ'] || '').trim();
    const s3Text = (data['โค้ชครั้งที่3_สังเกตชื่นชม'] || '').trim();
    const support = (data['การหนุนเสริมของผู้บริหาร'] || '').trim();

    // มิติ 1: การจำแนกปัญหาและเลือกเครื่องมือ (3)
    let sc1 = (teacher.length >= 20 && tool.length >= 10) ? 3 : (teacher.length >= 10) ? 2 : 1;
    // มิติ 2: กระบวนการโค้ช 3 ครั้ง (4)
    const valid3Steps = s1Text.length >= 20 && s2Text.length >= 20 && s3Text.length >= 20;
    let sc2 = valid3Steps ? 4 : (s1Text.length >= 10 && s2Text.length >= 10) ? 2 : 1;
    // มิติ 3: การหนุนเสริมเชิงบริหาร (3)
    let sc3 = support.length >= 20 ? 3 : 2;

    return this.buildResult('2.1', [
      { id: 'r21_need', title: 'การวิเคราะห์ปัญหาครูและการเลือกเครื่องมือ', score: sc1, max: 3, comment: sc1 === 3 ? 'ระบุครูเป้าหมาย ปัญหา และเครื่องมือดิจิทัลที่สอดคล้องกับปัญหาได้ดี' : 'ควรระบุปัญหาของครูให้ชัดเจนขึ้น' },
      { id: 'r21_steps', title: 'ลำดับขั้นตอนการโค้ช 3 ครั้ง (ชวนคุย-ร่วมทำ-ชื่นชม)', score: sc2, max: 4, comment: sc2 === 4 ? 'วางแผนการโค้ชครบ 3 ขั้นอย่างเข้าอกเข้าใจ (Empathy) และไม่กดดัน' : 'กรุณาเขียนรายละเอียดการโค้ชให้ครบทั้ง 3 ครั้ง', sug: sc2 < 4 ? 'เขียนแผนการโค้ชให้ครบทั้งครั้งที่ 1 (สาธิต), ครั้งที่ 2 (ร่วมทำ), และครั้งที่ 3 (ชื่นชม)' : undefined },
      { id: 'r21_support', title: 'การสนับสนุนเชิงระบบของผู้บริหาร', score: sc3, max: 3, comment: sc3 === 3 ? 'มีมาตรการหนุนเสริมด้านเวลา อุปกรณ์ หรือการให้กำลังใจที่ชัดเจน' : 'ควรระบุการสนับสนุนของผู้บริหารเพิ่มเติม เช่น เวลา หรืออุปกรณ์' }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 2.2: สภาพแวดล้อมดิจิทัล & Quick Wins
  // --------------------------------------------------------------------------
  private static eval2_2(data: Record<string, any>): UnitEvaluationResult {
    const q1 = (data['QuickWin_1'] || '').trim();
    const q2 = (data['QuickWin_2'] || '').trim();
    const q3 = (data['QuickWin_3'] || '').trim();

    let sc1 = 3; // การประเมินสถานะ
    let sc2 = (q1.length >= 15 && q2.length >= 15 && q3.length >= 15) ? 4 : (q1.length >= 10 && q2.length >= 10) ? 2 : 1;
    let sc3 = (q1 + q2 + q3).length >= 60 ? 3 : 2;

    return this.buildResult('2.2', [
      { id: 'r22_eval', title: 'การประเมินสภาพแวดล้อมดิจิทัลรอบด้าน', score: sc1, max: 3, comment: 'ประเมินสภาพการณ์ทั้งฮาร์ดแวร์ เครือข่าย และแหล่งเรียนรู้ครบถ้วน' },
      { id: 'r22_quickwin', title: 'ความคุ้มค่าและเป็นไปได้ของ Quick Wins 3 ข้อ', score: sc2, max: 4, comment: sc2 === 4 ? 'Quick Wins ทั้ง 3 ข้อทำได้จริง รวดเร็ว และใช้งบประมาณอย่างคุ้มค่า' : 'ควรเขียน Quick Wins ให้ครบทั้ง 3 ข้อพร้อมระบุการลงมือทำจริง', sug: sc2 < 4 ? 'ระบุ Quick Wins ให้ครบ 3 ข้อที่ทำได้ทันทีโดยไม่ต้องรองบประมาณใหญ่' : undefined },
      { id: 'r22_impact', title: 'ผลกระทบต่อคุณภาพการเรียนรู้', score: sc3, max: 3, comment: 'ช่วยแก้ปัญหาคอขวดและเพิ่มโอกาสการเรียนรู้ของนักเรียน' }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 2.3: การใช้ข้อมูลตัดสินใจ (Data-Driven Decision)
  // --------------------------------------------------------------------------
  private static eval2_3(data: Record<string, any>): UnitEvaluationResult {
    const topic = (data['หัวข้อแบบสำรวจดิจิทัล'] || '').trim();
    const questions = (data['รายการข้อคำถาม'] || '').trim();
    const decision = (data['การตัดสินใจเชิงบริหารจากข้อมูล'] || '').trim();

    let sc1 = topic.length >= 15 ? 3 : 2;
    let sc2 = questions.length >= 35 ? 4 : questions.length >= 15 ? 2 : 1;
    let sc3 = decision.length >= 25 ? 3 : 2;

    return this.buildResult('2.3', [
      { id: 'r23_topic', title: 'ความตรงประเด็นของแบบสำรวจข้อมูล', score: sc1, max: 3, comment: 'หัวข้อสอดคล้องกับปัญหาและความต้องการพัฒนาของโรงเรียน' },
      { id: 'r23_questions', title: 'คุณภาพและโครงสร้างของชุดคำถาม', score: sc2, max: 4, comment: sc2 === 4 ? 'คำถามครอบคลุมทั้งเชิงปริมาณและข้อเสนอแนะ ตอบได้สะดวกรวดเร็ว' : 'ข้อคำถามยังสั้นเกินไป ควรมีอย่างน้อย 3-4 ข้อคำถาม', sug: sc2 < 4 ? 'ร่างข้อคำถามให้ครบทั้งมาตรวัดคะแนนและข้อเสนอแนะปลายเปิด' : undefined },
      { id: 'r23_decision', title: 'การแปลงข้อมูลสู่การตัดสินใจเชิงบริหาร', score: sc3, max: 3, comment: sc3 === 3 ? 'ระบุแผนปฏิบัติการต่อเนื่องเมื่อทราบผลข้อมูลชัดเจน' : 'ควรอธิบายเพิ่มเติมว่าเมื่อได้ผลสำรวจมาแล้ว ผู้บริหารจะนำไปปรับปรุงเรื่องใด' }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 3.1: Micro-journal ผู้นำต้นแบบ 1 วัน
  // --------------------------------------------------------------------------
  private static eval3_1(data: Record<string, any>): UnitEvaluationResult {
    const act = (data['บันทึกช่อง1_ทำอะไรและได้ผลอย่างไร'] || '').trim();
    const obs = (data['บันทึกช่อง2_ติดขัดตรงไหน'] || '').trim();
    const eth = (data['บันทึกช่อง3_จริยธรรมดิจิทัลและวิธีแก้'] || '').trim();
    const plan = (data['แผนถ่ายทอดให้ทีม10นาที'] || '').trim();

    let sc1 = (act.length >= 20 && obs.length >= 15) ? 3 : 2;
    let sc2 = eth.length >= 20 ? 4 : eth.length >= 10 ? 2 : 1;
    let sc3 = plan.length >= 20 ? 3 : 2;

    return this.buildResult('3.1', [
      { id: 'r31_journal', title: 'ความสมบูรณ์ของการสะท้อนคิดการลงมือทำจริง', score: sc1, max: 3, comment: 'บันทึกการทดลองใช้เครื่องมือดิจิทัลด้วยตนเองอย่างตรงไปตรงมา' },
      { id: 'r31_ethics', title: 'การตระหนักรู้ด้านจริยธรรมและลิขสิทธิ์ดิจิทัล', score: sc2, max: 4, comment: sc2 === 4 ? 'สะท้อนประเด็นจริยธรรมหรือลิขสิทธิ์สื่อได้อย่างเฉียบคม พร้อมวิธีแก้ไขที่ถูกต้อง' : 'ควรบันทึกประเด็นด้านลิขสิทธิ์สื่อหรือจริยธรรมดิจิทัลให้ชัดเจนขึ้น', sug: sc2 < 4 ? 'ระบุว่าเจอปัญหาลิขสิทธิ์ภาพ/ฟอนต์ หรือความถูกต้องของข้อมูลอย่างไร และแก้ปัญหาอย่างไร' : undefined },
      { id: 'r31_microteach', title: 'แผนการถ่ายทอดสั้น 10 นาที (Micro-teaching)', score: sc3, max: 3, comment: 'แผนถ่ายทอดกระชับ มุ่งเน้นการลงมือทำร่วมกันในเวลาสั้น' }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 3.2: ผังการทำงานทีม 3 เสาหลักบน Cloud
  // --------------------------------------------------------------------------
  private static eval3_2(data: Record<string, any>): UnitEvaluationResult {
    const comm = (data['เสาหลัก1_การสื่อสาร'] || '').trim();
    const drive = (data['เสาหลัก2_การแบ่งปันไฟล์'] || '').trim();
    const track = (data['เสาหลัก3_การติดตามงาน'] || '').trim();

    let sc1 = comm.length >= 20 ? 3 : 2;
    let sc2 = (drive.length >= 25 && /(drive|แชร์|โฟลเดอร์|ไฟล์)/i.test(drive)) ? 4 : drive.length >= 15 ? 2 : 1;
    let sc3 = track.length >= 20 ? 3 : 2;

    return this.buildResult('3.2', [
      { id: 'r32_comm', title: 'เสาหลักที่ 1: กฎการสื่อสารที่มีประสิทธิภาพ', score: sc1, max: 3, comment: 'กำหนดช่องทางและช่วงเวลาการสื่อสารของทีมชัดเจน ไม่รบกวนเวลาส่วนตัว' },
      { id: 'r32_drive', title: 'เสาหลักที่ 2: โครงสร้างการแบ่งปันไฟล์กลาง', score: sc2, max: 4, comment: sc2 === 4 ? 'ออกแบบโฟลเดอร์กลางและกฎการตั้งชื่อไฟล์ได้เป็นระบบ ป้องกันไฟล์สูญหาย' : 'ควรอธิบายโครงสร้างโฟลเดอร์และสิทธิ์การแชร์ไฟล์ให้ชัดเจนขึ้น', sug: sc2 < 4 ? 'ระบุชื่อโฟลเดอร์ กฎการตั้งชื่อไฟล์ และผู้มีสิทธิ์แก้ไข' : undefined },
      { id: 'r32_track', title: 'เสาหลักที่ 3: ระบบติดตามความคืบหน้าที่โปร่งใส', score: sc3, max: 3, comment: 'มีตารางหรือเครื่องมือติดตามงานที่ทุกคนเห็นสถานะตรงกัน ลดการทวงงาน' }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 4.1: วิสัยทัศน์ดิจิทัลของสถานศึกษา (Vision Builder)
  // --------------------------------------------------------------------------
  private static eval4_1(data: Record<string, any>): UnitEvaluationResult {
    const p1 = (data['คำตอบนำทาง_ด้านผู้เรียน'] || '').trim();
    const p2 = (data['คำตอบนำทาง_ด้านครู'] || '').trim();
    const p3 = (data['คำตอบนำทาง_ด้านชุมชน'] || '').trim();
    const vision = (data['วิสัยทัศน์ดิจิทัล'] || '').trim();
    const forum = (data['แผนเวทีระดมความเห็น'] || '').trim();

    let sc1 = (p1.length >= 10 && p2.length >= 10 && p3.length >= 10) ? 3 : 2;
    
    // วิสัยทัศน์ต้องมีกรอบเวลา มีเป้าหมาย และไม่สั้นเกินไป
    const hasTime = /(ปี|ภาคเรียน|256|257|ภายใน)/i.test(vision);
    let sc2 = 1;
    if (vision.length >= 50 && hasTime) {
      sc2 = 4;
    } else if (vision.length >= 25) {
      sc2 = 2;
    }

    let sc3 = forum.length >= 20 ? 3 : 2;

    return this.buildResult('4.1', [
      { id: 'r41_prompts', title: 'ความครอบคลุมของผู้มีส่วนได้ส่วนเสีย 3 มิติ', score: sc1, max: 3, comment: 'ตอบคำถามนำทางครอบคลุมทั้งมิตินักเรียน ครู และชุมชน' },
      { id: 'r41_vision', title: 'คุณภาพของแถลงการณ์วิสัยทัศน์ (Vision Statement)', score: sc2, max: 4, comment: sc2 === 4 ? 'วิสัยทัศน์ทรงพลัง มีกรอบเวลาชัดเจน และแปลงสู่การปฏิบัติได้จริง' : 'วิสัยทัศน์ยังสั้นเกินไป หรือขาดการระบุกรอบเวลาความสำเร็จ', sug: sc2 < 4 ? 'เขียนวิสัยทัศน์ 3-4 ประโยค พร้อมระบุกรอบเวลา เช่น "ภายใน 3 ปี..."' : undefined },
      { id: 'r41_forum', title: 'การมีส่วนร่วมและการสื่อสารวิสัยทัศน์ร่วม', score: sc3, max: 3, comment: 'วางแผนเปิดเวทีรับฟังความคิดเห็นเพื่อสร้างวิสัยทัศน์ร่วม (Shared Vision)' }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 4.2: การสร้างค่านิยมและแรงจูงใจ (TAM Model)
  // --------------------------------------------------------------------------
  private static eval4_2(data: Record<string, any>): UnitEvaluationResult {
    const concern = (data['กลุ่มเป้าหมายและความกังวล'] || '').trim();
    const format = (data['รูปแบบกิจกรรม'] || '').trim();
    const quickWin = (data['QuickWinที่เห็นผลครั้งเดียว'] || '').trim();
    const quant = (data['ตัวชี้วัดเชิงปริมาณ'] || '').trim();

    let sc1 = concern.length >= 15 ? 3 : 2;
    let sc2 = (format.length >= 15 && quickWin.length >= 20) ? 4 : quickWin.length >= 10 ? 2 : 1;
    let sc3 = quant.length >= 15 ? 3 : 2;

    return this.buildResult('4.2', [
      { id: 'r42_concern', title: 'การทำความเข้าใจความกังวลของครู (Empathy)', score: sc1, max: 3, comment: 'ระบุกลุ่มครูและความวิตกกังวลต่อเทคโนโลยีได้ตรงจุด' },
      { id: 'r42_activity', title: 'รูปแบบกิจกรรมและ Quick Win ที่เห็นผลทันที', score: sc2, max: 4, comment: sc2 === 4 ? 'กิจกรรมผ่อนคลายและ Quick Win ช่วยลดภาระงานได้จริง สอดคล้องกับทฤษฎี TAM' : 'ควรอธิบาย Quick Win ที่ช่วยให้ครูเห็นประโยชน์ชัดเจนในการทดลองครั้งแรก', sug: sc2 < 4 ? 'เลือกเครื่องมือที่ใช้ง่ายและลดเวลาทำงานได้ทันที เช่น พิมพ์เอกสารด้วยเสียง' : undefined },
      { id: 'r42_metric', title: 'การวัดผลความสำเร็จเชิงรูปธรรม', score: sc3, max: 3, comment: 'กำหนดตัวชี้วัดการมีส่วนร่วมและความมั่นใจของครูอย่างชัดเจน' }
    ]);
  }

  // Fallback
  private static fallbackEval(unitId: string, data: Record<string, any>): UnitEvaluationResult {
    const keys = Object.keys(data).filter(k => !k.startsWith('ตรวจ_'));
    const filled = keys.filter(k => String(data[k] || '').trim().length >= 15).length;
    const ratio = keys.length > 0 ? filled / keys.length : 0;
    const totalScore = Math.min(10, Math.max(4, Math.round(ratio * 10)));
    return {
      unitId,
      scores: { criterion1: Math.ceil(totalScore * 0.4), criterion2: Math.ceil(totalScore * 0.3), criterion3: Math.floor(totalScore * 0.3) },
      totalScore,
      maxPossible: 10,
      isPassed: totalScore >= 7,
      feedbacks: [
        {
          criterionId: 'fallback',
          title: 'การประเมินความครบถ้วนของชิ้นงาน',
          score: totalScore,
          maxScore: 10,
          status: totalScore >= 8 ? 'high' : totalScore >= 7 ? 'medium' : 'low',
          comment: totalScore >= 7 ? 'กรอกข้อมูลได้ครบถ้วนตามเกณฑ์มาตรฐาน' : 'ข้อมูลยังไม่สมบูรณ์ โปรดระบุรายละเอียดเพิ่มเติมในแบบฟอร์ม'
        }
      ]
    };
  }

  private static buildResult(
    unitId: string,
    items: { id: string; title: string; score: number; max: number; comment: string; sug?: string }[]
  ): UnitEvaluationResult {
    const scores: Record<string, number> = {};
    let totalScore = 0;
    let maxPossible = 0;

    const feedbacks: CriterionFeedback[] = items.map(it => {
      scores[it.id] = it.score;
      totalScore += it.score;
      maxPossible += it.max;
      const ratio = it.score / it.max;
      const status: 'high' | 'medium' | 'low' = ratio >= 0.8 ? 'high' : ratio >= 0.5 ? 'medium' : 'low';
      return {
        criterionId: it.id,
        title: it.title,
        score: it.score,
        maxScore: it.max,
        status,
        comment: it.comment,
        suggestion: it.sug
      };
    });

    return {
      unitId,
      scores,
      totalScore,
      maxPossible,
      isPassed: totalScore >= 7,
      feedbacks
    };
  }
}
