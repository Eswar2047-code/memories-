/**
 * ==============================================================================
 * Google Apps Script Web App for "The Classroom of Memories" Teachers' Day App
 * ==============================================================================
 *
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open your Google Sheet that contains your Google Form responses.
 * 2. In Google Sheets, click "Extensions" -> "Apps Script".
 * 3. Delete any code in the script editor and paste this entire file.
 * 4. Click "Deploy" (top right) -> "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Configuration:
 *    - Description: "Teacher Data API"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (CRITICAL: must be "Anyone" so the website can fetch it)
 * 7. Click "Deploy" and authorize access when prompted.
 * 8. Copy the "Web app URL" (ends in /exec).
 * 9. Add it to your project's .env file:
 *    VITE_TEACHER_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 * ==============================================================================
 */

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const teacherId = params.teacherId ? String(params.teacherId).trim() : null;
    const action = params.action ? String(params.action).trim().toLowerCase() : "";

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return jsonResponse({
        success: false,
        error: "NO_DATA_IN_SHEET",
        message: "The Google Sheet contains no responses yet.",
      });
    }

    const headers = data[0].map((h) => String(h || "").trim());
    const headerMap = buildHeaderMap(headers);

    const teachers = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const teacher = mapRowToTeacher(row, headerMap);
      if (teacher && teacher.id) {
        teachers.push(teacher);
      }
    }

    // Action: list all teachers (used by /admin/teachers)
    if (action === "list") {
      return jsonResponse({
        success: true,
        count: teachers.length,
        teachers: teachers.map((t) => ({
          id: t.id,
          name: t.name,
          salutation: t.salutation,
          subject: t.subject,
          department: t.department,
          specialQuality: t.specialQuality,
          hasMessage: Boolean(t.message),
          hasPhoto: Boolean(t.photo),
        })),
      });
    }

    // Action: get specific teacher by teacherId
    if (!teacherId) {
      return jsonResponse({
        success: false,
        error: "MISSING_TEACHER_ID",
        message: "Please provide a teacherId query parameter. Example: ?teacherId=001",
      });
    }

    const normalizedQueryId = normalizeId(teacherId);
    const matched = teachers.find((t) => normalizeId(t.id) === normalizedQueryId);

    if (!matched) {
      return jsonResponse({
        success: false,
        error: "TEACHER_NOT_FOUND",
        message: "No teacher found with ID: " + teacherId,
      });
    }

    return jsonResponse({
      success: true,
      teacher: matched,
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: "SERVER_ERROR",
      message: error.toString(),
    });
  }
}

/**
 * Normalizes IDs for case-insensitive, whitespace-trimmed comparison.
 */
function normalizeId(id) {
  return String(id || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Maps header names flexibly, supporting both short names and Google Form full questions.
 */
function buildHeaderMap(headers) {
  const map = {};

  headers.forEach((h, index) => {
    const clean = h.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (clean.includes("teacherid") || clean === "id") {
      map.id = index;
    } else if (clean.includes("teachername") || clean === "name") {
      map.name = index;
    } else if (
      clean.includes("sirmadam") ||
      clean.includes("addressyou") ||
      clean.includes("salutation")
    ) {
      map.salutation = index;
    } else if (clean.includes("subject")) {
      map.subject = index;
    } else if (clean.includes("department")) {
      map.department = index;
    } else if (clean.includes("specialquality") || clean.includes("quality")) {
      map.specialQuality = index;
    } else if (
      clean.includes("memorablemoment") ||
      clean.includes("memory") ||
      clean.includes("conversation")
    ) {
      map.memory = index;
    } else if (
      clean.includes("whatilearned") ||
      clean.includes("lesson") ||
      clean.includes("lifeadvice")
    ) {
      map.lesson = index;
    } else if (clean.includes("personalmessage") || clean.includes("message")) {
      map.message = index;
    } else if (clean.includes("quote")) {
      map.quote = index;
    } else if (clean.includes("photo") || clean.includes("image") || clean.includes("picture")) {
      map.photo = index;
    }
  });

  return map;
}

/**
 * Converts a single row into a structured Teacher object.
 */
function mapRowToTeacher(row, map) {
  const rawId = map.id !== undefined ? String(row[map.id] || "").trim() : "";
  if (!rawId) return null;

  let photoUrl = map.photo !== undefined ? String(row[map.photo] || "").trim() : "";
  photoUrl = formatDrivePhotoUrl(photoUrl);

  return {
    id: rawId,
    name: map.name !== undefined ? String(row[map.name] || "").trim() : "",
    salutation: map.salutation !== undefined ? String(row[map.salutation] || "").trim() : "Teacher",
    subject: map.subject !== undefined ? String(row[map.subject] || "").trim() : "",
    department: map.department !== undefined ? String(row[map.department] || "").trim() : "",
    specialQuality:
      map.specialQuality !== undefined ? String(row[map.specialQuality] || "").trim() : "",
    memory: map.memory !== undefined ? String(row[map.memory] || "").trim() : "",
    lesson: map.lesson !== undefined ? String(row[map.lesson] || "").trim() : "",
    message: map.message !== undefined ? String(row[map.message] || "").trim() : "",
    quote: map.quote !== undefined ? String(row[map.quote] || "").trim() : "",
    photo: photoUrl,
  };
}

/**
 * Converts Google Drive share links to direct image thumbnail URLs so they render reliably.
 * Also attempts to set public link viewing permission so the image renders directly in <img> tags.
 */
function formatDrivePhotoUrl(url) {
  if (!url) return "";

  let fileId = null;

  // Pattern 1: https://drive.google.com/open?id=FILE_ID or https://drive.google.com/uc?id=FILE_ID
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    fileId = matchId[1];
  }

  // Pattern 2: https://drive.google.com/file/d/FILE_ID/...
  const matchPath = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchPath && matchPath[1]) {
    fileId = matchPath[1];
  }

  if (fileId) {
    // Automatically set the file to "Anyone with the link can view" so external browsers can load it
    try {
      const file = DriveApp.getFileById(fileId);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
      Logger.log("Notice: Could not automatically update sharing for file " + fileId + ": " + e);
    }

    return "https://lh3.googleusercontent.com/d/" + fileId;
  }

  return url;
}

/**
 * Helper to return a JSON response with CORS headers.
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
