/*frontend*/
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */


window.onload = async function(){
  let container = document.querySelector("section.clue-cont");
  const params =new URLSearchParams(window.location.search);
  let searchRegion = params.get("region");
  let searchDistrict =  params.get("district");
  let eventTriggered = false;
   //read embedded array
  var list = parseJSONencodedString(arrayOfAppData71);

  //decoding inner array
  function parseJSONencodedString(strWithEncoded){
        let area = document.createElement("div");
        area.innerHTML = strWithEncoded;
        return  JSON.parse(area.textContent);
    }

    
 try{
    const query_params = new URLSearchParams();
     
    let myDbUrl = new URL(`http://${window.location.hostname}/estate/new/localities`);
    myDbUrl.searchParams.set("region",searchRegion);
    myDbUrl.searchParams.set("district",searchDistrict);
    //let resp = await fetch(myDbUrl);
    //let list = await resp.json();
    let clue = new ClueInput(container,new Set(list),onNextStep); 
    clue.createFramework();
  }catch(e){
    alert(e);
  }

function onNextStep (val, linkNode) {
   if(eventTriggered){ 
    //when an event has been happend - exit (prevent recursion)
    return;
  }

  let host = window.location.hostname;
  //crfeate new URL
  let url = new URL(`http://${host}/estate/new/streets/content`);
  //locality
  url.searchParams.set("locality",val.key_x)
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