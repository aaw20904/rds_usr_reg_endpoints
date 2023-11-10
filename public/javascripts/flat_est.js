window.onload =  function () {

    let inputNode, btnNodeFlat, btnNodeAllBuilding;
    inputNode = document.querySelector("#input_field");
    btnNodeFlat = document.querySelector(".btn_flat");
    btnNodeAllBuilding = document.querySelector(".btn_building")
    let clicked = false;
    
    const params =new URLSearchParams(window.location.search);
    let localityId = params.get("locality");
    let streetType = params.get("street_type");
    let streetId = params.get("street_id");
    let buildng = params.get("building");
    
     let msgNode=document.querySelector(".msg");//node for warnings
  //adding event listners
    btnNodeFlat.addEventListener("click", onPushFlat.bind(this));
    btnNodeAllBuilding.addEventListener("click", onPushAllBuilding.bind(this));
    inputNode.addEventListener("input",()=>{
        //clear warning when typing
        msgNode.innerText=" ";
    })

    function onPushFlat (evt) {
            //has a link been clicked?
            if (clicked) {
              //when yes, exit to prevent recursion
              return;
            }
            if (!inputNode.value) {
                msgNode.innerText = "Please enter firstly flat number!"
                return;
            }
            let host = window.location.hostname;
            //crfeate new URL
            let url = new URL(`http://${host}/estate/new/finish`);
         
               //locality
               url.searchParams.set ("locality", localityId);
             
            url.searchParams.set ("street_id",streetId);
            //search params - region
            url.searchParams.set ("street_type", streetType);
              //building
            url.searchParams.set ("building", buildng);
            //flat
            url.searchParams.set ("flat",inputNode.value)
            //assign an URL to link-button 
            btnNodeFlat.setAttribute("href",url.toString());
            //generate a new event "click"
            let clickEvt = new Event("click");

            //set trigger to prevent recursive event 
            clicked = true;
            //push on a button
            btnNodeFlat.dispatchEvent(clickEvt);
    }

    function onPushAllBuilding (evt) {
            //has a link been clicked?
            if(clicked){
              //to prevent recursion
              return;
            }
            let host = window.location.hostname;
            //crfeate new URL
            let url = new URL(`http://${host}/estate/new/finish`);
      
           
            //locality
            url.searchParams.set ("locality", localityId);
          

            url.searchParams.set("street_id", streetId);
           
            
            url.searchParams.set("street_type", streetType);
           //building
            url.searchParams.set("building", buildng);
           //assign an URL to link-button 
            btnNodeAllBuilding.setAttribute("href",url.toString());
            //generate a new event "click"
            let clickEvt = new Event("click");
            //set trigger to prevent recursive event 
            clicked = true;
            //push on a button
            btnNodeAllBuilding.dispatchEvent(clickEvt);
    }
}