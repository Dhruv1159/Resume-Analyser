//

// backend/utils/fileParser.js
import fs from "fs";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

function safeDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return text; // return raw text if decoding fails
  }
}

export const parseResumeFile = async (filePath, mimetype) => {
  if (mimetype.includes("pdf")) {
    const pdfParser = new PDFParser();

    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        try {
          const text = pdfData.Pages.map((page) =>
            page.Texts.map((t) =>
              safeDecode(t.R.map((r) => r.T).join(""))
            ).join(" ")
          ).join("\n");

          resolve(text);
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));
      pdfParser.loadPDF(filePath);
    });
  } else if (mimetype.includes("word")) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else if (mimetype.includes("plain")) {
    return fs.readFileSync(filePath, "utf8");
  } else {
    throw new Error("Unsupported file format");
  }
};
