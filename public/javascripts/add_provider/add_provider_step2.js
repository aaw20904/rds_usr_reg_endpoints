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
    
    let embedNode = document.querySelector(".clue-cont");
    let dynTable = new  DynamicMultiColTable();
    dynTable.createTable([{id:215, one:"ever", two:"and", three:"never" },
                    {id:216, one:"ever",two:"and",three:"never" },
                    {id:217, one:"ever",two:"and",three:"never" }], embedNode, (evt)=>{alert(evt.target.parentElement.getAttribute("data-id"))});
 


    
   
}