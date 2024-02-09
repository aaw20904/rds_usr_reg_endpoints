window.onload=function(){
     //reda search params
    var urlParams = new URLSearchParams(window.location.search);
    let estate_id = urlParams.get('estate_id');
    let counter_id = urlParams.get('counter_id');

 
    let inputElem = document.querySelector("#current_readings")
    inputElem.addEventListener("input", onInputChange);
    ////t a b l e   c l i c k    p r o c e s s i n g
    function onInputChange (evt) {
       let readings = evt.currentTarget.value;
     //set a http link:
     let ref = document.querySelector(".btn_next");
     ref.setAttribute("href",`http://${window.location.hostname}/readings/add/finish?estate_id=${estate_id}&counter_id=${counter_id}&readings=${readings}`);
    
    }
}