let current_time = new Date();
// console.log(current_time);

// 1. 현재 시간(Locale)
const curr = new Date();
// console.log("현재시간(Locale) : " + curr + '<br>');
// console.log(curr + '<sometn');
// console.log(curr + " ");


// 2. UTC 시간 계산
const utc =
    curr.getTime() +
    (curr.getTimezoneOffset() * 60 * 1000);

// 3. UTC to KST (UTC + 9시간)
const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
const kr_curr =
    new Date(utc + (KR_TIME_DIFF));

// console.log("한국시간 : " + kr_curr);

// console.log(kr_curr);

let bid_time = 10 * 60 * 1000; // 10분

let total_time = new Date(kr_curr.getTime() + bid_time);

console.log(total_time);
console.log(kr_curr);