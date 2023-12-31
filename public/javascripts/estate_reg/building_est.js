window.onload = async  function(){
  let myclass=new BuildingProcess(document.querySelector(".input_field"), 
                                        document.querySelector(".btn_go"),
                                        document.querySelector("p.msg"),);
   
}

class BuildingProcess {
    constructor(inputNode,btnNode,warningNode){
        this.clicked=false;
        this.inp=inputNode;
        this.btn=btnNode;
        this.warn=warningNode;
        const params =new URLSearchParams(window.location.search);
        //assign search params 
        this.searchParams={
            localityId:params.get("locality"),
            streetType:params.get("street_type"),
            streetId:params.get("street_id"),
         
        }
        //add listeners to nodes
        this.inp.addEventListener("input",this._onChangeInput.bind(this));
        btnNode.addEventListener("click", this._onPush.bind(this));


    }

    _onPush (evt) {
        if(this.clicked){
            return;
        }
        const regex = /[^A-Za-z0-9\u0410-\u042F\u0430-\u044F/]/g
        if(regex.test(this.inp.value)){
            return;
        }
            let host = window.location.hostname;
            //crfeate new URL
            let urlx = new URL(`http://${host}/estate/new/flat/content`);
            //search params - region
            urlx.searchParams.set("street_type",this.searchParams.streetType);
            //search params - district
            urlx.searchParams.set("street_id",this.searchParams.streetId);
            
            //building
            urlx.searchParams.set("building",this.inp.value);
        
                //locality
            urlx.searchParams.set("locality", this.searchParams.localityId);
           
           
             //assign an URL to link-button 
            this.btn.setAttribute("href",urlx.toString());
             //generate a new event "click"
            let clickEvt = new Event("click");

            //set trigger to prevent recursive event 
            this.clicked = true;
            //push on a button
            this.btn.dispatchEvent(clickEvt);
           
          
    }


    _onChangeInput (evt) {
        //hide warning
        const regex = /[^A-Za-z0-9\u0410-\u042F\u0430-\u044F/]/g
        if (!this.warn.innerText==" ") {
            //clear warn text and  red border of an input
            this.warn.innerText=" ";
             this.inp.classList.remove("input-warn");
             this.inp.classList.add("input-norm");
        }
       
       
         if(regex.test(this.inp.value)){
            this.inp.classList.remove("input-norm");
            this.inp.classList.add("input-warn");
            this.warn.innerText="Number can has only letters, numbers and / !"
         }
    }





}