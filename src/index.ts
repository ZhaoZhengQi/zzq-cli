import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";
import { readFileSync } from "fs";
import { join } from "path";

// 动态读取 package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
);
const program = new Command("zzq-cli");

// 查看版本
program.version(packageJson.version, "-v, --version");

program
  .command("create")
  .description("创建一个新项目")
  .argument("[name]", "项目名称")
  .action((dirName) => {
    create(dirName);
  });
program.parse();
