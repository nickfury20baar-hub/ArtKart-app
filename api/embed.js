export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

    const { query, imageBase64, mimeType } = req.body;

    let part;
    if (imageBase64) {
      // If user sends an image
      part = { inlineData: { data: imageBase64, mimeType: mimeType || "image/jpeg" } };
    } else {
      // If user sends text
      part = { text: query };
    }

    const apiReq = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2-preview:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [part] } // Gemini 2 syntax
        }),
      }
    );

    const data = await apiReq.json();
    
    // In Gemini 2, the result key is often 'embedding' (singular)
    const vector = data.embedding?.values;

    if (!vector) return res.status(500).json({ error: "Embedding failed", details: data });

    return res.status(200).json({ embedding: vector });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
