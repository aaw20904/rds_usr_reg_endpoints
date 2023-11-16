window.onload = function () {

    function parseJSONencodedString (strWithEncoded) {
        let area = document.createElement("div");
        area.innerHTML = strWithEncoded;
        return  JSON.parse(area.textContent);
    }
    //parsing inner embedded array
    let innerInfo = parseJSONencodedString( arrayOfAppData71);
    //reda search params
    var urlParams = new URLSearchParams(window.location.search);
    let estate_id = urlParams.get('estate_id');

    let embedNode = document.querySelector(".clue-cont");
    let dynTable = new DynamicTable({id:"counter_type",value:"descr"},
                                        innerInfo, 
                                        `http://${window.location.hostname}/counter/new/step3`,
                                        {estate_id:estate_id});
    dynTable.createTemplate(embedNode);


    
    console.log(parseJSONencodedString( arrayOfAppData71));
}