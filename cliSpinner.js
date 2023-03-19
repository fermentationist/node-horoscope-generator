// A simple loading spinner for the CLI
export default class CLISpinner {
  constructor() {
    // this.spinner = ["|", "/", "-", "\\"];
    // this.spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    // this.spinner = ["👆", "👇", "👈", "👉"];
    this.spinner = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
    this.spinnerIndex = 0;
  }
  start() {
    process.stdout.write("\x1B[?25l"); // hide cursor
    this.interval = setInterval(() => {
      process.stdout.write(`\r${this.spinner[this.spinnerIndex]}`);
      this.spinnerIndex = (this.spinnerIndex + 1) % this.spinner.length;
    }, 100);
  }
  stop() {
    clearInterval(this.interval);
    process.stdout.write("\r");
    process.stdout.write("\x1B[?25h"); // show cursor
  }
}