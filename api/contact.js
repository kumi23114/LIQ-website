// /api/contact.js

export default async function handler(request, response) {
    if (request.method !== 'POST') {
      return response.status(405).send('僅接受 POST 請求');
    }
  
    // 從 Vercel 環境變數中安全地讀取新的「鑰匙」
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const myUserId = process.env.LINE_USER_ID;
  
    if (!channelAccessToken || !myUserId) {
      return response.status(500).json({ error: '伺服器未設定 LINE Messaging API 的必要憑證' });
    }
  
    try {
      const { Name, Email, Message } = request.body;
      const textMessage = `
  📬 官網新訊息通知
  --------------------
  👤 姓名：${Name || '未提供姓名'}
  📧 Email：${Email || '未提供Email'}
  💬 訊息內容：
  ${Message || '未提供訊息'}
  --------------------
  請儘速處理！
      `.trim();
  
      // 準備發送到 Messaging API Push Endpoint 的資料
      const requestBody = {
        to: myUserId, // 指定接收者為您自己
        messages: [
          {
            type: 'text',
            text: textMessage,
          },
        ],
      };
  
      // 發送 Push Message
      const lineApiResponse = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${channelAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!lineApiResponse.ok) {
        const errorBody = await lineApiResponse.json();
        console.error('LINE API Error:', errorBody);
        throw new Error(`LINE Messaging API 回應錯誤: ${JSON.stringify(errorBody)}`);
      }
      
      return response.status(200).json({ message: '訊息已成功透過 Messaging API 發送通知！' });
  
    } catch (error) {
      console.error('處理表單時發生錯誤:', error);
      return response.status(500).json({ error: '伺服器內部錯誤' });
    }
  }