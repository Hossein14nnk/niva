const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// فولدر پروژه (می‌تونی تغییر بدی)
const rootDir = __dirname;

// اگر خواستی محدودش کنی:
const ignoreDirs = ["node_modules", ".git", "output", "build"];

deleteEJS(rootDir);

console.log("✅ All .ejs files deleted successfully!");


// تابع اصلی
function deleteEJS(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    // skip ignore dirs
    if (file.isDirectory()) {
      if (!ignoreDirs.includes(file.name)) {
        deleteEJS(fullPath);
      }
    } else {
      if (file.name.endsWith(".ejs")) {
        fs.unlinkSync(fullPath);
        console.log("🗑 Deleted:", fullPath);
      }
    }
  }
}