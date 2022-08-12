import fs from "fs";

const generatedPath = ".env";
const envPath = ".env.production";

fs.stat(generatedPath, (error, stats) => {
  if (error) {
    fs.stat(envPath, (error, stats) => {
      if (error) {
        console.log("🚀[Wiki API]: .env.production file Not Found!");
      } else {
        fs.copyFile(envPath, generatedPath, (error) => {
          if (error) {
            console.log("🚀[Wiki API]: Something went wrong!");
          } else {
            console.log("🚀[Wiki API]: Generate successfully!");
          }
        });
      }
    });
  } else {
    console.log(
      "🚀[Wiki API]: Already have a .env file, cannot generate again!"
    );
  }
});
