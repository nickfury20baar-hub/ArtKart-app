export default async function handler(req, res) {
  try {
    const { query } = req.body;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent?key=" + process.env.GEMINI_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [query],
      }),
    });

    const data = await response.json();

    res.status(200).json({
      embedding: data.embeddings[0].values,
    });

  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
