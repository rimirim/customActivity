console.log(this);
console.log(this === module.exports);
// 전역 this가 global 이 아니고 module exports 이다.

function a() {
   console.log(this === global);
}

a();
