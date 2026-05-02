// ================== CONFIG ==================
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

// ================== MAIN FUNCTION ==================
function sendDailyEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const lastRow = sheet.getLastRow();
  if (lastRow < 8) return;

  const dataRange = sheet.getRange(8, 2, lastRow - 7, 6);
  const data = dataRange.getValues();

  for (let i = 0; i < data.length; i++) {
    const email = data[i][1];
    const status = data[i][4];
    const prompt = data[i][5];

    // Skip if no email or already sent
    if (!email || status === "Sent") continue;

    let sentSuccessfully = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!sentSuccessfully && attempts < maxAttempts) {
      attempts++;
      try {
        sheet.getRange(8 + i, 6).setValue(
          attempts > 1 ? `Retrying (${attempts})...` : "Processing..."
        );
        SpreadsheetApp.flush();

        // 1. Generate Email Content
        const aiResponse = callGeminiAPI(prompt);

        // 2. Extract Subject & Body
        let subject = "Thinking of you";
        let body = aiResponse;

        if (aiResponse.toLowerCase().includes("body:")) {
          const parts = aiResponse.split(/body:/i);
          subject = parts[0].replace(/subject:/i, "").trim() || subject;
          if (parts.length > 1) body = parts[1].trim();
        }

        // 3. Send Email
        GmailApp.sendEmail(email, subject, body);

        // 4. Update Sheet
        sheet.getRange(8 + i, 5).setValue(new Date()); // timestamp
        sheet.getRange(8 + i, 6).setValue("Sent");

        sentSuccessfully = true;

        // Delay before next person
        Utilities.sleep(4000);

      } catch (e) {
        Logger.log(`Error on attempt ${attempts} for ${email}: ${e.message}`);

        if (attempts >= maxAttempts) {
          sheet.getRange(8 + i, 6).setValue("Error");
        } else {
          Utilities.sleep(4000);
        }
      }
    }
  }

  // 🔥 Schedule reset AFTER execution (4 seconds later)
  scheduleResetTrigger();
}

// ================== GEMINI API ==================
function callGeminiAPI(prompt) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7 }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());

  if (json.error) {
    throw new Error(json.error.message);
  }

  return json.candidates[0].content.parts[0].text;
}

// ================== RESET FUNCTION ==================
function resetDailyStatus() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const lastRow = sheet.getLastRow();
  if (lastRow < 8) return;

  const statusRange = sheet.getRange(8, 6, lastRow - 7, 1);
  const values = statusRange.getValues();

  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === "Sent") {
      values[i][0] = "Pending";
    }
  }

  statusRange.setValues(values);

  // 🧹 Clean up triggers (CRITICAL)
  const triggers = ScriptApp.getProjectTriggers();
  for (let t of triggers) {
    if (t.getHandlerFunction() === "resetDailyStatus") {
      ScriptApp.deleteTrigger(t);
    }
  }
}

// ================== TRIGGER SETUP ==================
function scheduleResetTrigger() {
  // Remove existing reset triggers (avoid duplicates)
  const triggers = ScriptApp.getProjectTriggers();
  for (let t of triggers) {
    if (t.getHandlerFunction() === "resetDailyStatus") {
      ScriptApp.deleteTrigger(t);
    }
  }

  // Create new trigger (4 sec later)
  ScriptApp.newTrigger("resetDailyStatus")
    .timeBased()
    .after(4000)
    .create();
}