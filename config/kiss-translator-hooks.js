// ============================================================
// Kiss Translator — MLX Local Model Hooks (speed mode)
//
// 原理:
//   - 自动从 /v1/models 获取服务端实际的模型 ID
//   - 独立请求模式: 每个段落单独翻译, 出第一行最快
//   - 顺序可能偶尔乱, 但速度优先
// ============================================================


// ============================================================
// Request Hook
// ============================================================
async (args) => {
  // 1. 自动获取服务端模型 ID
  var modelId = "";
  try {
    var mresp = await fetch(args.url.replace(/\/chat\/completions$/, "/models"));
    var mdata = await mresp.json();
    if (mdata && mdata.data && mdata.data.length > 0) {
      for (var i = 0; i < mdata.data.length; i++) {
        var id = mdata.data[i].id;
        if (id.charAt(0) === "/") { modelId = id; break; }
      }
      if (!modelId) modelId = mdata.data[0].id;
    }
  } catch (e) {}
  if (!modelId) modelId = "";

  // 2. 独立请求: 每个段落单独翻译
  var systemPrompt = "Translate to Chinese (or English if input is English). Preserve formatting. No explanations.";
  var userContent = args.userPrompt || "";
  if (!userContent && args.texts && args.texts.length > 0) {
    userContent = args.texts[0];
  }

  var body = {
    model: modelId,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ],
    max_tokens: 512,
    temperature: 0.1,
    top_p: 0.9,
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
// Response Hook
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
