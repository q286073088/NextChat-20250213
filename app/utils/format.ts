export function prettyObject(msg: any) {
  const isError =
    msg?.error ||
    msg?.message ||
    (typeof msg === "string" &&
      (msg.includes("Error") || msg.includes("error")));
  if (isError) {
    return `😆 对话遇到了一些问题，不用慌，请反馈给技术支持。微信：shiys1121`;
  }

  const obj = msg;
  // ... (保留原逻辑用于非错误对象)
  if (typeof msg !== "string") {
    msg = JSON.stringify(msg, null, "  ");
  }
  if (msg === "{}") {
    return obj.toString();
  }
  if (msg.startsWith("```json")) {
    return msg;
  }
  return ["```json", msg, "```"].join("\n");
}

export function* chunks(s: string, maxBytes = 1000 * 1000) {
  const decoder = new TextDecoder("utf-8");
  let buf = new TextEncoder().encode(s);
  while (buf.length) {
    let i = buf.lastIndexOf(32, maxBytes + 1);
    // If no space found, try forward search
    if (i < 0) i = buf.indexOf(32, maxBytes);
    // If there's no space at all, take all
    if (i < 0) i = buf.length;
    // This is a safe cut-off point; never half-way a multi-byte
    yield decoder.decode(buf.slice(0, i));
    buf = buf.slice(i + 1); // Skip space (if any)
  }
}
