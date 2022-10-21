
kurwa = [
    {nickname: "maniek", vote: true},
    {nickname: "heniu", vote: true},
    {nickname: "krzysiu", vote: true},
    {nickname: "chuj", vote: false},

]

siema = kurwa[kurwa.findIndex(({nickname}) => nickname === "maniek")].vote

console.log(siema)

for (const key in kurwa){
    console.log(kurwa[key].nickname)
}

elo = kurwa[kurwa.findIndex(({nickname}) => nickname)]
console.log(elo)


// for (const key in kurwa){
//     const obj = kurwa[]
//     for (const prop in obj){
//         console.log(prop)
//     }
// }


// function addUser(){
//     testUserAdd = {nickname: "krzysiu", vote: false}
//     console.log(testUserAdd.nickname)
//     if((kurwa.some(({nickname}) => nickname === testUserAdd.nickname))){
//         console.log('spierdalaj...')
//     }else{
//         console.log('asdas')
//     }
// }
// console.log(kurwa)
// let skipYes = 0
// let skipNo = 0

// for (const key of kurwa) {

//         if(key.vote === false){
//             skipNo++
//         }else if(key.vote === true){
//             skipYes++
//         }

// }
// console.log(`Want to skip: ${skipYes} | Don't want to: ${skipNo}`)


// addUser()