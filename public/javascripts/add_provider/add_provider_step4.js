window.onload = function(){

    //reads search params:
      const params =new URLSearchParams(window.location.search);
     let counter_id =  params.get("counter_id");
     let provider_id =  params.get("provider_id");

     let cntNode = document.getElementById("counter_id");
     let provIdNode  = document.getElementById("provider_id");

     cntNode.value = counter_id;
     provIdNode.value = provider_id;

     let form = document.querySelector("form");
     form.setAttribute("action",`http://${window.location.hostname}/providers/add/step5`)

    //let dynTable = new DynamicTable({id:"estate_id",value:"descr"}, innerInfo, `http://${window.location.hostname}/providers/add/step2`,false);
    //dynTable.createTemplate(embedNode);

}