/*frontend*/
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */


window.onload = async function(){
  let container = document.querySelector("section.clue-cont");
  const params =new URLSearchParams(window.location.search);
  let localityId = params.get("locality");
  var eventTriggered = false; 
 
 try{
    const query_params = new URLSearchParams();
     
    let myDbUrl = new URL("http://localhost/estate/new/streets");
    myDbUrl.searchParams.set("locality", localityId);
    let resp = await fetch(myDbUrl);
    let list = await resp.json();
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
  //locality
  url.searchParams.set("locality", localityId)
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