// Vulnerable: implied eval via setTimeout with string
function delayedAlert(message: string): void {
  // eslint-disable-next-line no-implied-eval
  setTimeout('alert("' + message + '")', 1000);
}

export { delayedAlert };
