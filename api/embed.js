export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // 🔹 TEMP DEMO RESPONSE (replace later with real AI)
    const userMessage = messages?.slice(-1)[0]?.content || '';

    return res.status(200).json({
      choices: [
        {
          message: {
            content: `Demo reply from Vercel API: You said "${userMessage}"`
          }
        }
      ]
    });

  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
