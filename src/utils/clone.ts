import { simpleGit, SimpleGit, SimpleGitOptions } from "simple-git";
import createLogger from "progress-estimator";
import chalk from "chalk";
const optionsData: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(), // 当前工作目录
  binary: "git", // 指定git二进制文件路径
  maxConcurrentProcesses: 6, //最大并发进程数
};
// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 100,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((item) => {
      return chalk.green(item);
    }),
  },
});
export const clone = async (
  url: string,
  projectName: string,
  options: string[]
) => {
  const git = simpleGit(optionsData);
  try {
    await logger(git.clone(url, projectName, options), "模版下载中...", {
      estimate: 7000, //预计下载时长
    });
    // 下面就是一些相关的提示
    console.log();
    console.log(chalk.blueBright(`==================================`));
    console.log(chalk.blueBright(`==== 欢迎使用 zq-cli 脚手架 ====`));
    console.log(chalk.blueBright(`==================================`));
    console.log();

    //  log.success(`项目创建成功 ${chalk.blueBright(projectName)}`)
    //  log.success(`执行以下命令启动项目：`)
    //  log.info(`cd ${chalk.blueBright(projectName)}`)
    //  log.info(`${chalk.yellow('pnpm')} install`)
    //  log.info(`${chalk.yellow('pnpm')} run dev`)
  } catch (e) {
    console.log(e);
  }
};
