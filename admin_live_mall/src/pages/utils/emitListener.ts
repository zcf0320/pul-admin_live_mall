export class EmitListener {
  static list: Array<() => void> = [];
  static add(fn: () => void) {
    this.list.push(fn);
  }

  static update() {
    this.list.forEach((fn) => fn());
  }
}
