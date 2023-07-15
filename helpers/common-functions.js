function removeQuotes(message) {
  return message ? message.replace(/"|'/g, "") : "Invalid payload.";
}

function generateRandomNumbers(numberOfDigits) {
  const min = Math.pow(10, numberOfDigits - 1); // Minimum value with the specified number of digits
  const max = Math.pow(10, numberOfDigits) - 1; // Maximum value with the specified number of digits

  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

module.exports = {
  removeQuotes,
  generateRandomNumbers,
};
