'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'prit patel',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-04-29T21:31:17.178Z',
    '2022-04-25T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); //here we converted miliseconds into days by deviding miliseconds

  // const days1 = calcDaysPassed(new Date(2044,10,1), new Date(2044,10,11));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) {
    return 'today';
  } else if (daysPassed === 1) {
    return 'yesterday';
  } else if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }
  // const day = `${date.getDate()}`.padStart(2,0); /// to add fix number we have to use padStart method. in this first parameter is total words we want to display and 2nd parameter is default value if there is less number in that string.
  // const month = `${date.getMonth() + 1}`.padStart(2,0); // //here we add  +1 because in js months start with 0. so, to display current month we have to add 1. this will output 04 as this is april.
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;

  // //intl is a js api which we can use to format date internationally.in this we have to pass laguage code and then format function on that object.
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]); // //here we are taking dates from other array. movements and movementsDate array value should be same. forexample 1st value in date array should be connected to 1st movement.
    // const day = `${date.getDate()}`.padStart(2,0); /// to add fix number we have to use padStart method. in this first parameter is total words we want to display and 2nd parameter is default value if there is less number in that string.
    // const month = `${date.getMonth() + 1}`.padStart(2,0); // //here we add  +1 because in js months start with 0. so, to display current month we have to add 1. this will output 04 as this is april.
    // const year = date.getFullYear();
    // const displayDate = `${day}/${month}/${year}`;
    const displayDate = formatMovementDates(date, currentAccount.locale);

    // const formatedMov = new Intl.NumberFormat(acc.locale, {style : 'currency', currency : acc.currency}).format(mov);
    const formatedMov = formatCurrency(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  //   labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  //   labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  //   labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  //   labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
    });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  // //set time to 5 mins
  let time = 25;
  let h, m, s;
  // //call the timer every second
  const tick = function () {
    console.log(Math.round(time / (60 * 60)));
    h = Math.trunc(time / (60 * 60));
    m = `${Math.trunc(time / 60)}`.padStart(2, 0);
    s = String(time % 60).padStart(2, 0);
    console.log('h : ' + h, 'm : ' + m, 's : ' + s);
    labelTimer.textContent = `${m} : ${s}`;
    if (s == '00' && m == '00' && h == 0) {
      console.log('logout');
      clearInterval(logoutTimer);
      labelWelcome.textContent = 'Login to get started';
      containerApp.style.opacity = 0;
    }
    time--;
    console.log(time);
  };
  // //here we call tick function two times because if we do all logic in setInterval function then it will give delay of 1 second after login. so we have to call all logic immediately we login. so called it seperately and then again in setInterval.
  tick();
  const logoutTimer = setInterval(tick, 1000);
  // //In each call, print the remaining time to UI

  // //when 0 seconds, stop timer and logout user.
  return logoutTimer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, logoutTimer;

// // //fake always login.
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // //create current date and time
    const now = new Date();
    // const day = `${now.getDate()}`.padStart(2,0); /// to add fix number we have to use padStart method. in this first parameter is total words we want to display and 2nd parameter is default value if there is less number in that string.
    // const month = `${now.getMonth() + 1}`.padStart(2,0); // //here we add  +1 because in js months start with 0. so, to display current month we have to add 1. this will output 04 as this is april.
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2,0);
    // const min = `${now.getMinutes()}`.padStart(2,0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    ////want to display dd/mm/yyyy

    // //experimenting APIs
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      // month : '2-digit',
      month: 'numeric',
      // month : 'long', // //will give month name instead of number.
      year: 'numeric',
      // weekday : 'long', // //will display week day as well.
    };
    // const local = navigator.language; // //this will return the language code of the user automatically based on browser settings.
    // labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // //start logout timer
    if (logoutTimer) clearInterval(logoutTimer);
    logoutTimer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // //reset timer
    clearInterval(logoutTimer);
    logoutTimer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
    clearInterval(logoutTimer);
    logoutTimer = startLogoutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// // //lecture 166 - converting and checking numbers

// // //in javascript numbers are always stored in binary format(base 2).
// // //in javascript we have only one datatype for all numbers (in other language we have integer, float etc for numbers)
// console.log(23 === 23.0); //true, because we have only one data type in js for all numbers.(in other languages we have integer and float etc.)

// console.log(0.1 + 0.2); // 0.30000000000000004 -- we are getting result like this because in js values are stored in binary format.
// console.log(0.1 + 0.2 === 0.3); // false (this will return false because of upper reason)

// // //conversion
// console.log(Number('23')); // will convert string into number
// console.log(+'23'); // we can also convert string into number by simple adding + sign before that number, + sign automatically do type coersion and convert that string into number.

