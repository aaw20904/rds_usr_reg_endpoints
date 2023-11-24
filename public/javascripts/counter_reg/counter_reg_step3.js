window.onload = function () {

    
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
   
    //reda search params
    var urlParams = new URLSearchParams(window.location.search);
    let estate_id = urlParams.get('estate_id');
    let counter_type = urlParams.get('counter_type');

    let estate_input = document.querySelector("#estate_id");
    let counter_input = document.querySelector("#counter_type");
    estate_input.value = estate_id;
    counter_input.value = counter_type;

    let form = document.querySelector("._send_form");

    form.setAttribute("action",`http://${window.location.hostname}/counter/new/finish`);

    
   
}