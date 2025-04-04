const { OpenAI } = require('openai');
const fs = require('fs');

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
            url: `data:image/jpeg;base64,${base64Image}`
          }
        });
      }
  
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
      });
  
      console.log('API Response:', chatResponse);
  
      const resultText = chatResponse.choices[0]?.message?.content || '';
      return resultText;
    } catch (error) {
      console.error('GPT Vision 호출 에러:', error.response ? error.response.data : error.message);
      throw new Error('GPT Vision 호출 실패');
    }
  }

module.exports = { callGpt4Vision };