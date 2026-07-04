// ============================================================
// Kiss Translator — MLX Local Model Hooks
// API URL: http://10.10.10.10:8080/v1/chat/completions
// Model:   __HOME__/AI/models/Qwen3-8B-4bit
// API Key: local
// ============================================================

// ============================================================
// 【旧版】Request Hook — 使用了 ?. 语法，扩展引擎不兼容
// ============================================================
// async (args) => {
//   const userContent = args.userPrompt || JSON.stringify(args.texts?.map((t, i) => `[${i}] ${t}`).join('\n'));
//
//   const body = {
//     model: "__HOME__/AI/models/Qwen3-8B-4bit",
//     messages: [
//       { role: "system", content: args.systemPrompt || args.nobatchPrompt || `You are a professional translator. Translate from ${args.from} to ${args.to}. Output ONLY the translation.` },
//       { role: "user", content: userContent }
//     ],
//     max_tokens: 4096,
//     stream: false,
//     chat_template_kwargs: { enable_thinking: false }
//   };
//   return { url: args.url, body, headers: { "Content-Type": "application/json" }, method: "POST" };
// };

// ============================================================
// 【旧版】Response Hook — 使用了 ?. 语法，扩展引擎不兼容
// ============================================================
// async ({ res, parseAIRes }) => {
//   const content = res?.choices?.[0]?.message?.content || "";
//   try {
//     const parsed = JSON.parse(content);
//     if (Array.isArray(parsed)) {
//       return { translations: parsed.map(t => ({ text: typeof t === 'string' ? t : t.text, src: t.src || "" })) };
//     }
//   } catch (e) {}
//   return { translations: [[content]] };
// };


// ============================================================
// 【新版】Request Hook — 纯 ES5 兼容写法
// ============================================================
async (args) => {
  var systemPrompt = args.systemPrompt || args.nobatchPrompt || "You are a professional translator. Translate the following text. Output ONLY the translation.";
  var userContent = args.userPrompt || "";
  if (!userContent && args.texts && args.texts.length > 0) {
    userContent = args.texts[0];
  }

  var body = {
    model: "__HOME__/AI/models/Qwen3-8B-4bit",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    max_tokens: 4096,
    stream: false,
    chat_template_kwargs: { enable_thinking: false }
  };

  return {
    url: args.url,
    body: body,
    headers: { "Content-Type": "application/json" },
    method: "POST"
  };
};


// ============================================================
// 【新版】Response Hook — 纯 ES5 兼容写法
// ============================================================
async (context) => {
  var content = "";
  try {
    var res = context.res;
    if (res && res.choices && res.choices[0] && res.choices[0].message) {
      content = res.choices[0].message.content || "";
    }
  } catch (e) {}
  return { translations: [[content]] };
};
