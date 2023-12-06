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
 let account = document.querySelector("#account");
//assign values to form nodes
 counter_id.value = innerInfo.counter_id;
 provider_id.value = innerInfo.provider_id;
 account.value = innerInfo.account;
//assign action link
 let form = document.querySelector("form");
 form.setAttribute("action",`http://${window.location.hostname}/providers/add/finish`);
//deprecated
 btn.setAttribute("href",`http://${window.location.hostname}/providers/add/finish?provider_id=${innerInfo.provider_id}&counter_id=${innerInfo.counter_id}&account=${innerInfo.account}`)

     console.log(innerInfo);
  }