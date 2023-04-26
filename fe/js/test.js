function shuffle(array) {
    // return array.sort(() => Math.random() - 0.5);
    let shuffled = array.sort(function () {
        return Math.random() - 0.5;
    });
    return shuffled;
}
// let numbers = ['d', 'a', 's', 'i', 's', 't', 'e','i','n','T','e','s','t'];
// console.log("numbers", numbers);
// console.log(shuffle(numbers));
// console.log("numbers", numbers);

let x = 10.55;
let y = parseInt(x); // *10)/10;
console.log(y);
