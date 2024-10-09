import { input, select } from "@inquirer/prompts";
import { clone } from "../utils/clone";
import path from "path";
import fs from "fs-extra";
import { name, version } from "../../package.json";
import { gt } from "lodash";
import chalk from "chalk";
import axios, { AxiosResponse } from "axios";
import { readFileSync } from "fs";
import { join } from "path";

// 动态读取 package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
);
export interface TemplateInfo {
  name: string; //模板名称
  downloadUrl: string; //模版下载地址
  description: string; //模板描述
  branch: string; //模版分支
  // version: string; //模版版本
}

// 模版列表
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
// 获取npm包详情信息--npm 包提供了根据包名称查询包信息的接口--直接使用 axios 请求调用
export const getNpmInfo = async (npmName: string) => {
  const npmUrl = "https://registry.npmjs.org/" + npmName;
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (err) {
    console.error(err as string);
  }
  return res;
};
// 获取npm包版本号
export const getNpmLatestVersion = async (npmName: string) => {
  // data['dist-tags'].latest 为最新版本号
  const { data } = (await getNpmInfo(npmName)) as AxiosResponse;
  return data["dist-tags"].latest;
};
// 对比版本号
export const checkVersion = async (name: string, curVersion: string) => {
  const latestVersion = await getNpmLatestVersion(name);
  const need = gt(latestVersion, curVersion);
  if (need) {
    console.info(
      `📢: 检测到 zzq-cli 最新版:${chalk.blueBright(
        latestVersion
      )} 当前版本:${chalk.blueBright(curVersion)} ~`
    );
    console.log();
    console.info(
      `🔧: 可使用 ${chalk.yellow(
        "pnpm install zzq-cli@last"
      )} 或 ${chalk.yellow("zzq-cli update")} 更新 ~ `
    );
  }
  return need;
};
// 创建项目
export async function create(projectName?: string) {
  // 检查版本更新
  await checkVersion(packageJson.name, packageJson.version);
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
