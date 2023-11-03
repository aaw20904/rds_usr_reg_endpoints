
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */


window.onload = async function(){
  let container = document.querySelector("section.clue-cont");
  var eventTriggered = false; 

  try {
    let resp = await fetch(`http://${window.location.hostname}/estate/new/regions/`);
    let list = await resp.json();
    let clue = new ClueInput(container,new Set(list),onNextStep); 
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
   
 
}