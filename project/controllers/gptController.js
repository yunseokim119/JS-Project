const { callGpt4Vision } = require('../services/gptService');
const { fileToBase64 } = require('../utils/base64Converter');

// ✅ [텍스트 분석용 프롬프트]
const TEXT_PROMPT = `
다음 텍스트에서 심사 일정을 추출하여 JSON으로 정리해 주세요.

필수 항목:
- 날짜 (date): YYYY-MM-DD 형식
- 장소 (location): 텍스트
- 주관기관명 (organization): 텍스트
- 심사비용 (fee): 숫자만 (단위 생략)
- 어떤 심사였는지 (description): 텍스트
- 심사의 종류 (type): '멘토링', '심사', '강의', '자문', '모니터링', '기타' 중 하나 선택

규칙:
- 모든 키는 반드시 포함시켜 주세요.
- 값이 없는 경우, 빈 문자열("") 또는 0으로 입력해 주세요.
- 날짜는 최대한 YYYY-MM-DD 형식으로 맞춰 주세요.
- 심사의 종류는 문맥을 보고 가장 적합한 것으로 선택해 주세요.

아래 텍스트를 분석해서 JSON만 응답해 주세요:
`;

// ✅ [이미지 분석용 프롬프트]
const IMAGE_PROMPT = `
다음 이미지를 읽고, 이미지 안의 텍스트를 분석하여 심사 일정을 JSON으로 정리해 주세요.

필수 항목:
- 날짜 (date): YYYY-MM-DD 형식
- 장소 (location): 텍스트
- 주관기관명 (organization): 텍스트
- 심사비용 (fee): 숫자만 (단위 생략)
- 어떤 심사였는지 (description): 텍스트
- 심사의 종류 (type): '멘토링', '심사', '강의', '자문', '모니터링', '기타' 중 하나 선택

규칙:
- 모든 키는 반드시 포함시켜 주세요.
- 값이 없는 경우, 빈 문자열("") 또는 0으로 입력해 주세요.
- 날짜는 최대한 YYYY-MM-DD 형식으로 맞춰 주세요.
- 심사의 종류는 문맥을 보고 가장 적합한 것으로 선택해 주세요.

이미지를 참고하여 결과를 JSON만 응답해 주세요.
`;

async function gptVisionHandler(req, res) {
  try {
    const { text } = req.body;
    const file = req.file;

    console.log('Received Text:', text);
    console.log('Received File:', file ? 'File Provided' : 'No File');

    if (!text && !file) {
      return res.status(400).json({ message: '텍스트나 이미지를 하나 이상 업로드해야 합니다.' });
    }

    let finalPrompt;
    let base64Image = null;

    if (text) {
      // 텍스트가 있으면 텍스트 분석 프롬프트
      finalPrompt = `${TEXT_PROMPT}\n${text}`;
    } else if (file) {
      // 텍스트 없고 파일만 있으면 이미지 분석 프롬프트
      base64Image = await fileToBase64(file.path);
      finalPrompt = IMAGE_PROMPT;
    }

    const result = await callGpt4Vision(finalPrompt, base64Image);

    console.log('GPT Vision Response:', result);

    // result에서 { } 부분만 뽑아내기
    let jsonStart = result.indexOf('{');
    let jsonEnd = result.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      return res.status(500).json({ message: 'GPT 응답에서 JSON 형식을 찾을 수 없습니다.' });
    }

    const jsonString = result.substring(jsonStart, jsonEnd + 1);

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      return res.status(500).json({ message: 'GPT Vision 응답 JSON 파싱 오류' });
    }

    res.status(200).json({
      message: 'GPT Vision 호출 성공',
      result: parsedResult,
    });
  } catch (error) {
    console.error('Error in gptVisionHandler:', error);
    res.status(500).json({ message: '서버 오류' });
  }
}

module.exports = { gptVisionHandler };