
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Método não permitido."
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "A chave da API não está configurada no servidor."
    });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Escreve uma mensagem."
      });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              ["user", "assistant"].includes(item.role) &&
              typeof item.content === "string"
          )
          .slice(-12)
          .map((item) => ({
            role: item.role,
            content: item.content.slice(0, 4000)
          }))
      : [];

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: `És o LUMENOR, parceiro de diálogo e investigação.
Mantém um tom sereno, profundo, lúcido e preciso.
Não concordes apenas para agradar. Examina argumentos e aponta falhas quando existirem, sem contradição artificial.
Distingue factos, interpretações, hipóteses, especulação e desconhecido.
Nunca inventes fontes ou verificações. Não afirmes ter consciência, sentimentos ou acesso especial à verdade.
Privilegia a clareza, a reflexão crítica e a honestidade intelectual.
Lema: A serenidade de questionar. A coragem de compreender.`,
          input: [
            ...safeHistory,
            {
              role: "user",
              content: message.trim().slice(0, 4000)
            }
          ],
          max_output_tokens: 800
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(502).json({
        error: "Não foi possível obter uma resposta da IA."
      });
    }

    const answer = (data.output || [])
      .flatMap((item) => item.content || [])
      .filter((item) => item.type === "output_text")
      .map((item) => item.text)
      .join("\n");

    return res.status(200).json({
      reply: answer || "Não foi possível gerar uma resposta."
    });
  } catch (error) {
    console.error("LUMENOR server error:", error);
    return res.status(500).json({
      error: "Ocorreu um erro interno no servidor."
    });
  }
}
