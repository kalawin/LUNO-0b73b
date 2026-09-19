/**
 * Luno E-Learning Platform - Google Apps Script Backend
 * รองรับการทำงานวิจัยระยะที่ 3-4 (โปรแกรมพัฒนาภาวะผู้นำดิจิทัล 4 ด่านต่อเนื่อง)
 */

// หากสร้าง Apps Script จากเมนู "ส่วนขยาย -> Apps Script" ในชีท ระบบจะเชื่อมต่อกับชีทนั้นให้อัตโนมัติ
// หรือระบุ Spreadsheet ID หากต้องการเชื่อมต่อจากภายนอก
const BACKUP_SPREADSHEET_ID = "1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk";

function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {
    // fallback
  }
  return SpreadsheetApp.openById(BACKUP_SPREADSHEET_ID);
}

// รายชื่อแท็บฐานข้อมูล
const SHEETS = {
  USERS_PROGRESS: "users_progress",
  QUIZ_SCORES: "quiz_scores",
  MODEL_EVALUATION: "model_evaluation",
  DATA1: "data1"
};

/**
 * ฟังก์ชันสำหรับ Setup ฐานข้อมูลใน Google Sheet อัตโนมัติในคลิกเดียว
 * วิธีใช้: เปิด Google Apps Script Editor แล้วกด Run ฟังก์ชัน setupDatabase()
 */
function setupDatabase() {
  const ss = getSpreadsheet();

  
  // 1. ตั้งค่าแท็บ users_progress
  let pSheet = ss.getSheetByName(SHEETS.USERS_PROGRESS);
  if (!pSheet) pSheet = ss.insertSheet(SHEETS.USERS_PROGRESS);
  const pHeaders = [
    "user_id", "name", "school", "current_step",
    "pre_test_status", "level_1_status", "level_2_status", "level_3_status", "level_4_status",
    "post_test_status", "evaluation_status", "last_active_at"
  ];
  setupSheetHeaders(pSheet, pHeaders, "#1e3a8a"); // สีน้ำเงินเข้ม
  
  // 2. ตั้งค่าแท็บ quiz_scores
  let qSheet = ss.getSheetByName(SHEETS.QUIZ_SCORES);
  if (!qSheet) qSheet = ss.insertSheet(SHEETS.QUIZ_SCORES);
  const qHeaders = [
    "user_id", "name", "pre_score", "post_score", "diff_score",
    "pre_answers_json", "post_answers_json", "completed_at"
  ];
  setupSheetHeaders(qSheet, qHeaders, "#065f46"); // สีเขียวเข้ม
  
  // 3. ตั้งค่าแท็บ model_evaluation
  let eSheet = ss.getSheetByName(SHEETS.MODEL_EVALUATION);
  if (!eSheet) eSheet = ss.insertSheet(SHEETS.MODEL_EVALUATION);
  const eHeaders = [
    "user_id", "name", "school",
    "propriety_avg", "feasibility_avg", "utility_avg", "total_avg",
    "eval_details_json", "comments", "evaluated_at"
  ];
  setupSheetHeaders(eSheet, eHeaders, "#831843"); // สีชมพู/แดงเข้ม

  // 4. ตั้งค่าแท็บ data1 (สำหรับเก็บข้อมูล Telemetry ทั้งหมดตาม Canvas ของผู้บริหาร)
  let dSheet = ss.getSheetByName(SHEETS.DATA1);
  if (!dSheet) dSheet = ss.insertSheet(SHEETS.DATA1);
  const dHeaders = [
    "user_id", "ชื่อ", "นามสกุล", "โรงเรียน", "กิจกรรมล่าสุด",
    "คะแนนก่อนเรียน", "คะแนนหลังเรียน", "อัตราพัฒนาการ",
    "สถานะด่าน1", "สถานะด่าน2", "สถานะด่าน3", "สถานะด่าน4",
    "วิสัยทัศน์ที่สร้าง", "ความพึงพอใจเฉลี่ย", "รหัสเกียรติบัตร", "เวลาบันทึกล่าสุด"
  ];
  setupSheetHeaders(dSheet, dHeaders, "#991b1b"); // สีแดงเข้มตามธีม Luno

  Logger.log("✅ Setup Luno Database เสร็จสมบูรณ์แล้วทุกแท็บ (รวมถึง data1)!");
}

