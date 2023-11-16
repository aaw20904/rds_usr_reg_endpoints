window.onload = function(){
    
    
    function parseJSONencodedString(strWithEncoded){
        let area = document.createElement("div");
        area.innerHTML = strWithEncoded;
        return  JSON.parse(area.textContent);
    }
    //parsing inner embedded array
    let innerInfo = parseJSONencodedString( arrayOfAppData71);

    let embedNode = document.querySelector(".clue-cont");
    let dynTable = new DynamicTable({id:"estate_id",value:"descr"}, innerInfo, `http://${window.location.hostname}/counter/new/step2`,false);
    dynTable.createTemplate(embedNode);


    
    console.log(parseJSONencodedString( arrayOfAppData71));
}