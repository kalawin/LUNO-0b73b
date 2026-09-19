/**
 * Luno E-Learning Platform - Google Apps Script Backend
 * รองรับการทำงานวิจัยระยะที่ 3-4 (โปรแกรมพัฒนาภาวะผู้นำดิจิทัล 4 ด่านต่อเนื่อง)
 * Google Sheet ID: 1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk
 */

const TARGET_SPREADSHEET_ID = "1LeSBKpY0HW3jjsoRdWmynbQnJGuWE6TyJV5PIq8Zyzk";

// รายชื่อแท็บฐานข้อมูล
const SHEETS = {
  USERS_PROGRESS: "users_progress",
  QUIZ_SCORES: "quiz_scores",
  MODEL_EVALUATION: "model_evaluation"
};

/**
 * ฟังก์ชันสำหรับ Setup ฐานข้อมูลใน Google Sheet อัตโนมัติในคลิกเดียว
 * วิธีใช้: เปิด Google Apps Script Editor แล้วกด Run ฟังก์ชัน setupDatabase()
 */
function setupDatabase() {
  const ss = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
  
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

  Logger.log("✅ Setup Luno Database เสร็จสมบูรณ์แล้วทุกแท็บ!");
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

    const ss = SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
    let result = { status: "success", action: action, timestamp: new Date().toISOString() };

    switch (action) {
      case "ping":
        result.message = "Luno Backend API is active and ready.";
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
        result.status = "error";
        result.message = "Unknown action: " + action;
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