function setupSheetHeaders(sheet, headers, bgColor) {
  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  range.setFontWeight("bold");
  range.setBackground(bgColor);
  range.setFontColor("#ffffff");
  range.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Handle HTTP GET Request
 */
function doGet(e) {
  return handleRequest(e);
}

/**
 * Handle HTTP POST Request
 */
function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(15000); // Concurrency Lock ป้องกันการเขียนชนกัน

  try {
    const callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : null;
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
    const rawData = (e && e.parameter && e.parameter.data) ? e.parameter.data : "{}";
    
    let payload = {};
    try {
      payload = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
    } catch (err) {
      payload = {};
    }

    const ss = getSpreadsheet();
    let result = { status: "success", action: action, timestamp: new Date().toISOString() };

    switch (action) {
      case "ping":
        result.message = "Luno Backend API is active and ready.";
        break;

      case "saveData1":
      case "telemetry":
        result.data = handleSaveData1(ss, payload, (e && e.parameter && e.parameter.sheetName) || "data1");
        break;

      case "saveProgress":
        result.data = handleSaveProgress(ss, payload);
        break;

      case "getProgress":
        const userId = (e && e.parameter && e.parameter.userId) ? e.parameter.userId : payload.user_id;
        result.data = handleGetProgress(ss, userId);
        break;

      case "submitQuiz":
        result.data = handleSubmitQuiz(ss, payload);
        break;

      case "submitEvaluation":
        result.data = handleSubmitEvaluation(ss, payload);
        break;

      default:
        // หากส่ง sheetName มา หรือเป็นข้อมูลดิบ ให้ใช้ handleSaveData1
        if (e && e.parameter && e.parameter.sheetName) {
          result.data = handleSaveData1(ss, payload, e.parameter.sheetName);
        } else {
          result.status = "error";
          result.message = "Unknown action: " + action;
        }
    }

    return createResponse(result, callback);

  } catch (error) {
    const callback = (e && e.parameter && e.parameter.callback) ? e.parameter.callback : null;
    const errorResult = {
      status: "error",
      message: error.toString()
    };
    return createResponse(errorResult, callback);

  } finally {
    lock.releaseLock();
  }
}

/**
 * ฟังก์ชันบันทึกและอัปเดตความก้าวหน้า (Update หรือ Insert คนเดิม)
 */
function handleSaveProgress(ss, data) {
  const sheet = ss.getSheetByName(SHEETS.USERS_PROGRESS);
  if (!sheet) throw new Error("Sheet not found: " + SHEETS.USERS_PROGRESS);

  const userId = String(data.user_id || "").trim();
  if (!userId) throw new Error("user_id is required");

  const lastRow = sheet.getLastRow();
  let targetRow = -1;

  if (lastRow > 1) {
    const userIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < userIds.length; i++) {
      if (String(userIds[i][0]).trim() === userId) {
        targetRow = i + 2;
        break;
      }
    }
  }

  const rowData = [
    userId,
    data.name || "",
    data.school || "",
    data.current_step || "pre-test",
    data.pre_test_status || "NOT_STARTED",
    data.level_1_status || "LOCKED",
    data.level_2_status || "LOCKED",
    data.level_3_status || "LOCKED",
    data.level_4_status || "LOCKED",
    data.post_test_status || "LOCKED",
    data.evaluation_status || "LOCKED",
    new Date().toISOString()
  ];

  if (targetRow > 0) {
    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }

  return { saved: true, user_id: userId, current_step: data.current_step };
}

/**
 * ฟังก์ชันดึงจุดที่ค้างไว้ของ ผู้บริหาร
 */
function handleGetProgress(ss, userId) {
  const sheet = ss.getSheetByName(SHEETS.USERS_PROGRESS);
  if (!sheet) return null;

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null;

  const uid = String(userId || "").trim();
  const data = sheet.getRange(2, 1, lastRow - 1, 12).getValues();

  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === uid) {
      return {
        user_id: data[i][0],
        name: data[i][1],
        school: data[i][2],
        current_step: data[i][3],
        pre_test_status: data[i][4],
        level_1_status: data[i][5],
        level_2_status: data[i][6],
        level_3_status: data[i][7],
        level_4_status: data[i][8],
        post_test_status: data[i][9],
        evaluation_status: data[i][10],
        last_active_at: data[i][11]
      };
    }
  }

  return null;
}

