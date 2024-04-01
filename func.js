const value = require("./var.js");
console.log(value);

// value.odd
// value.odd ==> 구조분해 할당 가능

const { odd, even } = require("./var");
console.log(odd);
console.log(even);

function checkOddOrEven(number) {
   if (number % 2) {
      return odd;
   } else {
      return even;
   }
}

module.exports = checkOddOrEven;
