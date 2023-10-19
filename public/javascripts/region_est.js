
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */


window.onload = async function(){
  let container = document.querySelector("section.clue-cont");
  try{
    let resp = await fetch("../");
    let list = await resp.json();
    let clue = new ClueInput(container,new Set(list),(arg)=>alert(arg)); 
    clue.createFramework();
  }catch(e){
    alert(e);
  }

   
 
}