window.onload =  function(){

    let inputNode, btnNode;
    inputNode = document.querySelector("#input_field");
    btnNode = document.querySelector(".btn");
      const params =new URLSearchParams(window.location.search);
  let localityId = params.get("locality");
  let streetType = params.get("street_type");
  let streetId = params.get("street_id");

     //matching in according to user`s string - any exclude "A-Z a-z а-я / 0-9""
         const regex = /[^A-Za-z0-9\u0410-\u042F\u0430-\u044F/]/g

    inputNode.addEventListener("input",_onChangeInput);
    btnNode.addEventListener("click", onPush.bind(this));

     function  _onChangeInput (evt) {
        //hide warning
        let warn = document.querySelector("p.msg");
        if (!warn.innerText==" ") {
            //clear warn text and  red border of an input
             warn.innerText=" ";
             inputNode.classList.remove("input-warn");
             inputNode.classList.add("input-norm");
        }
       
       
         if(regex.test(inputNode.value)){
            inputNode.classList.remove("input-norm");
             inputNode.classList.add("input-warn");
            warn.innerText="Number can has only letters, numbers!"
         }
    }


    function onPush (evt) {

        if(regex.test(inputNode.value)){
            return;
        }
            let host = window.location.hostname;
            
            //crfeate new URL
            let url = new URL(`http://${host}/estate/new/flat/content`);
      
           
            //search params - region
            url.searchParams.set("street_type",streetType);
            //search params - district
            url.searchParams.set("street_id",streetId);
            //locality
            url.searchParams.set("locality", localityId);
            //building
            url.searchParams.set("building",inputNode.value);
            //jump to the new URL
            window.location.href=url.toString();
           

        

    }
}