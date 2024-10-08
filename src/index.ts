import { Command } from "commander";
import { version } from "../package.json";
import { create } from "./command/create";
const program = new Command("hhh");
// 查看版本
program.version(version, "-v, --version");

program
  .command("create")
  .description("创建一个新项目")
  .argument("[name]", "项目名称")
  .action((dirName) => {
    create(dirName);
  });
program.parse();
