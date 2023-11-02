window.onload =  function () {

    let inputNode, btnNodeFlat, btnNodeAllBuilding;
    inputNode = document.querySelector("#input_field");
    btnNodeFlat = document.querySelector(".btn_flat");
    btnNodeAllBuilding = document.querySelector(".btn_building")
    
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
            if(!inputNode.value){
               
                msgNode.innerText = "Please enter firstly flat number!"
            }
            let host = window.location.hostname;
            //crfeate new URL
            let url = new URL(`http://${host}/estate/new/finish`);
      
            url.searchParams.set ("street_id",streetId);
            //locality
            url.searchParams.set ("locality", localityId);
           
           
            //search params - region
            url.searchParams.set ("street_type", streetType);
              //building
            url.searchParams.set ("building", buildng);
            //flat
            url.searchParams.set ("flat",inputNode.value)
            //jump to the new URL
            window.location.href = url.toString();
    }

    function onPushAllBuilding (evt) {
            let host = window.location.hostname;
            //crfeate new URL
            let url = new URL(`http://${host}/estate/new/finish`);
      
            url.searchParams.set("street_id", streetId);
            //locality
            url.searchParams.set("locality", localityId);
            //search params - region
            url.searchParams.set("street_type", streetType);
           //building
            url.searchParams.set("building", inputNode.value);
            //jump to the new URL
             window.location.assign(url);
    }
}