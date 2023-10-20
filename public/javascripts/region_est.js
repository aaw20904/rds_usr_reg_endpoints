
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */


window.onload = async function(){
  let container = document.querySelector("section.clue-cont");
  try{
    let resp = await fetch("../");
    let list = await resp.json();
    let clue = new ClueInput(container,new Set(list),onNextStep); 
    clue.createFramework();
  }catch(e){
    alert(e);
  }

function onNextStep(val){
  let host = window.location.hostname;
  //crfeate new URL
  let url = new URL(`http://${host}/estate/new/districts/content/`);
  //search params
  url.searchParams.set("region",val);
  //jump to the new URL
  window.location.href=url.toString();

}
   
 
}