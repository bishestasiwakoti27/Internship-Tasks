//Qn 1
const prompt = require("prompt-sync")();

let str = prompt("Enter your word: ");

let str = "hello";
let reversed = "";

for (let i = str.length - 1; i >= 0; i--) {
  reversed += str[i];
}

console.log("Reversed String:", reversed);
const prompt = require("prompt-sync")();

//Qn 2
let n = prompt("Enter a number that you to take the factorial of");
let num = parseInt(n, 10);
let fact = 1;
for (let i = num; i > 0; i--) {
  fact = fact * i;
}
console.log(fact);

let a = prompt("Enter a number");
let rev = "";
for (let i = a.length - 1; i >= 0; i--) {
  rev = rev + a[i];
}
if (rev == a) {
  console.log("Palindrome");
} else {
  console.log("Not Palindrome");
}

console.log(rev);

let n = prompt("Enter a sentence");

let b = n.split(" ");

let long = b[0];

for (let sashank of b) {
  if (sashank.length > long.length) {
    long = sashank;
  }
}
console.log(long);

// Qn 5 - FizzBuzz

for (let i = 1; i <= 100; i++) {
  if (i % 3 == 0 && i % 5 == 0) {
    console.log("FizzBuzz");
  } else if (i % 3 == 0) {
    console.log("Fizz");
  } else if (i % 5 == 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}

// Qn 6 - Sum of Array Elements

let arr = [10, 20, 30, 40, 50];

let sum = 0;

for (let i = 0; i < arr.length; i++) {
  sum = sum + arr[i];
}

console.log(sum);

// Qn 7 - Title Case a Sentence

let sentence = prompt("Enter a sentence: ");

let words = sentence.split(" ");

let result = "";

for (let word of words) {
  result += word[0].toUpperCase() + word.slice(1).toLowerCase() + " ";
}

console.log(result);

// Qn 8 - Count Vowels

let str = prompt("Enter a string: ");

let count = 0;

for (let ch of str.toLowerCase()) {
  if (ch == "a" || ch == "e" || ch == "i" || ch == "o" || ch == "u") {
    count++;
  }
}

console.log(count);

// Qn 9 - Fibonacci Sequence

let n = parseInt(prompt("Enter number of terms: "));

let a = 0;
let b = 1;

for (let i = 1; i <= n; i++) {
  console.log(a);
  let c = a + b;
  a = b;
  b = c;
}

// Qn 10 - Anagram Checker

let str1 = prompt("Enter first string: ").toLowerCase().replaceAll(" ", "");
let str2 = prompt("Enter second string: ").toLowerCase().replaceAll(" ", "");

function sortString(str) {
  let arr = str.split("");

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }

  return arr.join("");
}

if (sortString(str1) == sortString(str2)) {
  console.log("Anagram");
} else {
  console.log("Not Anagram");
}

// Qn 11 - Missing Number

let arr = [0, 1, 2, 4, 5];

let n = arr.length;

let total = (n * (n + 1)) / 2;

let sum = 0;

for (let i of arr) {
  sum = sum + i;
}

console.log("Missing Number:", total - sum);

// Qn 12 - Remove Duplicates

let arr = [1, 2, 2, 3, 4, 4, 5];

let unique = [];

for (let i of arr) {
  if (!unique.includes(i)) {
    unique.push(i);
  }
}

// console.log(unique);

// Qn 13 - Calculate Power

let x = parseInt(prompt("Enter base: "));
let n = parseInt(prompt("Enter power: "));

let result = 1;

for (let i = 1; i <= n; i++) {
  result = result * x;
}

console.log(result);

// Qn 14 - Merge Sorted Arrays

let arr1 = [1, 3, 5, 7];
let arr2 = [2, 4, 6, 8];

let merged = arr1.concat(arr2);

for (let i = 0; i < merged.length; i++) {
  for (let j = i + 1; j < merged.length; j++) {
    if (merged[i] > merged[j]) {
      let temp = merged[i];
      merged[i] = merged[j];
      merged[j] = temp;
    }
  }
}

console.log(merged);

// Qn 15 - Second Largest Number

let arr = [12, 45, 22, 89, 67];

let largest = arr[0];
let second = arr[0];

for (let i of arr) {
  if (i > largest) {
    second = largest;
    largest = i;
  } else if (i > second && i != largest) {
    second = i;
  }
}

console.log(second);

// Qn 16 - Reverse Words

let sentence = prompt("Enter a sentence: ");

let words = sentence.split(" ");

let rev = "";

for (let i = words.length - 1; i >= 0; i--) {
  rev = rev + words[i] + " ";
}

console.log(rev);

// Qn 17 - Validate Email

let email = prompt("Enter email: ");

if (email.includes("@") && email.includes(".")) {
  console.log("Valid Email");
} else {
  console.log("Invalid Email");
}

// Qn 18 - Intersection of Arrays

let arr1 = [1, 2, 3, 4, 5];
let arr2 = [3, 4, 5, 6, 7];

let common = [];

for (let i of arr1) {
  if (arr2.includes(i)) {
    common.push(i);
  }
}

console.log(common);

//Qn 19 - Balanced Brackets

let str = prompt("Enter brackets: ");

let stack = [];
let balanced = true;

for (let ch of str) {
  if (ch == "(" || ch == "[" || ch == "{") {
    stack.push(ch);
  } else {
    let last = stack.pop();

    if (
      (ch == ")" && last != "(") ||
      (ch == "]" && last != "[") ||
      (ch == "}" && last != "{")
    ) {
      balanced = false;
      break;
    }
  }
}

if (stack.length != 0) {
  balanced = false;
}

if (balanced) {
  console.log("Balanced");
} else {
  console.log("Not Balanced");
}
