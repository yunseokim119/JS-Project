const { OpenAI } = require('openai');
const fs = require('fs').promises;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function callGpt4Vision(promptText, base64Image) {
  try {
    console.log('Prompt Text:', promptText);
    console.log('Base64 Image:', base64Image ? 'Image Provided' : 'No Image');

    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: promptText }
        ]
      }
    ];

    if (base64Image) {
      messages[0].content.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`,
        },
      });
    }

    // ✨ 스트림 모드로 호출
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 1000,
      stream: true,
    });

    let finalText = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        finalText += delta;
      }
    }

    console.log('Streaming Final Text:', finalText);
    return finalText;
  } catch (error) {
    console.error('GPT Vision 호출 에러:', error.response ? error.response.data : error.message);
    throw new Error('GPT Vision 호출 실패');
  }
}

module.exports = { callGpt4Vision };