/**
 * บันทึกผลสอบ Pre-test หรือ Post-test
 */
function handleSubmitQuiz(ss, data) {
  const sheet = ss.getSheetByName(SHEETS.QUIZ_SCORES);
  if (!sheet) throw new Error("Sheet not found: " + SHEETS.QUIZ_SCORES);

  const userId = String(data.user_id || "").trim();
  const quizType = data.quiz_type; // "pre" หรือ "post"
  const score = Number(data.score || 0);

  const lastRow = sheet.getLastRow();
  let targetRow = -1;

  if (lastRow > 1) {
    const userIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = 0; i < userIds.length; i++) {
      if (String(userIds[i][0]).trim() === userId) {
        targetRow = i + 2;
        break;
      }
    }
  }

  if (targetRow > 0) {
    // อัปเดตแถวเดิม
    if (quizType === "pre") {
      sheet.getRange(targetRow, 3).setValue(score);
      sheet.getRange(targetRow, 6).setValue(JSON.stringify(data.answers || {}));
    } else if (quizType === "post") {
      sheet.getRange(targetRow, 4).setValue(score);
      sheet.getRange(targetRow, 7).setValue(JSON.stringify(data.answers || {}));
      
      // คำนวณผลต่าง (Post - Pre)
      const preScore = Number(sheet.getRange(targetRow, 3).getValue() || 0);
      sheet.getRange(targetRow, 5).setValue(score - preScore);
      sheet.getRange(targetRow, 8).setValue(new Date().toISOString());
    }
  } else {
    // เพิ่มแถวใหม่
    const preScore = quizType === "pre" ? score : "";
    const postScore = quizType === "post" ? score : "";
    const diff = (quizType === "post" && preScore !== "") ? (postScore - preScore) : "";
    
    sheet.appendRow([
      userId,
      data.name || "",
      preScore,
      postScore,
      diff,
      quizType === "pre" ? JSON.stringify(data.answers || {}) : "",
      quizType === "post" ? JSON.stringify(data.answers || {}) : "",
      new Date().toISOString()
    ]);
  }

  return { recorded: true, user_id: userId, quiz_type: quizType, score: score };
}

/**
 * บันทึกแบบประเมินรูปแบบการวิจัย
 */
function handleSubmitEvaluation(ss, data) {
  const sheet = ss.getSheetByName(SHEETS.MODEL_EVALUATION);
  if (!sheet) throw new Error("Sheet not found: " + SHEETS.MODEL_EVALUATION);

  const propriety = Number(data.propriety_avg || 0);
  const feasibility = Number(data.feasibility_avg || 0);
  const utility = Number(data.utility_avg || 0);
  const totalAvg = ((propriety + feasibility + utility) / 3).toFixed(2);

  sheet.appendRow([
    data.user_id,
    data.name || "",
    data.school || "",
    propriety,
    feasibility,
    utility,
    totalAvg,
    JSON.stringify(data.details || {}),
    data.comments || "",
    new Date().toISOString()
  ]);

  return { recorded: true, user_id: data.user_id, total_avg: totalAvg };
}

/**
 * บันทึกข้อมูลลงชีท data1 (หรือชีทที่ระบุ) แบบ Dynamic Upsert
 * หากมีรายชื่อนี้อยู่แล้ว จะอัปเดตแถวเดิมให้เป็นสถานะล่าสุด
 * หากยังไม่มี จะเพิ่มแถวใหม่ให้ทันที
 */
