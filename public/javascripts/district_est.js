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
          let dbUrl = new URL(`http://${window.location.hostname}/estate/new/districts/`);
          dbUrl.searchParams.set("region",searchRegion);
         /* const query_params = new URLSearchParams();
          query_params.append("region", searchRegion);
          let resp = await fetch(`http://${window.location.hostname}/estate/new/districts/?${query_params.toString()}`);*/
          let resp = await fetch(dbUrl);
          let list = await resp.json();
          let clue = new ClueInput(container,new Set(list),onNextStep); 
          clue.createFramework();
      } catch (e) {
        alert(e);
      }

    function onNextStep (val) {
      let host = window.location.hostname;
      //crfeate new URL
      let url = new URL(`http://${host}/estate/new/localities/content/`);
      //search params - region
      url.searchParams.set("region", searchRegion);
      //search params - district
      url.searchParams.set("district", val.key_x);
      //jump to the new URL
       window.location.assign(url);
    }
      
 
}