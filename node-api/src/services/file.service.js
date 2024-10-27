const path = require("path");
const fs = require("fs");

class FileService {
  static getUserFile(email, filename) {
    // Construct the file path based on user email
    const filePath = path.join(__dirname, "..","jobs","NetworksData", email, filename);
    console.log("---filePath-----", filePath)
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }
    
    return filePath;
  }
}

module.exports = FileService;