function handleSaveData1(ss, data, sheetName) {
  const targetSheetName = sheetName || SHEETS.DATA1;
  let sheet = ss.getSheetByName(targetSheetName);
  
  // หากยังไม่มีชีท ให้สร้างใหม่พร้อม header อัตโนมัติ
  if (!sheet) {
    sheet = ss.insertSheet(targetSheetName);
  }

  // ดึง Headers แถวแรก
  let lastCol = Math.max(1, sheet.getLastColumn());
  let headers = [];
  if (sheet.getLastRow() >= 1) {
    headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
  }

  // หากชีทยังว่างเปล่า ให้สร้าง Headers พื้นฐาน
  if (headers.length === 0 || headers[0] === "") {
    headers = [
      "user_id", "ชื่อ", "นามสกุล", "โรงเรียน", "กิจกรรมล่าสุด",
      "คะแนนก่อนเรียน", "คะแนนหลังเรียน", "อัตราพัฒนาการ",
      "สถานะด่าน1", "สถานะด่าน2", "สถานะด่าน3", "สถานะด่าน4",
      "วิสัยทัศน์ที่สร้าง", "ความพึงพอใจเฉลี่ย", "รหัสเกียรติบัตร", "เวลาบันทึกล่าสุด"
    ];
    setupSheetHeaders(sheet, headers, "#991b1b");
  }

  // หากข้อมูลที่ส่งมามี key แปลกใหม่ที่ยังไม่มีใน header ให้ขยาย header เพิ่ม
  const dataKeys = Object.keys(data);
  let headersUpdated = false;
  for (let i = 0; i < dataKeys.length; i++) {
    const k = dataKeys[i];
    if (k && headers.indexOf(k) === -1) {
      headers.push(k);
      headersUpdated = true;
    }
  }
  if (headersUpdated) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#991b1b").setFontColor("#ffffff");
  }

  // ค้นหาแถวของผู้ใช้คนนี้ (ค้นหาจาก user_id หรือ ชื่อ+นามสกุล)
  const uid = String(data.user_id || "").trim();
  const fname = String(data["ชื่อ"] || data.firstname || "").trim();
  const lname = String(data["นามสกุล"] || data.lastname || "").trim();

  let targetRow = -1;
  const lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    const allData = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
    const uidIdx = headers.indexOf("user_id");
    const fnameIdx = headers.indexOf("ชื่อ");
    const lnameIdx = headers.indexOf("นามสกุล");

    for (let r = 0; r < allData.length; r++) {
      const row = allData[r];
      const matchUid = (uid && uidIdx !== -1 && String(row[uidIdx]).trim() === uid);
      const matchName = (fname && lname && fnameIdx !== -1 && lnameIdx !== -1 &&
        String(row[fnameIdx]).trim() === fname && String(row[lnameIdx]).trim() === lname);

      if (matchUid || matchName) {
        targetRow = r + 2;
        break;
      }
    }
  }

  // สร้างแถวข้อมูลตามลำดับ Header
  const rowValues = [];
  for (let c = 0; c < headers.length; c++) {
    const headerName = headers[c];
    let val = data[headerName];
    if (val === undefined || val === null) {
      // fallback mapping ถ้า key สะกดต่างกันเล็กน้อย
      if (headerName === "เวลาบันทึกล่าสุด" && !val) {
        val = new Date().toLocaleString("th-TH");
      } else {
        val = "";
      }
    }
    rowValues.push(val);
  }

  if (targetRow > 0) {
    // อัปเดตแถวเดิม โดยคงค่าเดิมไว้หากค่าใหม่เป็นค่าว่าง
    const existingRow = sheet.getRange(targetRow, 1, 1, headers.length).getValues()[0];
    for (let c = 0; c < rowValues.length; c++) {
      if ((rowValues[c] === "" || rowValues[c] === undefined) && existingRow[c] !== "" && existingRow[c] !== undefined) {
        rowValues[c] = existingRow[c];
      }
    }
    sheet.getRange(targetRow, 1, 1, headers.length).setValues([rowValues]);
  } else {
    // เพิ่มแถวใหม่
    sheet.appendRow(rowValues);
  }

  return {
    saved: true,
    sheet: targetSheetName,
    row: targetRow > 0 ? targetRow : sheet.getLastRow(),
    user: fname + " " + lname
  };
}

function createResponse(data, callback) {
  if (callback) {
    const output = callback + "(" + JSON.stringify(data) + ");";
    return ContentService.createTextOutput(output)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
