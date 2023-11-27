window.onload = function () {
    
   function b64ToObject (b64String) {
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
    let innerInfo =b64ToObject( arrayOfAppData71);
    //reda search params
    var urlParams = new URLSearchParams(window.location.search);
    let estate_id = urlParams.get('estate_id');

    let embedNode = document.querySelector(".clue-cont");
    let dynTable = new DynamicTable({id:"counter_type",value:"descr"},
                                        innerInfo, 
                                        `http://${window.location.hostname}/counter/new/step3`,
                                        {estate_id:estate_id});
    dynTable.createTemplate(embedNode);


    
    console.log(b64ToObject( arrayOfAppData71));
}