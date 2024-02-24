  window.onload=function(){

    function b64ToObject(b64String){
                //converting to an 8bit array
                const binString = atob(b64String);
                let typedArray =  Uint8Array.from(binString, (m) => m.codePointAt(0));
                //converting to UTF-8
                let decoder = new TextDecoder("utf-8");
                let utf8String = decoder.decode(typedArray);
                //parsing to object
                let obj = JSON.parse(utf8String);
                return obj;

    }

    //parsing inner embedded array
    let innerInfo = b64ToObject( arrayOfAppData71);
 //
 let btn = document.querySelector(".btn");
 let counter_id = document.querySelector("#counter_id"); 
 let provider_id= document.querySelector("#provider_id");
//assign values to form nodes
 counter_id.value = innerInfo.counter_id;
 provider_id.value = innerInfo.provider_id;
//assign action link
 let form = document.querySelector("form");
 form.setAttribute("action",`http://${window.location.hostname}/providers/add/finish`);

 //are credentials (for the provider) in th inner embedded object?
 if(innerInfo["acc_num"]) {
  //show elements
   let elems = document.querySelectorAll(".provider_cred");
   elems.forEach((s)=>{
    s.classList.remove("d-none");
   })
   //assign values to each node (credentials):
    document.getElementById("account").value = innerInfo.acc_num;
     document.querySelector(".acc_string").innerText = innerInfo.acc_num;

    document.getElementById('usr_login').value = innerInfo.usr_login;
    document.querySelector('.login_string').innerText = innerInfo.usr_login;

    document.getElementById('usr_password').value = innerInfo.usr_password;
    document.querySelector('.password_string').innerText = innerInfo.usr_password;

 }

//deprecated
 btn.setAttribute("href",`http://${window.location.hostname}/providers/add/finish?provider_id=${innerInfo.provider_id}&counter_id=${innerInfo.counter_id}&account=${innerInfo.account}`)

     console.log(innerInfo);
  }