import { input, select } from "@inquirer/prompts";
import { clone } from "../utils/clone";
import path from "path";
import fs from "fs-extra";
export interface TemplateInfo {
  name: string; //模板名称
  downloadUrl: string; //模版下载地址
  description: string; //模板描述
  branch: string; //模版分支
  // version: string; //模版版本
}

export const templates: Map<string, TemplateInfo> = new Map([
  [
    "Vite-Vue3-TypeScript-Template",
    {
      name: "Vite-Vue3-TypeScript-Template",
      downloadUrl: "https://github.com/ZhaoZhengQi/vue-template.git",
      description: "Vue3+TypeScript+Vite模版",
      branch: "vue3-template-ts",
    },
  ],
  [
    "Vite-Vue3-JavaScript-Template",
    {
      name: "Vite-Vue3-JavaScript-Template",
      downloadUrl: "https://github.com/ZhaoZhengQi/vue-template.git",
      description: "Vue3+JavaScript+Vite模版",
      branch: "vue3-template-js",
    },
  ],
]);

// 是否覆盖当前文件
export const isOverwrite = async (projectName: string) => {
  return await select({
    message: `${projectName} 文件已存在,是否覆盖?`,
    choices: [
      {
        name: "覆盖",
        value: true,
      },
      {
        name: "取消",
        value: false,
      },
    ],
  });
};

export async function create(projectName?: string) {
  // 初始化模版列表
  const templateList = Array.from(templates).map(
    (item: [string, TemplateInfo]) => {
      const [name, info] = item;
      return {
        name,
        value: name,
        description: info.description,
      };
    }
  );
  if (!projectName) {
    projectName = await input({
      message: "请输入项目名称",
    });
  }

  // 文件是否已经存在
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    // 文件已存在
    const run = await isOverwrite(projectName);
    if (run) {
      fs.removeSync(filePath);
    } else {
      return;
    }
  }

  // 选择模版名称
  const templateName = await select({
    message: "请选择模版",
    choices: templateList,
  });
  const info = templates.get(templateName);
  if (info) {
    clone(info.downloadUrl, projectName, ["-b", info.branch]);
  }
}
