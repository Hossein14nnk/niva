import browserSync from "browser-sync";
import { exec } from "child_process";
import chokidar from "chokidar";
import path from "path";

const bs = browserSync.create();

// اجرای build
function build() {
  return new Promise((resolve, reject) => {
    exec("node build.js", (err, stdout, stderr) => {
      if (stderr.trim() !== "") {
        console.error(stderr);
      }
      else {
        console.log(stdout);
        resolve();
      }
    });
  });
}

// اجرای sass
function sass() {
  return new Promise((resolve, reject) => {
    exec(
      // `concurrently "sass --no-source-map --style=compressed miz/_index.scss:assets/css/miz.min.css" "node miz/pkg/miz-controller.js --build" "sass --no-source-map --style=compressed sass/style.scss:assets/css/style.min.css" "node ./assets/vendors/mizban/commands/listFiles.js ^&^& node ./assets/vendors/mizban/commands/extractVariables.js" "sass --no-source-map --style=compressed miz/_index.scss:assets/vendors/mizban/compile-css/css/miz.min.css"`,
      `concurrently "sass --no-source-map --style=compressed miz/_index.scss:assets/css/miz.min.css" "node miz/pkg/miz-controller.js --watch" "sass --no-source-map --style=compressed sass/style.scss:assets/css/style.min.css" "node ./assets/vendors/mizban/commands/listFiles.js ^&^& node ./assets/vendors/mizban/commands/extractVariables.js"`,
      (err, stdout, stderr) => {
        if (stderr.trim() !== "") {
          console.error(stderr);
          reject(err);
        }
        else {
          console.log(stdout);
          resolve();
        }
      }
    );
  });
}

// اجرای اولیه
await build();
// await sass();

// اجرای سرور
bs.init({
  server: {
    baseDir: "./"
  },
  open: false
});

const watchPaths = [
  path.resolve("app"),
  path.resolve("miz"),
];

chokidar.watch(watchPaths, { ignoreInitial: true }).on("all", async (event, filePath) => {
  console.log(`📁 ${event}: ${filePath}`);

  if (filePath.includes(path.resolve("app"))) {
    console.log("🔄 Changes in app: build and sass will run...");
    await build();      // منتظر build
    bs.reload();        // بعد رفرش
  } else if (filePath.includes(path.resolve("miz"))) {
    console.log("🔄 Changes in miz: only sass will run...");
    // await sass();
    bs.reload();
  }
});