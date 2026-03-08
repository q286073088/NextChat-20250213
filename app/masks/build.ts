import fs from "fs";
import path from "path";
import { type BuiltinMask } from "./typing";

const dirname = path.dirname(__filename);

function readMasks(fileName: string, lang: string): BuiltinMask[] {
  try {
    const rawData = fs.readFileSync(path.join(dirname, fileName), "utf-8");
    const data = JSON.parse(rawData);
    return data.map((item: any) => ({
      avatar: item.emoji || "gpt-bot",
      name: item.name,
      context: [
        {
          id: "0",
          role: "system",
          content: item.prompt,
          date: "",
        },
      ],
      modelConfig: {
        model: "gpt-3.5-turbo",
        temperature: 1,
        max_tokens: 2000,
        presence_penalty: 0,
        frequency_penalty: 0,
        sendMemory: true,
        historyMessageCount: 32,
        compressMessageLengthThreshold: 1000,
      },
      lang: lang,
      builtin: true,
      createdAt: Date.now(),
    }));
  } catch (error) {
    console.error(`[Build] failed to read ${fileName}`, error);
    return [];
  }
}

const BUILTIN_MASKS: Record<string, BuiltinMask[]> = {
  cn: readMasks("agents-zh.json", "cn"),
  en: readMasks("agents-en.json", "en"),
  tw: [], // 暂时留空或映射 zh
};

fs.writeFile(
  dirname + "/../../public/masks.json",
  JSON.stringify(BUILTIN_MASKS, null, 4),
  function (error) {
    if (error) {
      console.error("[Build] failed to build masks", error);
    } else {
      console.log("[Build] successfully built masks.json from JSON files");
    }
  },
);
