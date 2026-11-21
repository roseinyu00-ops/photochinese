// Supabase Edge Function: explain-meme
// Required secret: OPENAI_API_KEY
// Optional secret: OPENAI_MODEL (defaults to gpt-4o-mini)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Для ИИ-разбора нужно войти в аккаунт PhotoChinese." }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { text?: string };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Некорректный запрос." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const input = (body.text || "").trim();
  if (!input || input.length > 1200 || !/\p{Script=Han}/u.test(input)) {
    return new Response(JSON.stringify({ error: "Добавь китайский текст длиной до 1200 символов." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "На сервере ещё не настроен ключ ИИ. Добавь OPENAI_API_KEY в секреты Supabase." }), {
      status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        messages: [
          {
            role: "system",
            content: "Ты — доброжелательный преподаватель китайского языка для русскоязычного начинающего ученика. Разбирай китайские мемы точно и понятно. Отвечай по-русски, структурированно и без выдумок. Если контекст картинки неизвестен, прямо скажи об этом. Разделы ответа: 1) Естественный перевод всей фразы. 2) Буквальный смысл. 3) Сленг, игра слов и культурный контекст — только если они действительно есть; объясни, если их нет. 4) Разбор ключевых слов с пиньинем и значением. 5) Насколько фраза разговорная и где её уместно использовать. Не утверждай, что это шутка или мем, если по одному тексту этого нельзя определить."
          },
          { role: "user", content: `Разбери китайский текст:\n${input}` }
        ],
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || "ИИ-сервис временно недоступен.";
      return new Response(JSON.stringify({ error: message }), {
        status: response.status === 429 ? 429 : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("Пустой ответ ИИ.");
    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("explain-meme error:", error);
    return new Response(JSON.stringify({ error: "Не удалось получить разбор. Попробуй ещё раз." }), {
      status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
