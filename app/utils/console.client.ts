function init(console: Console) {
  const info = console.info.bind(console);
  console.info = (message: string) =>
    info(
      `%c[INFO]%c ${message}`,
      "background-color: #3b82f6;",
      "background-color: transparent;"
    );

  const error = console.error.bind(console);
  console.error = (message: string) =>
    error(
      `%c[ERROR]%c ${message}`,
      "background-color: #f43f5e;",
      "background-color: transparent;"
    );
}

export default init;
