import _ from 'lodash';
import ejs from "ejs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// متغیر های گلوبال
const globals = {
  _: _,
  // pathPages: "../../..",
  // pathComponents: "./"
}

// مسیرها
const appDir = path.join(__dirname, "app");
const pagesDir = path.join(appDir, "pages");
const componentsDir = path.join(appDir, "components");
const dataDir = path.join(appDir, "data/languages");
const outputDir = path.join(__dirname, "output");

// فایل‌ها و کامپوننت‌هایی که نباید رندر شوند
const excludePages = ["content.ejs"];
const excludeComponents = ["content.ejs"]; // می‌تونی کامپوننت‌های خاص رو اینجا اضافه کنی

// گرفتن زبان‌ها
const languages = fs.readdirSync(dataDir).map(file => file.replace(".json", ""));

// پاک کردن output
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

// =======================
// FUNCTIONS
// =======================

// تابع کمکی برای پردازش داده های JSON و جایگزینی مسیر فایل html با محتوای آن
async function processJsonData(data, lang, currentDir) {
  let processedData = { ...data }; // کپی از داده های اصلی

  if (processedData.html && typeof processedData.html === 'string') {
    const htmlFilePath = path.join(currentDir, processedData.html); // فرض می کنیم مسیر نسبت به پوشه فعلی است
    if (fs.existsSync(htmlFilePath)) {
      processedData.html = fs.readFileSync(htmlFilePath, 'utf-8');
    } else {
      console.warn(`Warning: HTML file not found at ${htmlFilePath} for lang ${lang}`);
    }
  }

  // اگر داده ها شامل اشیاء تو در تو باشند، باید آنها را نیز به صورت بازگشتی پردازش کنیم
  for (const key in processedData) {
    if (typeof processedData[key] === 'object' && processedData[key] !== null && !Array.isArray(processedData[key])) {
      // اگر بخشی از داده ها خود یک شیء باشد که ممکن است کلید 'html' داشته باشد
      // مسیر پایه برای جستجوی فایل html باید بر اساس منبع اصلی داده ها باشد
      // در اینجا فرض می کنیم که مسیر فایل html در JSON نسبت به پوشه dataDir است
      // شما ممکن است نیاز به تنظیم این بخش بسته به ساختار پروژه خود داشته باشید
      const nestedDataPath = path.join(dataDir, `${lang}.json`); // این مسیر را باید با توجه به ساختار خود تنظیم کنید
      processedData[key] = await processJsonData(processedData[key], lang, path.dirname(nestedDataPath));
    }
  }

  return processedData;
}


async function copyComponents(src, dest, data, lang) {
  fs.mkdirSync(dest, { recursive: true });

  const items = fs.readdirSync(src, { withFileTypes: true });

  // فایل‌های -content را به excludeComponents اضافه کنید
  addToExcludeComponents(src, items);

  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await copyComponents(srcPath, destPath, data, lang);
    } else {
      if (item.name.endsWith(".ejs")) {
        // فقط اگر در excludeComponents نباشد رندر شود
        if (!excludeComponents.includes(item.name)) {
          const outputFile = destPath.replace(".ejs", ".html");
          try {
            // اینجا داده ها را قبل از ارسال به EJS پردازش می کنیم
            const processedPageData = await processJsonData(data, lang, path.dirname(srcPath)); // مسیر فایل EJS به عنوان مبنا برای مسیر دهی فایل html
            const html = await ejs.renderFile(srcPath, { ...globals, t: processedPageData, lang }, { root: appDir });
            fs.writeFileSync(outputFile, html);
          } catch (err) {
            console.error("Error rendering component:", err);
          }
        }
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

function addToExcludeComponents(src, items) {
  items.forEach(item => {
    if (!item.isDirectory() && item.name.endsWith("-content.ejs")) {
      if (!excludeComponents.includes(item.name)) {
        excludeComponents.push(item.name);
      }
    }
  });
}

// =======================
// BUILD PAGES
// =======================
for (const lang of languages) {
  const langJsonPath = path.join(dataDir, `${lang}.json`);
  const langDataRaw = JSON.parse(
    fs.readFileSync(langJsonPath, "utf-8")
  );

  const outPagesDir = path.join(outputDir, lang, "pages");
  fs.mkdirSync(outPagesDir, { recursive: true });

  const pageFiles = fs.readdirSync(pagesDir);

  for (const file of pageFiles) {
    if (file.endsWith(".ejs") && !excludePages.includes(file)) {
      const filePath = path.join(pagesDir, file);

      try {
        // اینجا داده ها را قبل از ارسال به EJS پردازش می کنیم
        const processedPageData = await processJsonData(langDataRaw, lang, pagesDir); // مسیر پوشه pages به عنوان مبنا
        const html = await ejs.renderFile(filePath, { ...globals ,t: processedPageData, lang }, { root: appDir });
        const outputFile = path.join(outPagesDir, file.replace(".ejs", ".html"));
        fs.writeFileSync(outputFile, html);
      } catch (err) {
        console.error("Error rendering page:", err);
      }
    }
  }
}

// =======================
// BUILD COMPONENTS
// =======================
for (const lang of languages) {
  const langJsonPath = path.join(dataDir, `${lang}.json`);
  const langDataRaw = JSON.parse(
    fs.readFileSync(langJsonPath, "utf-8")
  );

  const outComponentsDir = path.join(outputDir, lang, "components");
  await copyComponents(componentsDir, outComponentsDir, langDataRaw, lang);
}

console.log("✅ Build completed successfully!");