// // //parsing
// // //we can call parseInt and parseFloat directly without calling Number object before that. but calling parseInt and parseFloat on Number object is the best practice.
// console.log(Number.parseInt('30.44')); //30.
// console.log(Number.parseInt('30px4')); //30. this will take only number value(0-9). string should be start from number, if string start with other alphabatic character then this wont work
// console.log(Number.parseInt('a44')); // Nan (not a number)
// // console.log(Math.trunc(+'30.54'));

// console.log(Number.parseFloat('2.4rem')); // 2.4

// // //isNan will return true only if given value is not a valid value
// // //check if value is not a number (there are multiple special case behaviour in isNan function, so be careful before using this)
// console.log(Number.isNaN('ddd')); // false
// console.log(Number.isNaN(20)); // false
// console.log(Number.isNaN(+'20x')); // true =>20x is not a valid value so its return true
// console.log(isNaN(undefined)); // true , here we pass undefined without using number object, so it will reutrn true, but if we pass undefined on number object then it will return false.
// console.log(Number.isNaN(undefined)); // false

// // //check if value is number.
// console.log(Number.isFinite(30)); // true
// console.log(Number.isFinite(30/0)); // false
// console.log(Number.isFinite('34')); // false
// console.log(Number.isFinite(+'34')); //true

// console.log(Number.isInteger(29)); //true
// console.log(Number.isInteger(29 / 0)); // false

// // //lecture 167 - math and rounding

// // //for sqare root we have inbuilt function in js, which we can call on Math namespace.

// console.log(Math.sqrt(25)); //5
// console.log(25 ** (1 / 2)); //5

// //quabic root
// console.log(27 ** (1 / 3)); //3

// // //4th time root
// console.log(16 ** (1 / 4)); //2

// // //get maximum value. max do type coersion, so if we pass value in integer format then also it will work.

// console.log(Math.max(3,4,6,22,'55')); //55
// console.log(Math.min(3,4,-6,22,'55')); //-6

// // //random
// console.log(Math.trunc(Math.random() * 6) + 1); // //from 1 to 6
// const randomInt = (min, max) => Math.floor(Math.random() * (max-min) + 1) + min; // /function to find random value between two values.
// console.log(randomInt(10,20));

// // //rounding integers
// console.log(Math.trunc(23.3)); // 23
// console.log(Math.trunc(23.8)); // 23

// console.log(Math.round(23.3)); // 23
// console.log(Math.round(23.8)); // 24

// console.log(Math.ceil(23.3)); // 24
// console.log(Math.ceil(23.8)); // 24

// console.log(Math.floor(23.3)); // 23
// console.log(Math.floor(23.8)); // 23

// // //trunc and floor both work same for possitive numbers. but for negative numbers its different
// console.log(Math.floor(-23.3)); // -24
// console.log(Math.trunc(-23.3)); // -23

// /// //rounding decimals
// // //in this we have to pass number in tofixed method which we want to display after decimal. however, this will return in number in string format so we have to convert in in integer if we want number in integer format.
// console.log(+(2.7).toFixed(0)); // 3 // if we dont want any decimal value then we have to pass 0 in parameter.
// console.log(+(2.7).toFixed(3)); //2.700 // 3 decimal value after decimal
// console.log(+(2.7456).toFixed(2)); // 2.75

// // //lecture 168 - reminder operator (%)
// console.log(5 % 2); // //1

// const isEven = n => n % 2 === 0;  // //check is any number is odd or even.
// console.log(isEven(4));
// console.log(isEven(5));

// labelBalance.addEventListener('click',function(){
//     [...document.querySelectorAll('.movements__row')].forEach(function(row, i){
//         if(i % 2 === 0){
//             row.style.backgroundColor = 'orange';
//         }
//         if(i % 3 === 0){
//             row.style.backgroundColor = 'blue';
//         }
//     });
// });

// // //lecture 169 - bigIng
// // //BigInt is a premitive data type.
// // //numbers are stored in 64 bits, out of 64 bits only 53 bits are used.
// console.log(2 ** 53 - 1); // this is the biggest number javascript can be stored.
// // //to solve this problem js introduce new data type which is bigInt. and in bigInt we can store number as big as we want.
// console.log(44444444444444423432444444444444444234n); // //to convert number into bigInt we just have to write n at the end of number, or we can use BigInt function as well, but BigInt function can be used with small numbers only.
// console.log(BigInt(44444444444444423432444444444444444234n));

// // //operations
// // //we can not do math operator on bigInt, like Math.sqrt(16n), this will give error.
// // //we can not use bigInt type of value with other type. so we can not add or multiply two numbers in which one is bigInt and other is int. it will give error.
// console.log(10000n + 10000n); // //20000n

// // console.log(10000n + 22); // //this will give error as one number is bigInt and other is number

