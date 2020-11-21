const fs = require("fs");
const { exec, execSync } = require("child_process");
const watch = require('node-watch');

exec("npm run build", (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  watch('./src/', { recursive: true }, function(evt, name) {
    console.log('%s changed.', name);
    console.log("re-building");
    exec("npm run build", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  });
});

// fs.watch("./src/", async (eventType, filename) => {
//   console.log("Watching...")
//   console.log(eventType);


//   console.log(filename);
// });

exec("lite-server");
