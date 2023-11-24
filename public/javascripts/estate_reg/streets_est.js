/*frontend*/
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */


window.onload = async function(){
  let container = document.querySelector("section.clue-cont");
  const params =new URLSearchParams(window.location.search);
  let localityId = params.get("locality");
  let capitalCityId = false;
  //in case when redirecting
  let regionId = params.get("region");
  var eventTriggered = false; 
   //read embedded array
  var list = b64ToObject(arrayOfAppData71);

  //decoding inner array

   function b64ToObject(b64String){
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
 
 try{
    const query_params = new URLSearchParams();
     
    let myDbUrl = new URL("http://localhost/estate/new/streets");
    myDbUrl.searchParams.set("locality", localityId);
    if(regionId){
       myDbUrl.searchParams.set("region", regionId);
    }
   
    //let resp = await fetch(myDbUrl);
    //let list = await resp.json();
    if(list[0].locality){
      capitalCityId = list[0].locality;
    }
    let clue = new ClueInput(container,new Set(list),onNextStep); 
    clue.createFramework();
  }catch(e){
    alert(e);
  }

function onNextStep (val, linkNode) {
  if (eventTriggered) { 
    //when an event has been happend - exit (prevent recursion)
    return;
  }
  let host = window.location.hostname;
  //crfeate new URL
  let url = new URL(`http://${host}/estate/new/building/content`);
  let street_id, street_type;
  let parameters = val.key_x.split("@");
  street_type = parameters[0];
  street_id = parameters[1];
  //search params - region
   url.searchParams.set("street_type",street_type);
  //search params - district
   url.searchParams.set("street_id",street_id);
   if(regionId){
    //when capital cities (Kiev /Sevastopol)
        url.searchParams.set("locality",capitalCityId);
   }else{
      //locality
        url.searchParams.set("locality", localityId)
   }
  
  //assign an URL to link-button 
  linkNode.setAttribute("href",url.toString());
  //generate a new event "click"
  let clickEvt = new Event("click");
  //set trigger to prevent recursive event 
  eventTriggered = true;
  //push on a button
  linkNode.dispatchEvent(clickEvt);

}
   
 
}