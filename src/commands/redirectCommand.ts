import { Command } from "./command";

export class RedirectCommand extends Command {
  constructor(private executor: Window, private url = '') {
    super();
  }
  public execute = () => {
    this.executor.open(this.url);
  }
}
