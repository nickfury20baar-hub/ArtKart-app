export default async function handler(req, res) {
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const query = body?.query;

    if (!query) {
      return res.status(400).json({ error: "Query missing" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: query }]
          }],
        }),
      }
    );

    const data = await response.json();

    if (!data.embeddings) {
      console.log("Gemini Error:", data);
      return res.status(500).json({ error: "Gemini API failed", details: data });
    }

    res.status(200).json({
      embedding: data.embeddings[0].values,
    });

  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
}