// // //there is one exception which is comparision operatoe (< and >) and concat with string. bigint number will convert to string if we concat it with string.
// console.log(20n > 15); // this will return true.
// console.log(3333333333333322222222222445n + ' is really big number');

// // //lecture 170 - creating dates and time

// // //create a date.

// const now = new Date(); // //1st way
// console.log(now);

// console.log(new Date('Apr 30 2022 14:08:14')); // //display same output (fix)
// console.log(new Date('December 24, 2021')); // //we can pass string like that, but it can return only that fix date.
// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 23, 15, 23, 5)); // //in this parameters are year, month, date, hour, min, sec.   // //moreover 2nd parameter which is month is 0 based, so if we pass 10, it will consider 11 (november). //Mon Nov 23 2037 15:23:05 GMT+0530
// // //js also autocorrect the date.
// console.log(new Date(2037, 14, 3)); //Wed Mar 03 2038 00:00:00 GMT+0530 . //here in month it will start again from january after 11. so 12 for january, 13 for feb and 14 for march.
// console.log(new Date(2037, 14, 44)); //Tue Apr 13 2038 00:00:00 GMT+0530  // //here we pass 14 which is atcylly for march, still it return appril because date is 44 so it will auto correct month and consider 31 days of march and 13 days of april.

// // //if in date we pass only one parameter then it will consider it as a milisecond of starting date.
// // // beginning of unix time in js is january 1st, 1970.
// console.log(new Date(0)); //Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time). here 0 is a milisecond.
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); //Thu Jan 04 1970 05:30:00 GMT+0530 (India Standard Time) // //3 days after the original date

// // //working with dates.
// const future = new Date(2037,10,19,15,23);
// console.log(future);
// console.log(future.getFullYear()); // 2037
// console.log(future.getYear()); // //dont use getYear. it will return number of years after 1900. so, in this case it will return 137.
// console.log(future.getMonth()); // 10
// console.log(future.getDate()); //19
// console.log(future.getDay()); //4 . this will return the day of week, not month
// console.log(future.getHours()); //15
// console.log(future.getMinutes()); //23
// console.log(future.getSeconds()); //0
// console.log(future.toISOString()); //2037-11-19T09:53:00.000Z. it return the string in this format.
// console.log(future.getTime()); // //this will return time in milisecond
// console.log(new Date(future.getTime())); // //will give same time as store in future variable, because we passed only one parameter in Date and that parameter is in milisecond.

// // //Date.now() also give the timestamp in milisecond

// console.log(Date.now());
// console.log(new Date(Date.now()));

// // //we can set any property afterward like below.
// future.setFullYear(2040);
// console.log(future); // will change the year only.

// // //lecture 172 - operations with date.

// // const future = new Date(2037,10,19,15,23);
// // console.log(+future); //2142237180000 // //if we change date into number(we can chage it by simply adding + sign.) then it will convert into milisecond.

// // const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); //here we converted miliseconds into days by deviding miliseconds

// // const days1 = calcDaysPassed(new Date(2044,10,1), new Date(2044,10,11));
// // console.log(days1); // 10.

// // console.log(new Date(2044,10,1) - 20);
// // //moment.js is a date library which we can use if we have to use dates havily in our project. its a free library.

// /// //lecture 174 - internationalizing numbers
// const num = 34454344.434;

// const options = {
// 	// style : 'unit',
// 	// unit : 'mile-per-hour'
// 	// unit : 'celsius'
// 	// style  : 'percent', // for percentage we dont have to define percentage property as we are defining for currency and unit.
// 	style:'currency',
// 	currency : 'EUR',
// }

// console.log('US', new Intl.NumberFormat('en-US',options).format(num));
// console.log('Germany', new Intl.NumberFormat('de-DE',options).format(num));
// console.log('browser', new Intl.NumberFormat(navigator.locale,options).format(num));

// // // lecture 175 - Timers - settimeout and setInterval
// // //setInterval timer keep running until we stop it. setTimeout timer runs only once after given time.

// // //in setTimeout function we can pass argument in the parameter after the time in milisecond. like in below example.
// // setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`), 3000, 'olives', 'spinach');

// const ingredients = ['olives', 'spinach']
// // setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`),
//             // 3000,
//             // ...ingredients);
// const pizaaTimer = setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}`), 3000, ...ingredients);

// // //we can delete setTimeout function before time get Executed in that function.
// if(ingredients.includes('olives')) clearTimeout(pizaaTimer); // //clearTimeout function is used to clear the timeout. however if we dont want to call that timeout on some condition then we have to call clearTimeout function before the time we passed in that function.

// console.log('waiting...');

// // //setTimeout
// setInterval(function(){
//     const now = new Date();
//     console.log(now);
// },1000)
