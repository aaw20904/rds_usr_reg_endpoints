/*frontend*/
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */


window.onload = async function(){
  let container = document.querySelector("section.clue-cont");
  const params =new URLSearchParams(window.location.search);
  let searchRegion = params.get("region");
 
 try{
    const query_params = new URLSearchParams();
    query_params.append("region", searchRegion);
    let resp = await fetch(`../?${query_params.toString()}`);
    let list = await resp.json();
    let clue = new ClueInput(container,new Set(list),onNextStep); 
    clue.createFramework();
  }catch(e){
    alert(e);
  }

function onNextStep(val){
  let host = window.location.hostname;
  //crfeate new URL
  let url = new URL(`http://${host}/estate/new/localities/content/`);
  //search params
  url.searchParams.set("region",val);
  //jump to the new URL
  window.location.href=url.toString();

}
   
 
}