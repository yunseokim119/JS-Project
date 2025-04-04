const fs = require('fs').promises; // fs 모듈을 require 방식으로 불러옴

/**
 * 파일을 Base64로 변환
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function fileToBase64(filePath) {
  const fileData = await fs.readFile(filePath);
  return fileData.toString('base64');
}

module.exports = { fileToBase64 };