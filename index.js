const express = require('express');
const axios = require('axios');

const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware để phân tích dữ liệu JSON
app.use(bodyParser.json());

// Endpoint webhook cho Viber
app.post('/webhook', (req, res) => {
    const { event, user_id, message } = req.body;

    console.log("Received event:", event);
    console.log("User ID:", user_id);
    console.log("Message:", message);

    // Kiểm tra nếu có tin nhắn từ người dùng
    if (event === 'message') {
        // Gửi phản hồi cho người dùng
        sendMessage(user_id, `Bạn đã gửi: ${message.text}`);
    }

    // Trả về mã trạng thái 200 OK
    res.sendStatus(200);
});

// Hàm gửi tin nhắn đến người dùng
const sendMessage = async (userId, text) => {
    const url = `https://chatapi.viber.com/pa/send_message`;

    const message = {
        receiver: userId,
        type: 'text',
        text: text,
    };

    // Gửi yêu cầu đến Viber API
    await axios.post(url, message, {
        headers: {
            'X-Viber-Auth-Token': 'YOUR_VIBER_AUTH_TOKEN',
            'Content-Type': 'application/json',
        },
    });
};

const setWebhook = async () => {
  const url = `https://chatapi.viber.com/pa/set_webhook`;
  const webhookUrl = 'https://yourserver.com/webhook'; // URL của server bạn đã triển khai

  const data = {
      url: webhookUrl,
      event_types: ['message'], // Các loại sự kiện mà bạn muốn nhận
  };

  await axios.post(url, data, {
      headers: {
          'X-Viber-Auth-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMwOCwic3BhY2VJZCI6MjUwNjgwLCJvcmdJZCI6MjQ4MTk1LCJ0eXBlIjoiYXBpIiwiaWF0IjoxNzI3MzE1NDIzfQ.SjrMZ78hZKSPg-VHfanQq0xf-AbOiZG2I3-7AgQ5ekw',
          'Content-Type': 'application/json',
      },
  });
};

// Gọi hàm setWebhook khi khởi động server
setWebhook().catch(console.error);

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
