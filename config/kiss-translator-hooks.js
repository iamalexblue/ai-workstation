// ============================================================
// Kiss Translator — MLX Local Model Hooks (auto-detect model)
//
// 用法:
//   1. 先启动服务:  mlx serve qwen8b
//   2. Kiss Translator 设置:
//      - API URL:    http://10.10.10.10:8080/v1/chat/completions
//      - API Key:    local
//      - Model:      任意填 (会被 Hook 自动覆盖)
//   3. Request Hook 和 Response Hook 填入下方代码
//
// 原理: Request Hook 先调 /v1/models 获取服务端实际加载的模型 ID,
//       再发翻译请求. 无需关心模型路径, 切换模型后自动适配.
// ============================================================


// ============================================================
// Request Hook (auto-detect model)
// ============================================================
async (args) => {
  // 1. 从服务器自动获取实际模型 ID
  var modelId = "";
  try {
    var mresp = await fetch(args.url.replace(/\/chat\/completions$/, "/models"));
    var mdata = await mresp.json();
    if (mdata && mdata.data && mdata.data.length > 0) {
      // 优先选本地路径 (以 / 开头) 而非 HF ID
      for (var i = 0; i < mdata.data.length; i++) {
        var id = mdata.data[i].id;
        if (id.charAt(0) === "/") { modelId = id; break; }
      }
      if (!modelId) modelId = mdata.data[0].id;
    }
  } catch (e) {}
  if (!modelId) modelId = "";  // fallback

  // 2. 构造翻译请求
  var systemPrompt = args.systemPrompt || args.nobatchPrompt || "You are a professional translator. Translate the following text. Output ONLY the translation.";
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
// Response Hook (extract translation)
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
