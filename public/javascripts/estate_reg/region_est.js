
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */


window.onload = async function () {
  let container = document.querySelector("section.clue-cont");
  var eventTriggered = false; 
  //read embedded array
  var list = b64ToObject(arrayOfAppData71);

  try {
    //let resp = await fetch(`http://${window.location.hostname}/estate/new/regions/`);
    //let list = await resp.json();
    let clue = new ClueInput(container,new Set(list), onNextStep); 
    clue.createFramework();
  } catch(e) {
    alert(e);
  }

function onNextStep(val, linkNode){
 
      if(eventTriggered){ 
        //when an event has been happend - exit (prevent recursion)
        return;
      }

      let host = window.location.hostname;
      //crfeate new URL
      let url = new URL(`http://${host}/estate/new/districts/content/`);
      //search params
      url.searchParams.set("region",val.key_x);
      //assign an URL to link-button 
      linkNode.setAttribute("href",url.toString());
      //generate a new event "click"
      let clickEvt = new Event("click");

      //set trigger to prevent recursive event 
      eventTriggered = true;
      //push on a button
      linkNode.dispatchEvent(clickEvt);
      
}


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
   
 
}