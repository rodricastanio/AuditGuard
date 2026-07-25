// Safe: use function with setTimeout
function delayedAlert(message: string): void {
  setTimeout(() => {
    alert(message);
  }, 1000);
}

export { delayedAlert };
