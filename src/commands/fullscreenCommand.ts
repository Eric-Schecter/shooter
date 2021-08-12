import { Command } from "./command";

export class FullScreenCommand extends Command {
  constructor(private executor: Document) {
    super();
  }
  public execute = () => {
    if (this.executor.fullscreenElement === null) {
      this.executor.documentElement.requestFullscreen();
    } else {
      this.executor.exitFullscreen();
    }
  }
}
