/**
 * ============================================================================
 * 🧠 ระบบตรวจประเมินแบบฝึกหัดอัตโนมัติ (Automated Rubric Evaluation Engine)
 * ============================================================================
 * ทำหน้าที่ตรวจสอบเนื้อหาที่ผู้บริหารกรอกใน Step 4 เทียบกับเกณฑ์รูบริกของแต่ละหน่วย
 * คำนวณคะแนนอัตโนมัติ (เต็ม 10 คะแนน) พร้อมให้คำแนะนำเชิงพัฒนา (Formative Feedback)
 * เกณฑ์การผ่าน: ต้องได้คะแนนรวม >= 7/10 คะแนน (70%) และไม่มีคำตอบที่ผิดหลงประเด็นหรือซ้ำซ้อน
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
   * ตรวจสอบว่าข้อความมีความหมายจริง ไม่ใช่ตัวอักษรซ้ำๆ ข้อความมั่ว หรือคำปฏิเสธ/ผิดหลักการ
   */
  private static isMeaningfulText(text: string, minLength = 12): boolean {
    const cleaned = (text || '').trim();
    if (cleaned.length < minLength) return false;

    // ตรวจจับการพิมพ์ตัวอักษรเดิมซ้ำติดกันเกิน 4 ตัว เช่น "กกกกกก" หรือ "111111" หรือ "aaaaa"
    if (/(.)\1{4,}/u.test(cleaned)) return false;

    // ต้องมีพยัญชนะภาษาไทยอย่างน้อย 5 ตัวอักษรที่ไม่ซ้ำกัน เพื่อป้องกันการพิมพ์มั่ว
    const thaiChars = cleaned.match(/[ก-ฮ]/g) || [];
    const uniqueThaiChars = new Set(thaiChars);
    if (thaiChars.length < 5 || uniqueThaiChars.size < 4) return false;

    // ตรวจจับคำตอบที่ผิดหลักการภาวะผู้นำหรือคำปฏิเสธการทำกิจกรรม
    const invalidPatterns = /^(ไม่รู้|ไม่ทราบ|ไม่มี|ไม่ทำ|ไม่สนใจ|ว่าง|ขี้เกียจ|ผิด|ทดสอบ|เทส|test|asdf|1234|-|\.+)$/i;
    if (invalidPatterns.test(cleaned)) return false;

    const wrongLeadershipPatterns = /(ไล่ครูออก|ตัดเงินเดือนครู|ลงโทษสถานหนัก|ห้ามใช้เทคโนโลยีเด็ดขาด|ไม่ต้องทำอะไรเลย|บังคับขู่เข็ญ)/i;
    if (wrongLeadershipPatterns.test(cleaned)) return false;

    return true;
  }

  /**
   * ตรวจจับการคัดลอกคำตอบซ้ำกันในหลายช่อง (Duplicate Answers Check)
   */
  private static hasDuplicateAnswers(texts: string[]): boolean {
    const validTexts = texts
      .map(t => (t || '').trim().replace(/\s+/g, ' ').toLowerCase())
      .filter(t => t.length >= 8);

    if (validTexts.length < 2) return false;

    for (let i = 0; i < validTexts.length; i++) {
      for (let j = i + 1; j < validTexts.length; j++) {
        if (validTexts[i] === validTexts[j]) {
          return true;
        }
        // กรณีข้อความหนึ่งเป็นส่วนย่อยเกือบทั้งหมดของอีกข้อความหนึ่ง
        const shorter = validTexts[i].length < validTexts[j].length ? validTexts[i] : validTexts[j];
        const longer = validTexts[i].length < validTexts[j].length ? validTexts[j] : validTexts[i];
        if (shorter.length >= 12 && longer.includes(shorter) && shorter.length / longer.length > 0.85) {
          return true;
        }
      }
    }
    return false;
  }

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
  // หน่วย 1.1: การวางแผนในการสื่อสาร 4 ช่อง
  // เกณฑ์ตรงกับ UNITS_DATA['1.1'].rubric: r1_goal (3), r1_channel (4), r1_feasibility (3)
  // --------------------------------------------------------------------------
  private static eval1_1(data: Record<string, any>): UnitEvaluationResult {
    const goal = (data['เป้าหมาย'] || '').trim();
    const mainAud = (data['ผู้รับสารหลัก'] || '').trim();
    const subAud = (data['ผู้รับสารรอง'] || '').trim();
    const msg = (data['ข้อความหลัก'] || '').trim();
    const channels = (data['ช่องทางและเหตุผล'] || '').trim();

    const isDup = this.hasDuplicateAnswers([goal, msg, channels]);

    // 1. r1_goal (เต็ม 3)
    let s1 = 1;
    let c1 = 'เป้าหมายหรือข้อความหลักยังไม่ชัดเจน หรือมีความหมายไม่สมบูรณ์';
    let sug1: string | undefined = 'ระบุเป้าหมายให้ชัดเจนว่า ต้องการให้ [ใคร] [ทราบ/ทำอะไร] ภายใน [เวลาใด] และร่างข้อความหลักไม่เกิน 3 ประโยค';
    const hasTimeOrUrgency = /(เวลา|ก่อน|ภายใน|ด่วน|วัน|เช้า|โมง|น\.|0[0-9]|1[0-9]|2[0-9])/i.test(goal + msg);
    const hasWho = /(ผู้ปกครอง|ครู|นักเรียน|ชุมชน|ทุกคน|บุคลากร)/i.test(goal + mainAud);

    if (isDup) {
      s1 = 1;
      c1 = 'พบการวางข้อความซ้ำกันในหลายช่อง กรุณาเขียนแยกตามองค์ประกอบให้ถูกต้อง';
    } else if (this.isMeaningfulText(goal, 15) && this.isMeaningfulText(msg, 25) && hasWho) {
      if (hasTimeOrUrgency && msg.length <= 250) {
        s1 = 3;
        c1 = 'เป้าหมายระบุกลุ่มเป้าหมายและการกระทำชัดเจน ข้อความหลักกระชับ เข้าใจง่ายและนำไปปฏิบัติได้ทันที';
        sug1 = undefined;
      } else {
        s1 = 2;
        c1 = 'เป้าหมายชัดเจนดี แต่ข้อความหลักอาจยังไม่ระบุกรอบเวลาที่ชัดเจน';
        sug1 = 'ระบุเวลาเดดไลน์หรือสิ่งที่ผู้ปกครองต้องปฏิบัติให้ชัดเจนยิ่งขึ้น';
      }
    }

    // 2. r1_channel (เต็ม 4)
    let s2 = 1;
    let c2 = 'ระบุช่องทางน้อยเกินไปหรือไม่ครอบคลุมกลุ่มเป้าหมาย';
    let sug2: string | undefined = 'ควรผสมผสานทั้งช่องทางดิจิทัล (เช่น LINE, Facebook) และช่องทางชุมชน (เช่น หอกระจายข่าว, ผู้ใหญ่บ้าน)';
    const hasOnline = /(line|ไลน์|facebook|เฟซ|เพจ|sms|แอป|เว็บไซต์|ออนไลน์)/i.test(channels);
    const hasCommunity = /(หอ|กระจายข่าว|ผู้ใหญ่บ้าน|กำนัน|ป้าย|จดหมาย|โทร|อบต|ปากต่อปาก|เพื่อนบ้าน|เสียงตามสาย)/i.test(channels);

    if (!isDup && this.isMeaningfulText(channels, 25)) {
      if (hasOnline && hasCommunity && channels.length >= 30) {
        s2 = 4;
        c2 = 'ยอดเยี่ยม! ผสมผสานทั้งช่องทางดิจิทัลที่รวดเร็ว และช่องทางชุมชนสำหรับครอบครัวที่เข้าไม่ถึงอินเทอร์เน็ต';
        sug2 = undefined;
      } else if (hasOnline || hasCommunity) {
        s2 = 2;
        c2 = 'เลือกช่องทางได้ดีแต่พึ่งพาช่องทางดิจิทัลหรือชุมชนเพียงด้านเดียว อาจตกหล่นผู้รับสารบางกลุ่ม';
        sug2 = 'เพิ่มช่องทางสำรองสำหรับกลุ่มที่ไม่มีสมาร์ทโฟน เช่น ประสานผู้ใหญ่บ้านหรือหอกระจายข่าว';
      }
    }

    // 3. r1_feasibility (เต็ม 3)
    let s3 = 1;
    let c3 = 'ข้อมูลผู้รับสารหลัก/รอง หรือเหตุผลประกอบช่องทางยังไม่ครบถ้วน';
    let sug3: string | undefined = 'ระบุทั้งผู้รับสารหลัก ผู้รับสารรอง และอธิบายเหตุผลของช่องทางที่เลือกให้ครบถ้วน';
    if (!isDup && this.isMeaningfulText(channels, 30) && this.isMeaningfulText(mainAud, 8) && this.isMeaningfulText(subAud, 8)) {
      s3 = 3;
      c3 = 'สอดคล้องกับบริบทโรงเรียนขนาดเล็ก ระบุผู้รับสารหลัก-รองและช่องทางที่ปฏิบัติได้จริง';
      sug3 = undefined;
    } else if (!isDup && this.isMeaningfulText(channels, 20) && (this.isMeaningfulText(mainAud, 6) || this.isMeaningfulText(subAud, 6))) {
      s3 = 2;
      c3 = 'ปฏิบัติได้จริง แต่อาจต้องเพิ่มรายละเอียดของผู้รับสารรองหรือเหตุผลประกอบ';
      sug3 = 'เขียนอธิบายบทบาทของผู้รับสารรองและเหตุผลของช่องทางให้ชัดเจนขึ้น';
    }

    return this.buildResult('1.1', [
      { id: 'r1_goal', title: 'ความชัดเจนของเป้าหมายและข้อความหลัก', score: s1, max: 3, comment: c1, sug: sug1 },
      { id: 'r1_channel', title: 'ความเหมาะสมของช่องทางกับผู้รับสาร', score: s2, max: 4, comment: c2, sug: sug2 },
      { id: 'r1_feasibility', title: 'ความเป็นไปได้ในการปฏิบัติจริง', score: s3, max: 3, comment: c3, sug: sug3 }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 1.2: การสร้างเครือข่ายพันธมิตร 4 ทิศทาง
  // เกณฑ์ตรงกับ UNITS_DATA['1.2'].rubric: r2_network (3), r2_twoway (4), r2_impact (3)
  // --------------------------------------------------------------------------
  private static eval1_2(data: Record<string, any>): UnitEvaluationResult {
    const internal = (data['เครือข่ายภายในโรงเรียน'] || '').trim();
    const parents = (data['เครือข่ายผู้ปกครอง'] || '').trim();
    const community = (data['เครือข่ายชุมชนและท้องถิ่น'] || '').trim();
    const external = (data['เครือข่ายภายนอก'] || '').trim();
    const inquiry = (data['ข้อกังวลจากพันธมิตร'] || '').trim();
    const response = (data['ข้อความตอบกลับของผู้บริหาร'] || '').trim();

    const isNetDup = this.hasDuplicateAnswers([internal, parents, community, external]);

    // 1. r2_network (เต็ม 3)
    let s1 = 1;
    const validNets = [internal, parents, community, external].filter(t => this.isMeaningfulText(t, 8)).length;
    if (!isNetDup && validNets === 4) s1 = 3;
    else if (!isNetDup && validNets >= 2) s1 = 2;

    const c1 = s1 === 3
      ? 'ระบุพันธมิตรและช่องทางดิจิทัลครบทั้ง 4 ทิศทาง สอดคล้องกับบริบทจริงของโรงเรียนขนาดเล็ก'
      : isNetDup
      ? 'พบการกรอกข้อมูลเครือข่ายซ้ำกัน กรุณาระบุพันธมิตรแต่ละทิศทางให้แตกต่างกันตามจริง'
      : `ระบุเครือข่ายที่มีความหมายได้ ${validNets}/4 ทิศทาง ควรระบุให้ครบทั้ง 4 ทิศทาง`;
    const sug1 = s1 < 3 ? 'เติมข้อมูลกลุ่มพันธมิตรพร้อมช่องทางสื่อสารให้ครบทั้งภายใน, ผู้ปกครอง, ชุมชน และภายนอก' : undefined;

    // 2. r2_twoway (เต็ม 4)
    let s2 = 1;
    const isPolite = /(ครับ|ค่ะ|ขอขอบคุณ|ขอบคุณ|ยินดี|เคารพ|ขอเรียน|ชี้แจง|ห่วงใย)/i.test(response);
    const isSolutionOriented = /(แผน|พัฒนา|ร่วมมือ|เชิญ|พร้อม|ปรับปรุง|แก้ไข|หารือ|ประชุม|ดูแล|คุณภาพ)/i.test(response);
    const isRespDup = this.hasDuplicateAnswers([inquiry, response]);

    if (!isRespDup && this.isMeaningfulText(response, 35) && isPolite && isSolutionOriented) {
      s2 = 4;
    } else if (!isRespDup && this.isMeaningfulText(response, 20) && (isPolite || isSolutionOriented)) {
      s2 = 2;
    }

    const c2 = s2 === 4
      ? 'ตอบสนองด้วยน้ำเสียงที่สุภาพ ให้เกียรติ ชี้แจงข้อเท็จจริง และเปิดโอกาสให้ร่วมมือแก้ปัญหา'
      : 'ข้อความตอบกลับยังสั้นเกินไป ขาดความสุภาพเชิงบวก หรือยังไม่ได้เชิญชวนพันธมิตรร่วมหาทางออก';
    const sug2 = s2 < 4 ? 'เขียนตอบกลับโดยกล่าวขอบคุณในความห่วงใย ชี้แจงแนวทางพัฒนา และเชิญชวนร่วมพูดคุยหารือ' : undefined;

    // 3. r2_impact (เต็ม 3)
    let s3 = 1;
    if (!isRespDup && this.isMeaningfulText(inquiry, 15) && this.isMeaningfulText(response, 35) && isSolutionOriented) {
      s3 = 3;
    } else if (this.isMeaningfulText(inquiry, 10) && this.isMeaningfulText(response, 20)) {
      s3 = 2;
    }
    const c3 = s3 === 3
      ? 'สร้างความเข้าใจอันดีและเปลี่ยนข้อกังวลให้เป็นพลังความร่วมมือที่ยั่งยืน'
      : 'ควรระบุประเด็นข้อกังวลและแนวทางการดึงพันธมิตรเข้ามามีส่วนร่วมพัฒนาโรงเรียนให้ชัดเจนขึ้น';
    const sug3 = s3 < 3 ? 'ระบุสถานการณ์คำถามจากชุมชน และต่อยอดสู่กิจกรรมความร่วมมือที่เป็นรูปธรรม' : undefined;

    return this.buildResult('1.2', [
      { id: 'r2_network', title: 'ความครอบคลุมของเครือข่ายพันธมิตร 4 ทิศทาง', score: s1, max: 3, comment: c1, sug: sug1 },
      { id: 'r2_twoway', title: 'คุณภาพของการสื่อสารสองทาง (Two-Way Communication)', score: s2, max: 4, comment: c2, sug: sug2 },
      { id: 'r2_impact', title: 'การนำไปใช้ประโยชน์เพื่อพัฒนาโรงเรียน', score: s3, max: 3, comment: c3, sug: sug3 }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 1.3: ภาพลักษณ์ สื่อปลอดภัย และ PDPA
  // เกณฑ์ตรงกับ UNITS_DATA['1.3'].rubric: r3_quality (3), r3_pdpa (4), r3_channel (3)
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

    const isDup = this.hasDuplicateAnswers([title, highlight, consent]);

    // 1. r3_quality (เต็ม 3)
    let s1 = 1;
    if (!isDup && this.isMeaningfulText(title, 10) && this.isMeaningfulText(highlight, 25)) {
      s1 = 3;
    } else if (!isDup && this.isMeaningfulText(title, 8) && this.isMeaningfulText(highlight, 12)) {
      s1 = 2;
    }

    // 2. r3_pdpa (เต็ม 4)
    let s2 = checkedCount === 5 ? 4 : checkedCount >= 3 ? 2 : 1;

    // 3. r3_channel (เต็ม 3) - ความเหมาะสมของช่องทางเผยแพร่และข้อความขอความยินยอม
    const hasConsentKeyword = /(ยินยอม|อนุญาต|pdpa|คุ้มครองข้อมูล|พระราชบัญญัติ|ผู้ปกครอง|เผยแพร่|ภาพ)/i.test(consent);
    let s3 = 1;
    if (!isDup && this.isMeaningfulText(consent, 25) && hasConsentKeyword) {
      s3 = 3;
    } else if (!isDup && this.isMeaningfulText(consent, 15)) {
      s3 = 2;
    }

    return this.buildResult('1.3', [
      {
        id: 'r3_quality',
        title: 'ความน่าสนใจและคุณค่าของสาระประชาสัมพันธ์',
        score: s1,
        max: 3,
        comment: s1 === 3 ? 'หัวข้อและจุดเด่นน่าสนใจ สื่อสารเรื่องราวเชิงบวก (Storytelling) ของโรงเรียนได้ชัดเจน' : 'ควรขยายความจุดเด่นและเรื่องราวความสำเร็จของโรงเรียนให้ชัดเจนยิ่งขึ้น',
        sug: s1 < 3 ? 'เขียนหัวข้อและจุดเด่นของกิจกรรมที่สะท้อนพัฒนาการของนักเรียนอย่างน้อย 2-3 ประโยค' : undefined
      },
      {
        id: 'r3_pdpa',
        title: 'ความถูกต้องตามหลัก PDPA และลิขสิทธิ์',
        score: s2,
        max: 4,
        comment: s2 === 4 ? 'ผ่านเกณฑ์ Checklist PDPA และลิขสิทธิ์สื่อครบถ้วนทั้ง 5 ข้อ' : `ตรวจสอบผ่านเพียง ${checkedCount}/5 ข้อ ควรตรวจสอบความปลอดภัยข้อมูลเด็กให้ครบทุกข้อ`,
        sug: s2 < 4 ? 'คลิกตรวจสอบรายการ Checklist มาตรฐาน PDPA และลิขสิทธิ์สื่อให้ครบทั้ง 5 ข้อ' : undefined
      },
      {
        id: 'r3_channel',
        title: 'ความเหมาะสมของช่องทางเผยแพร่',
        score: s3,
        max: 3,
        comment: s3 === 3 ? 'ร่างข้อความขอความยินยอมและแนวทางเผยแพร่ได้ถูกต้องตามหลักกฎหมาย PDPA' : 'ข้อความขอความยินยอมผู้ปกครองยังสั้นเกินไปหรือขาดการอ้างอิงวัตถุประสงค์ตามหลัก PDPA',
        sug: s3 < 3 ? 'ระบุวัตถุประสงค์การนำภาพไปเผยแพร่ประชาสัมพันธ์และสิทธิของผู้ปกครองตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล' : undefined
      }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 2.1: การจัดการเรียนการสอนด้วยเทคโนโลยีดิจิทัล (การโค้ชครู 3 ครั้ง)
  // เกณฑ์ตรงกับ UNITS_DATA['2.1'].rubric: r4_tool (4), r4_plan (4), r4_role (2)
  // --------------------------------------------------------------------------
  private static eval2_1(data: Record<string, any>): UnitEvaluationResult {
    const teacher = (data['ครูเป้าหมายและปัญหา'] || '').trim();
    const tool = (data['เครื่องมือดิจิทัลที่เลือก'] || '').trim();
    const s1Text = (data['โค้ชครั้งที่1_ชวนคุยสาธิต'] || '').trim();
    const s2Text = (data['โค้ชครั้งที่2_ร่วมออกแบบ'] || '').trim();
    const s3Text = (data['โค้ชครั้งที่3_สังเกตชื่นชม'] || '').trim();
    const support = (data['การหนุนเสริมของผู้บริหาร'] || '').trim();

    // 1. r4_tool (เต็ม 4): ความเหมาะสมของเครื่องมือกับบริบทครูและวิชา
    const hasTeacherProblem = /(ครู|สอน|วิชา|ชั้น|ป\.|อนุบาล|นักเรียน|อ่าน|เขียน|สื่อ|เวลา|ควบ|ภาระ|ไม่คล่อง|กังวล)/i.test(teacher);
    const hasValidTool = /(canva|dltv|google|youtube|quizizz|kahoot|wordwall|padlet|powerpoint|คลิป|เกม|สื่อ|ใบงาน|ออนไลน์|แอป|เว็บไซต์|oer|คลัง|ฟอร์ม|เพจ)/i.test(tool);
    const isToolDup = this.hasDuplicateAnswers([teacher, tool]);

    let sc1 = 1;
    let c1 = 'ข้อมูลครูเป้าหมายหรือเครื่องมือดิจิทัลที่เลือกยังไม่สอดคล้องกับปัญหาการจัดการเรียนรู้';
    let sug1: string | undefined = 'ระบุชื่อ/ระดับชั้นของครู สภาพปัญหาในการสอน และระบุชื่อเครื่องมือดิจิทัล (เช่น DLTV, Canva, Quizizz) พร้อมเหตุผลที่ช่วยลดภาระครู';

    if (!isToolDup && this.isMeaningfulText(teacher, 15) && this.isMeaningfulText(tool, 15) && hasTeacherProblem && hasValidTool) {
      sc1 = 4;
      c1 = 'ระบุครูเป้าหมาย สภาพปัญหา และจับคู่เครื่องมือดิจิทัลที่ช่วยแก้ปัญหาและลดภาระงานสอนได้อย่างเหมาะสม';
      sug1 = undefined;
    } else if (!isToolDup && this.isMeaningfulText(teacher, 10) && this.isMeaningfulText(tool, 10) && (hasTeacherProblem || hasValidTool)) {
      sc1 = 2;
      c1 = 'ระบุครูและเครื่องมือได้เบื้องต้น แต่ยังขาดรายละเอียดปัญหาการสอนหรือเหตุผลความเหมาะสมของเครื่องมือ';
      sug1 = 'อธิบายเพิ่มเติมว่าเครื่องมือที่เลือกช่วยแก้ปัญหาการสอนของครูท่านนี้ได้อย่างไร';
    }

    // 2. r4_plan (เต็ม 4): ความเป็นไปได้ของแผนโค้ช 3 ครั้ง
    const isStepsDup = this.hasDuplicateAnswers([s1Text, s2Text, s3Text]);
    const hasCoachingKeywords1 = /(คุย|สาธิต|แนะนำ|ชวน|ดู|ตัวอย่าง|ทดลอง|ฟัง|ปัญหา)/i.test(s1Text);
    const hasCoachingKeywords2 = /(ออกแบบ|ร่วม|ช่วย|ทำ|แผน|คาบ|สร้าง|เตรียม|จับมือ|ลอง)/i.test(s2Text);
    const hasCoachingKeywords3 = /(สังเกต|ชม|ชื่นชม|กำลังใจ|สะท้อน|เยี่ยมชั้นเรียน|ดูเด็ก|สอนจริง|ฟีดแบ็ก)/i.test(s3Text);

    let sc2 = 1;
    let c2 = 'แผนการโค้ชทั้ง 3 ครั้งยังไม่ครบถ้วน หรือเนื้อหาไม่สอดคล้องกับกระบวนการโค้ชชิ่ง';
    let sug2: string | undefined = 'เขียนแผนโค้ชให้ครบทั้ง 3 ครั้งโดยไม่ซ้ำกัน: ครั้งที่ 1 (ชวนคุย-สาธิต), ครั้งที่ 2 (นั่งข้างๆ ร่วมออกแบบ 1 คาบ), ครั้งที่ 3 (สังเกตชั้นเรียนและชื่นชม)';

    if (isStepsDup) {
      sc2 = 1;
      c2 = 'พบการกรอกข้อความซ้ำกันในแผนการโค้ชแต่ละครั้ง กรุณาระบุกิจกรรมของการโค้ชทั้ง 3 ครั้งให้แตกต่างกันตามลำดับขั้นตอน';
    } else if (
      this.isMeaningfulText(s1Text, 15) &&
      this.isMeaningfulText(s2Text, 15) &&
      this.isMeaningfulText(s3Text, 15) &&
      hasCoachingKeywords1 &&
      hasCoachingKeywords2 &&
      hasCoachingKeywords3
    ) {
      sc2 = 4;
      c2 = 'วางแผนการโค้ชครบทั้ง 3 ครั้งอย่างเป็นลำดับขั้นตอน (ชวนคุยสาธิต -> ร่วมออกแบบ -> สังเกตและชื่นชม) โดยไม่กดดันครู';
      sug2 = undefined;
    } else if (
      this.isMeaningfulText(s1Text, 12) &&
      this.isMeaningfulText(s2Text, 12) &&
      this.isMeaningfulText(s3Text, 12)
    ) {
      sc2 = 2;
      c2 = 'กรอกแผนครบ 3 ครั้งแล้ว แต่บางขั้นตอนยังขาดรายละเอียดเชิงปฏิบัติตามหลักการโค้ช (สาธิต, ร่วมทำ, ชื่นชม)';
    }

    // 3. r4_role (เต็ม 2): ความชัดเจนของบทบาทผู้บริหาร
    const hasSupportKeywords = /(สนับสนุน|หนุน|เวลา|อุปกรณ์|อินเทอร์เน็ต|เน็ต|ไวไฟ|กำลังใจ|ลดภาระ|พี่เลี้ยง|งบ|ช่วย|จัดหา|ชมเชย|อำนวยความสะดวก)/i.test(support);
    let sc3 = 0;
    let c3 = 'ยังไม่ได้ระบุบทบาทการหนุนเสริมของผู้บริหาร หรือข้อความไม่ชัดเจน';
    let sug3: string | undefined = 'ระบุให้ชัดเจนว่าผู้บริหารจะสนับสนุนด้านเวลา อุปกรณ์ อินเทอร์เน็ต หรือการเสริมกำลังใจอย่างไรโดยไม่ทำแทนครู';

    if (
      !this.hasDuplicateAnswers([support, s1Text, s2Text, s3Text]) &&
      this.isMeaningfulText(support, 15) &&
      hasSupportKeywords
    ) {
      sc3 = 2;
      c3 = 'ระบุบทบาทผู้บริหารในการสนับสนุนทรัพยากร เวลา และกำลังใจได้อย่างชัดเจน';
      sug3 = undefined;
    } else if (this.isMeaningfulText(support, 10)) {
      sc3 = 1;
      c3 = 'ระบุบทบาทสนับสนุนไว้เบื้องต้น แต่ควรเพิ่มรายละเอียดด้านการจัดสรรเวลาหรือทรัพยากรให้ชัดเจนขึ้น';
    }

    return this.buildResult('2.1', [
      { id: 'r4_tool', title: 'ความเหมาะสมของเครื่องมือกับบริบทครูและวิชา', score: sc1, max: 4, comment: c1, sug: sug1 },
      { id: 'r4_plan', title: 'ความเป็นไปได้ของแผนโค้ช 3 ครั้ง', score: sc2, max: 4, comment: c2, sug: sug2 },
      { id: 'r4_role', title: 'ความชัดเจนของบทบาทผู้บริหาร', score: sc3, max: 2, comment: c3, sug: sug3 }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 2.2: การจัดสภาพแวดล้อมที่เอื้อต่อการเรียนรู้ (Quick Wins 3 อันดับ)
  // เกณฑ์ตรงกับ UNITS_DATA['2.2'].rubric: r5_eval (3), r5_priority (4), r5_impact (3)
  // --------------------------------------------------------------------------
  private static eval2_2(data: Record<string, any>): UnitEvaluationResult {
    const hw = (data['คะแนนอุปกรณ์ฮาร์ดแวร์'] || '').trim();
    const net = (data['คะแนนระบบเครือข่าย'] || '').trim();
    const space = (data['คะแนนแหล่งเรียนรู้'] || '').trim();
    const q1 = (data['QuickWin_1'] || '').trim();
    const q2 = (data['QuickWin_2'] || '').trim();
    const q3 = (data['QuickWin_3'] || '').trim();

    // 1. r5_eval (เต็ม 3): ความตรงจุดของการวิเคราะห์สภาพปัจจุบัน 3 ด้าน
    const isEvalDup = this.hasDuplicateAnswers([hw, net, space]);
    const validEvalCount = [hw, net, space].filter(t => this.isMeaningfulText(t, 10)).length;
    const hasEnvKeywords = /(มี|ขาด|พอใช้|ดี|ปรับปรุง|คอม|ทีวี|โปรเจกเตอร์|เน็ต|wifi|ไวไฟ|สัญญาณ|ห้อง|สายแลน|ปลั๊ก|เครื่อง|dltv|สื่อ|ชำรุด|หลุด)/i.test(hw + net + space);

    let sc1 = 1;
    let c1 = 'ข้อมูลการประเมินสภาพปัจจุบันทั้ง 3 ด้าน (ฮาร์ดแวร์ เครือข่าย แหล่งเรียนรู้) ยังไม่ครบถ้วนหรือซ้ำกัน';
    let sug1: string | undefined = 'ประเมินสภาพจริงของโรงเรียนให้ครบทั้ง 3 ด้าน (1. อุปกรณ์ฮาร์ดแวร์, 2. ระบบอินเทอร์เน็ต, 3. แหล่งเรียนรู้) ตามบริบทจริง';

    if (!isEvalDup && validEvalCount === 3 && hasEnvKeywords) {
      sc1 = 3;
      c1 = 'ประเมินสภาพแวดล้อมดิจิทัลทั้งด้านฮาร์ดแวร์ เครือข่าย และแหล่งเรียนรู้ได้ตรงตามสภาพจริงของโรงเรียนขนาดเล็ก';
      sug1 = undefined;
    } else if (!isEvalDup && validEvalCount >= 2 && hasEnvKeywords) {
      sc1 = 2;
      c1 = 'ประเมินสภาพปัจจุบันได้บางส่วน แต่ควรระบุรายละเอียดให้ครบทั้ง 3 ด้าน';
    }

    // 2. r5_priority (เต็ม 4): ความเป็นไปได้ของแผนพัฒนา 3 ลำดับแรก (Quick Wins)
    const isQWDup = this.hasDuplicateAnswers([q1, q2, q3]);
    const validQWCount = [q1, q2, q3].filter(t => this.isMeaningfulText(t, 15)).length;
    const hasActionKeywords = /(จัด|ตาราง|ซ่อม|ติดตั้ง|ย้าย|เพิ่ม|แชร์|หมุนเวียน|ดาวน์โหลด|ออฟไลน์|สายแลน|เราเตอร์|wifi|ไวไฟ|คอม|ทีวี|ปลั๊ก|ห้อง|ครู|นักเรียน|ทำความสะอาด|ตรวจเช็ค|อบต|ชุมชน)/i.test(q1 + q2 + q3);

    let sc2 = 1;
    let c2 = 'แผนพัฒนาเร่งด่วน (Quick Wins) ยังไม่ครบ 3 อันดับ หรือมีข้อความซ้ำกัน/ไม่ระบุวิธีการปฏิบัติจริง';
    let sug2: string | undefined = 'ระบุแผน Quick Wins ให้ครบทั้ง 3 อันดับ โดยแต่ละข้อต้องไม่ซ้ำกัน และระบุสิ่งที่จะลงมือทำจริงได้ทันทีภายใต้งบจำกัด';

    if (isQWDup) {
      sc2 = 1;
      c2 = 'พบคำตอบซ้ำกันในรายการ Quick Wins กรุณาระบุแผนพัฒนาทั้ง 3 ลำดับให้แตกต่างกัน';
    } else if (validQWCount === 3 && hasActionKeywords) {
      sc2 = 4;
      c2 = 'แผนพัฒนา Quick Wins ทั้ง 3 ลำดับมีความชัดเจน ปฏิบัติได้จริงทันที และแก้ปัญหาคอขวดได้ตรงจุด';
      sug2 = undefined;
    } else if (validQWCount >= 2 && hasActionKeywords) {
      sc2 = 2;
      c2 = `ระบุแผน Quick Wins ที่สมบูรณ์ได้ ${validQWCount}/3 ข้อ กรุณาเขียนให้ครบทั้ง 3 ลำดับ`;
    }

    // 3. r5_impact (เต็ม 3): การบริหารทรัพยากรที่คุ้มค่า
    let sc3 = 1;
    let c3 = 'แผนการจัดการทรัพยากรยังไม่สะท้อนความคุ้มค่าหรือยังขาดรายละเอียดผู้รับผิดชอบ/ระยะเวลา';
    let sug3: string | undefined = 'อธิบายวิธีบริหารจัดการทรัพยากรเดิมให้เกิดประโยชน์สูงสุด (High Impact, Low Cost) พร้อมระบุผู้รับผิดชอบหรือกรอบเวลา';

    if (!isQWDup && validQWCount === 3 && validEvalCount === 3 && (q1 + q2 + q3).length >= 65 && hasActionKeywords) {
      sc3 = 3;
      c3 = 'บริหารจัดการทรัพยากรที่มีอยู่ได้อย่างคุ้มค่า คำนึงถึงความยั่งยืนและลดอุปสรรคการเข้าถึงเทคโนโลยีของผู้เรียน';
      sug3 = undefined;
    } else if (!isQWDup && validQWCount >= 2 && (q1 + q2 + q3).length >= 40) {
      sc3 = 2;
      c3 = 'คำนึงถึงความคุ้มค่าในระดับปานกลาง ควรขยายความวิธีการใช้ทรัพยากรเดิมให้ชัดเจนขึ้น';
    }

    return this.buildResult('2.2', [
      { id: 'r5_eval', title: 'ความตรงจุดของการวิเคราะห์สภาพปัจจุบัน', score: sc1, max: 3, comment: c1, sug: sug1 },
      { id: 'r5_priority', title: 'ความเป็นไปได้ของแผนพัฒนา 3 ลำดับแรก (Quick Wins)', score: sc2, max: 4, comment: c2, sug: sug2 },
      { id: 'r5_impact', title: 'การบริหารทรัพยากรที่คุ้มค่า', score: sc3, max: 3, comment: c3, sug: sug3 }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 2.3: การวัดและประเมินผลด้วยเทคโนโลยี (Data-Driven Decision)
  // เกณฑ์ตรงกับ UNITS_DATA['2.3'].rubric: r6_design (4), r6_decision (4), r6_efficiency (2)
  // --------------------------------------------------------------------------
  private static eval2_3(data: Record<string, any>): UnitEvaluationResult {
    const topic = String(data['หัวข้อแบบสำรวจดิจิทัล'] || '').trim();
    const target = String(data['กลุ่มผู้ตอบ'] || '').trim();
    const questions = String(data['รายการข้อคำถาม'] || '').trim();
    const decision = String(data['การตัดสินใจเชิงบริหารจากข้อมูล'] || '').trim();

    const isDup = this.hasDuplicateAnswers([topic, questions, decision]);

    // 1. r6_design (เต็ม 4): คุณภาพของการออกแบบข้อคำถามดิจิทัล
    const questionLines = questions.split(/\n|(?:[1-9]\.)|(?:ข้อที่\s*[1-9])/).map((s: string) => s.trim()).filter((s: string) => s.length >= 6);
    const hasSurveyKeywords = /(สำรวจ|ประเมิน|ความพึงพอใจ|ความต้องการ|ปัญหา|การอ่าน|การเรียน|อาหาร|สุขภาพ|เทคโนโลยี|สื่อ|นักเรียน|ผู้ปกครอง|ครู|ระดับ|ข้อเสนอแนะ)/i.test(topic + questions);

    let sc1 = 1;
    let c1 = 'หัวข้อแบบสำรวจ กลุ่มผู้ตอบ หรือรายการข้อคำถามยังไม่ครบถ้วนสมบูรณ์';
    let sug1: string | undefined = 'ระบุหัวข้อแบบสำรวจ กลุ่มผู้ตอบ และร่างรายการข้อคำถามอย่างน้อย 3-5 ข้อ (เช่น คำถามมาตรวัด 1-5 และคำถามปลายเปิด)';

    if (isDup) {
      sc1 = 1;
      c1 = 'พบการคัดลอกข้อความซ้ำกันในช่องคำตอบ กรุณาเขียนรายการคำถามและการตัดสินใจแยกกันให้ชัดเจน';
    } else if (
      this.isMeaningfulText(topic, 12) &&
      this.isMeaningfulText(target, 6) &&
      this.isMeaningfulText(questions, 40) &&
      questionLines.length >= 3 &&
      hasSurveyKeywords
    ) {
      sc1 = 4;
      c1 = 'ออกแบบหัวข้อ กลุ่มผู้ตอบ และชุดคำถามดิจิทัลได้ชัดเจน กระชับ ตรงวัตถุประสงค์ และตอบง่าย';
      sug1 = undefined;
    } else if (this.isMeaningfulText(topic, 10) && this.isMeaningfulText(questions, 20) && hasSurveyKeywords) {
      sc1 = 2;
      c1 = 'มีหัวข้อและแนวคำถามเบื้องต้นแล้ว แต่ควรเพิ่มจำนวนข้อคำถามให้ได้อย่างน้อย 3-5 ข้อ และระบุกลุ่มผู้ตอบให้ชัดเจน';
    }

    // 2. r6_decision (เต็ม 4): การแปลผลข้อมูลสู่การตัดสินใจเชิงบริหาร
    const hasDecisionKeywords = /(ตัดสินใจ|ปรับ|จัด|เพิ่ม|ลด|พัฒนา|แก้|ส่งเสริม|อบรม|สอนเสริม|งบ|แผน|ติดตาม|ข้อมูล|ผล|ร้อยละ|%|หากพบว่า|แนวโน้ม)/i.test(decision);

    let sc2 = 1;
    let c2 = 'การตัดสินใจเชิงบริหารยังไม่เชื่อมโยงกับข้อมูลสำรวจ หรือข้อความสั้นเกินไป';
    let sug2: string | undefined = 'สมมติผลข้อมูลที่คาดว่าจะพบ (เช่น ร้อยละของผู้ตอบที่พบปัญหา) แล้วระบุว่าผู้บริหารจะตัดสินใจสั่งการหรือแก้ปัญหาอย่างไร';

    if (!isDup && this.isMeaningfulText(decision, 30) && hasDecisionKeywords) {
      sc2 = 4;
      c2 = 'เชื่อมโยงแนวโน้มข้อมูลจากแบบสำรวจสู่การตัดสินใจเชิงบริหารและการแก้ปัญหาได้อย่างเป็นรูปธรรม';
      sug2 = undefined;
    } else if (!isDup && this.isMeaningfulText(decision, 18)) {
      sc2 = 2;
      c2 = 'มีการระบุแนวทางปฏิบัติเบื้องต้น แต่ควรเชื่อมโยงให้เห็นว่าอ้างอิงจากผลข้อมูลเรื่องใด';
    }

    // 3. r6_efficiency (เต็ม 2): ความคุ้มค่าและการลดภาระงาน
    let sc3 = 0;
    let c3 = 'ข้อมูลเครื่องมือสำรวจยังไม่ครบถ้วนที่จะช่วยลดขั้นตอนการทำงานเดิม';
    let sug3: string | undefined = 'กรอกข้อมูลให้ครบทั้งหัวข้อ กลุ่มผู้ตอบ ชุดคำถาม และการนำผลไปใช้เพื่อลดงานเอกสารกระดาษ';

    if (!isDup && sc1 >= 2 && sc2 >= 2 && this.isMeaningfulText(target, 6)) {
      sc3 = sc1 === 4 && sc2 === 4 ? 2 : 1;
      c3 = sc3 === 2
        ? 'การออกแบบฟอร์มออนไลน์ช่วยลดภาระการเก็บกระดาษและประมวลผลข้อมูลได้รวดเร็ว'
        : 'ช่วยลดภาระงานได้บางส่วน ควรปรับปรุงชุดคำถามและการแปลผลให้ครบถ้วนยิ่งขึ้น';
      if (sc3 === 2) sug3 = undefined;
    }

    return this.buildResult('2.3', [
      { id: 'r6_design', title: 'คุณภาพของการออกแบบข้อคำถามดิจิทัล', score: sc1, max: 4, comment: c1, sug: sug1 },
      { id: 'r6_decision', title: 'การแปลผลข้อมูลสู่การตัดสินใจเชิงบริหาร', score: sc2, max: 4, comment: c2, sug: sug2 },
      { id: 'r6_efficiency', title: 'ความคุ้มค่าและการลดภาระงาน', score: sc3, max: 2, comment: c3, sug: sug3 }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 3.1: ผู้นำต้นแบบด้านดิจิทัลในทีม (Micro-journal 3 ช่อง)
  // เกณฑ์ตรงกับ UNITS_DATA['3.1'].rubric: r7_action (2), r7_ethics (3), r7_sharing (3), r7_punctual (2)
  // --------------------------------------------------------------------------
  private static eval3_1(data: Record<string, any>): UnitEvaluationResult {
    const toolGoal = (data['เครื่องมือและเป้าหมาย'] || '').trim();
    const act = (data['บันทึกช่อง1_ทำอะไรและได้ผลอย่างไร'] || '').trim();
    const obs = (data['บันทึกช่อง2_ติดขัดตรงไหน'] || '').trim();
    const eth = (data['บันทึกช่อง3_จริยธรรมดิจิทัลและวิธีแก้'] || '').trim();
    const plan = (data['แผนถ่ายทอดให้ทีม10นาที'] || '').trim();

    const isDup = this.hasDuplicateAnswers([act, obs, eth, plan]);

    // 1. r7_action (เต็ม 2): การนำเครื่องมือไปใช้กับงานจริง
    let sc1 = 0;
    if (!isDup && this.isMeaningfulText(toolGoal, 12) && this.isMeaningfulText(act, 18)) {
      sc1 = 2;
    } else if (this.isMeaningfulText(toolGoal, 8) || this.isMeaningfulText(act, 10)) {
      sc1 = 1;
    }

    // 2. r7_ethics (เต็ม 3): ความลึกของการสะท้อนคิด รวมมิติจริยธรรมดิจิทัล
    const hasEthicsKeywords = /(ลิขสิทธิ์|pdpa|ข้อมูลส่วนบุคคล|เครดิต|อ้างอิง|ความถูกต้อง|ปลอดภัย|ภาพ|ฟอนต์|เพลง|ผู้ปกครอง|ยินยอม|จริยธรรม|ตรวจสอบ)/i.test(eth);
    let sc2 = 1;
    if (!isDup && this.isMeaningfulText(obs, 12) && this.isMeaningfulText(eth, 18) && hasEthicsKeywords) {
      sc2 = 3;
    } else if (!isDup && this.isMeaningfulText(eth, 12)) {
      sc2 = 2;
    }

    // 3. r7_sharing (เต็ม 3): ความเป็นไปได้ในการถ่ายทอดสู่ทีม
    const hasSharingKeywords = /(ประชุม|ครู|นาที|พัก|สาธิต|สอน|แนะนำ|แชร์|แลกเปลี่ยน|ทีม|วัน)/i.test(plan);
    let sc3 = 1;
    if (!isDup && this.isMeaningfulText(plan, 20) && hasSharingKeywords) {
      sc3 = 3;
    } else if (!isDup && this.isMeaningfulText(plan, 12)) {
      sc3 = 2;
    }

    // 4. r7_punctual (เต็ม 2): ความครบถ้วนสมบูรณ์และการส่งงานตามกำหนด
    const allFilled = [toolGoal, act, obs, eth, plan].every(t => this.isMeaningfulText(t, 10));
    let sc4 = (!isDup && allFilled) ? 2 : (sc1 >= 1 && sc2 >= 2) ? 1 : 0;

    return this.buildResult('3.1', [
      {
        id: 'r7_action',
        title: 'การนำเครื่องมือไปใช้กับงานจริง',
        score: sc1,
        max: 2,
        comment: sc1 === 2 ? 'ระบุเครื่องมือ เป้าหมาย และบันทึกผลการทดลองใช้กับงานจริงได้อย่างชัดเจน' : 'ควรระบุเครื่องมือดิจิทัลและผลลัพธ์จากการทดลองทำชิ้นงานจริงให้ชัดเจนขึ้น',
        sug: sc1 < 2 ? 'ระบุว่าใช้เครื่องมือใด ทำชิ้นงานอะไร และประหยัดเวลาหรือได้ผลลัพธ์อย่างไร' : undefined
      },
      {
        id: 'r7_ethics',
        title: 'ความลึกของการสะท้อนคิด รวมมิติจริยธรรมดิจิทัล',
        score: sc2,
        max: 3,
        comment: sc2 === 3 ? 'สะท้อนจุดที่ติดขัดและระบุแนวทางจัดการด้านจริยธรรมดิจิทัล/ลิขสิทธิ์/PDPA ได้อย่างครบถ้วน' : isDup ? 'พบข้อความซ้ำกันในช่องบันทึก กรุณาแยกเขียนแต่ละช่องตามจริง' : 'ควรระบุประเด็นด้านลิขสิทธิ์สื่อ การคุ้มครองข้อมูลส่วนบุคคล (PDPA) หรือการตรวจสอบความถูกต้องของข้อมูลเพิ่มเติม',
        sug: sc2 < 3 ? 'ในช่องที่ 3 ให้ระบุประเด็นลิขสิทธิ์ภาพ/ฟอนต์ หรือข้อมูลส่วนบุคคลของนักเรียน และวิธีป้องกันแก้ไข' : undefined
      },
      {
        id: 'r7_sharing',
        title: 'ความเป็นไปได้ในการถ่ายทอดสู่ทีม',
        score: sc3,
        max: 3,
        comment: sc3 === 3 ? 'แผนการถ่ายทอด 10 นาทีระบุจังหวะเวลา กลุ่มครู และสิ่งที่จะสาธิตได้เหมาะสมและทำได้จริง' : 'ควรระบุช่วงเวลา กลุ่มเป้าหมาย และหัวข้อที่จะสาธิตให้ทีมครูภายใน 10 นาทีให้ชัดเจน',
        sug: sc3 < 3 ? 'ระบุว่าจะถ่ายทอดเมื่อไร (เช่น ก่อนประชุมครู 10 นาที) ให้ใคร และสาธิตขั้นตอนใด' : undefined
      },
      {
        id: 'r7_punctual',
        title: 'ความตรงต่อเวลาส่งงาน',
        score: sc4,
        max: 2,
        comment: sc4 === 2 ? 'บันทึกข้อมูลครบทุกช่องตามกรอบเวลาด้วยความตั้งใจ' : 'กรุณากรอกข้อมูลทั้ง 3 ช่องและแผนการถ่ายทอดให้ครบถ้วนโดยไม่คัดลอกข้อความซ้ำกัน'
      }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 3.2: ผังการทำงานทีม 3 เสาหลักบน Cloud
  // เกณฑ์ตรงกับ UNITS_DATA['3.2'].rubric: r8_steps (4), r8_tool (4), r8_clarity (2)
  // --------------------------------------------------------------------------
  private static eval3_2(data: Record<string, any>): UnitEvaluationResult {
    const task = (data['ชื่องานและบทบาทสมาชิก'] || '').trim();
    const comm = (data['เสาหลัก1_การสื่อสาร'] || '').trim();
    const drive = (data['เสาหลัก2_การแบ่งปันไฟล์'] || '').trim();
    const track = (data['เสาหลัก3_การติดตามงาน'] || '').trim();

    const isDup = this.hasDuplicateAnswers([comm, drive, track]);

    // 1. r8_steps (เต็ม 4): ความครบถ้วนของขั้นตอนการทำงานทีม 3 เสาหลัก
    let sc1 = 1;
    if (
      !isDup &&
      this.isMeaningfulText(task, 12) &&
      this.isMeaningfulText(comm, 15) &&
      this.isMeaningfulText(drive, 20) &&
      this.isMeaningfulText(track, 15)
    ) {
      sc1 = 4;
    } else if (!isDup && this.isMeaningfulText(comm, 10) && this.isMeaningfulText(drive, 12) && this.isMeaningfulText(track, 10)) {
      sc1 = 2;
    }

    // 2. r8_tool (เต็ม 4): ความเหมาะสมของเครื่องมือและระบบไฟล์กลาง
    const hasCloudKeywords = /(drive|ไดรฟ์|cloud|คลาวด์|โฟลเดอร์|folder|แชร์|สิทธิ์|ชื่อไฟล์|sheets|ชีต|line|ไลน์)/i.test(comm + drive + track);
    let sc2 = 1;
    if (!isDup && this.isMeaningfulText(drive, 20) && hasCloudKeywords) {
      sc2 = 4;
    } else if (!isDup && this.isMeaningfulText(drive, 12)) {
      sc2 = 2;
    }

    // 3. r8_clarity (เต็ม 2): ความชัดเจนของการนำเสนอและบทบาทสมาชิก
    let sc3 = (!isDup && sc1 === 4 && sc2 === 4) ? 2 : (!isDup && sc1 >= 2) ? 1 : 0;

    return this.buildResult('3.2', [
      {
        id: 'r8_steps',
        title: 'ความครบถ้วนของขั้นตอนการทำงานทีม',
        score: sc1,
        max: 4,
        comment: sc1 === 4 ? 'ออกแบบขั้นตอนครบทั้งการสื่อสาร การแบ่งปันไฟล์ และการติดตามงาน พร้อมระบุบทบาทชัดเจน' : isDup ? 'พบข้อความซ้ำกันในเสาหลักทั้ง 3 ด้าน กรุณาเขียนแยกแต่ละเสาหลักให้ชัดเจน' : 'ควรระบุรายละเอียดให้ครบทั้งชื่องาน บทบาทสมาชิก และขั้นตอนทั้ง 3 เสาหลัก',
        sug: sc1 < 4 ? 'ระบุรายละเอียดทั้งเสาหลักที่ 1 (การสื่อสาร), เสาหลักที่ 2 (การแชร์ไฟล์), และเสาหลักที่ 3 (การติดตามงาน)' : undefined
      },
      {
        id: 'r8_tool',
        title: 'ความเหมาะสมของเครื่องมือ',
        score: sc2,
        max: 4,
        comment: sc2 === 4 ? 'เลือกใช้เครื่องมือ Cloud (เช่น Google Drive/Sheets) กำหนดโครงสร้างโฟลเดอร์ กฎการตั้งชื่อ และผู้ดูแลไฟล์กลางได้เหมาะสม' : 'ควรอธิบายการจัดโฟลเดอร์กลางบน Cloud การตั้งชื่อไฟล์ และสิทธิ์การเข้าถึงให้ชัดเจนขึ้น',
        sug: sc2 < 4 ? 'ระบุชื่อโฟลเดอร์กลาง กฎการตั้งชื่อไฟล์ สิทธิ์การแก้ไข และผู้รับผิดชอบดูแลไฟล์หลัก' : undefined
      },
      {
        id: 'r8_clarity',
        title: 'ความชัดเจนของการนำเสนอ',
        score: sc3,
        max: 2,
        comment: sc3 === 2 ? 'ผังขั้นตอนชัดเจน เข้าใจง่าย ทีมงานนำไปปฏิบัติตามได้ทันที' : 'ควรเพิ่มเติมรายละเอียดบทบาทและกำหนดเวลาส่งงานให้ชัดเจนยิ่งขึ้น'
      }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 4.1: การสร้างวิสัยทัศน์เชิงดิจิทัล
  // เกณฑ์ตรงกับ UNITS_DATA['4.1'].rubric: r9_vision (4), r9_participate (4), r9_creative (2)
  // --------------------------------------------------------------------------
  private static eval4_1(data: Record<string, any>): UnitEvaluationResult {
    const p1 = (data['คำตอบนำทาง_ด้านผู้เรียน'] || '').trim();
    const p2 = (data['คำตอบนำทาง_ด้านครู'] || '').trim();
    const p3 = (data['คำตอบนำทาง_ด้านชุมชน'] || '').trim();
    const vision = (data['วิสัยทัศน์ดิจิทัล'] || '').trim();
    const forum = (data['แผนเวทีระดมความเห็น'] || '').trim();
    const channel = (data['ช่องทางสื่อสารวิสัยทัศน์'] || '').trim();

    const isPromptsDup = this.hasDuplicateAnswers([p1, p2, p3]);

    // 1. r9_vision (เต็ม 4): ความชัดเจนและวัดผลได้ของวิสัยทัศน์
    const hasTime = /(ปี|ภาคเรียน|256|257|ภายใน)/i.test(vision);
    const hasStakeholders = /(นักเรียน|ผู้เรียน|เด็ก)/i.test(vision) && /(ครู|บุคลากร)/i.test(vision);
    let sc1 = 1;
    if (this.isMeaningfulText(vision, 45) && hasTime && hasStakeholders) {
      sc1 = 4;
    } else if (this.isMeaningfulText(vision, 25)) {
      sc1 = 2;
    }

    // 2. r9_participate (เต็ม 4): ความเป็นไปได้ของแผนสื่อสารและการมีส่วนร่วม
    let sc2 = 1;
    if (
      !this.hasDuplicateAnswers([vision, forum]) &&
      this.isMeaningfulText(forum, 20) &&
      this.isMeaningfulText(channel, 10)
    ) {
      sc2 = 4;
    } else if (this.isMeaningfulText(forum, 12)) {
      sc2 = 2;
    }

    // 3. r9_creative (เต็ม 2): ความคิดสร้างสรรค์และสะท้อนบริบทโรงเรียน (จากคำตอบนำทาง 3 มิติ)
    let sc3 = 0;
    if (!isPromptsDup && this.isMeaningfulText(p1, 12) && this.isMeaningfulText(p2, 12) && this.isMeaningfulText(p3, 12)) {
      sc3 = 2;
    } else if (!isPromptsDup && [p1, p2, p3].filter(p => this.isMeaningfulText(p, 10)).length >= 2) {
      sc3 = 1;
    }

    return this.buildResult('4.1', [
      {
        id: 'r9_vision',
        title: 'ความชัดเจนและวัดผลได้ของวิสัยทัศน์',
        score: sc1,
        max: 4,
        comment: sc1 === 4 ? 'แถลงการณ์วิสัยทัศน์ชัดเจน ระบุกรอบเวลา และครอบคลุมเป้าหมายทั้งด้านผู้เรียนและครูอย่างเป็นรูปธรรม' : 'วิสัยทัศน์ยังสั้นเกินไป หรือขาดการระบุกรอบเวลาและเป้าหมายของนักเรียนและครู',
        sug: sc1 < 4 ? 'เขียนวิสัยทัศน์ความยาว 3-4 ประโยค โดยระบุกรอบเวลา (เช่น "ภายใน 3 ปี...") และผลลัพธ์ที่เกิดกับนักเรียน ครู และชุมชน' : undefined
      },
      {
        id: 'r9_participate',
        title: 'ความเป็นไปได้ของแผนสื่อสารและการมีส่วนร่วม',
        score: sc2,
        max: 4,
        comment: sc2 === 4 ? 'มีแผนจัดเวทีระดมความคิดเห็นและระบุช่องทางสื่อสารวิสัยทัศน์สู่บุคลากรและชุมชนอย่างครบถ้วน' : 'ควรระบุรายละเอียดเวทีระดมความเห็นและช่องทางสื่อสารวิสัยทัศน์ให้ครบถ้วน',
        sug: sc2 < 4 ? 'ระบุรูปแบบเวทีรับฟังความคิดเห็นครู และช่องทางประชาสัมพันธ์วิสัยทัศน์อย่างน้อย 2 ช่องทาง' : undefined
      },
      {
        id: 'r9_creative',
        title: 'ความคิดสร้างสรรค์และสะท้อนบริบทโรงเรียน',
        score: sc3,
        max: 2,
        comment: sc3 === 2 ? 'วิเคราะห์คำตอบนำทางทั้ง 3 มิติ (ผู้เรียน ครู ชุมชน) ได้สอดคล้องกับบริบทโรงเรียนขนาดเล็ก' : 'กรุณาตอบคำถามนำทางทั้ง 3 ด้าน (ผู้เรียน ครู ชุมชน) ให้ครบถ้วนโดยไม่คัดลอกข้อความซ้ำกัน',
        sug: sc3 < 2 ? 'เติมคำตอบนำทางด้านผู้เรียน ด้านครู และด้านชุมชนให้ครบทั้ง 3 ช่อง' : undefined
      }
    ]);
  }

  // --------------------------------------------------------------------------
  // หน่วย 4.2: เจตคติเชิงบวกต่อเทคโนโลยี (TAM Model)
  // เกณฑ์ตรงกับ UNITS_DATA['4.2'].rubric: r10_target (3), r10_quickwin (4), r10_metrics (3)
  // --------------------------------------------------------------------------
  private static eval4_2(data: Record<string, any>): UnitEvaluationResult {
    const concern = (data['กลุ่มเป้าหมายและความกังวล'] || '').trim();
    const format = (data['รูปแบบกิจกรรม'] || '').trim();
    const quickWin = (data['QuickWinที่เห็นผลครั้งเดียว'] || '').trim();
    const schedule = (data['ความถี่และผู้รับผิดชอบ'] || '').trim();
    const quant = (data['ตัวชี้วัดเชิงปริมาณ'] || '').trim();
    const qual = (data['ตัวชี้วัดเชิงคุณภาพ'] || '').trim();

    const isDup = this.hasDuplicateAnswers([concern, quickWin, quant, qual]);

    // 1. r10_target (เต็ม 3): ความตรงจุดต่อความกังวลของครู
    let sc1 = 1;
    if (!isDup && this.isMeaningfulText(concern, 15) && /(ครู|กังวล|กลัว|ไม่คล่อง|ภาระ|เวลา|ยาก|พัง)/i.test(concern)) {
      sc1 = 3;
    } else if (!isDup && this.isMeaningfulText(concern, 10)) {
      sc1 = 2;
    }

    // 2. r10_quickwin (เต็ม 4): การออกแบบ Quick Win ที่เห็นประโยชน์จริงและใช้ง่าย (TAM)
    let sc2 = 1;
    if (
      !isDup &&
      this.isMeaningfulText(format, 12) &&
      this.isMeaningfulText(quickWin, 20) &&
      this.isMeaningfulText(schedule, 10)
    ) {
      sc2 = 4;
    } else if (!isDup && this.isMeaningfulText(quickWin, 12)) {
      sc2 = 2;
    }

    // 3. r10_metrics (เต็ม 3): ความชัดเจนของตัวชี้วัดความสำเร็จ (ทั้งปริมาณและคุณภาพ)
    let sc3 = 1;
    if (
      !isDup &&
      !this.hasDuplicateAnswers([quant, qual]) &&
      this.isMeaningfulText(quant, 12) &&
      this.isMeaningfulText(qual, 12)
    ) {
      sc3 = 3;
    } else if (!isDup && (this.isMeaningfulText(quant, 10) || this.isMeaningfulText(qual, 10))) {
      sc3 = 2;
    }

    return this.buildResult('4.2', [
      {
        id: 'r10_target',
        title: 'ความตรงจุดต่อความกังวลของครู',
        score: sc1,
        max: 3,
        comment: sc1 === 3 ? 'วิเคราะห์กลุ่มเป้าหมายและความกังวลของครูได้ตรงจุดด้วยความเข้าอกเข้าใจ (Empathy)' : 'ควรระบุกลุ่มครูเป้าหมายและสาเหตุความกังวลต่อเทคโนโลยีให้ชัดเจนขึ้น',
        sug: sc1 < 3 ? 'ระบุกลุ่มครูและสิ่งที่ครูกังวล เช่น กลัวทำเครื่องรวน กลัวจำขั้นตอนไม่ได้ หรือกลัวเพิ่มงาน' : undefined
      },
      {
        id: 'r10_quickwin',
        title: 'การออกแบบ Quick Win ที่เห็นประโยชน์จริงและใช้ง่าย (TAM)',
        score: sc2,
        max: 4,
        comment: sc2 === 4 ? 'ออกแบบรูปแบบกิจกรรม ความถี่ และเทคนิค Quick Win ที่ใช้ง่ายและลดภาระงานได้ทันทีตามหลัก TAM' : 'ควรระบุรูปแบบกิจกรรม ความถี่ผู้รับผิดชอบ และรายละเอียด Quick Win ให้ครบถ้วน',
        sug: sc2 < 4 ? 'ระบุทั้งรูปแบบกิจกรรมบรรยากาศเป็นกันเอง ความถี่ และเครื่องมือที่ช่วยให้เห็นผลสำเร็จในครั้งเดียว' : undefined
      },
      {
        id: 'r10_metrics',
        title: 'ความชัดเจนของตัวชี้วัดความสำเร็จ',
        score: sc3,
        max: 3,
        comment: sc3 === 3 ? 'กำหนดตัวชี้วัดความสำเร็จครบทั้งเชิงปริมาณและเชิงคุณภาพได้อย่างชัดเจน' : 'ควรระบุตัวชี้วัดให้ครบทั้งเชิงปริมาณ (จำนวน/ร้อยละ) และเชิงคุณภาพ (ความมั่นใจ/เจตคติ) โดยไม่ซ้ำกัน',
        sug: sc3 < 3 ? 'กรอกตัวชี้วัดเชิงปริมาณ (เช่น ร้อยละของครูที่ทำสำเร็จ) และตัวชี้วัดเชิงคุณภาพ (เช่น ความมั่นใจที่เพิ่มขึ้น)' : undefined
      }
    ]);
  }

  // Fallback
  private static fallbackEval(unitId: string, data: Record<string, any>): UnitEvaluationResult {
    const keys = Object.keys(data).filter(k => !k.startsWith('ตรวจ_'));
    const filled = keys.filter(k => this.isMeaningfulText(String(data[k] || ''), 15)).length;
    const ratio = keys.length > 0 ? filled / keys.length : 0;
    const totalScore = Math.min(10, Math.max(2, Math.round(ratio * 10)));
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
