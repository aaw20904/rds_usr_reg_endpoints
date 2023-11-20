window.onload = function () {

    function parseJSONencodedString (strWithEncoded) {
        let area = document.createElement("div");
        area.innerHTML = strWithEncoded;
        return  JSON.parse(area.textContent);
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