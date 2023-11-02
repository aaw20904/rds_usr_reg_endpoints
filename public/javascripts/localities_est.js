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
 
 try{
    const query_params = new URLSearchParams();
     
    let myDbUrl = new URL("http://localhost/estate/new/localities");
    myDbUrl.searchParams.set("region",searchRegion);
    myDbUrl.searchParams.set("district",searchDistrict);
    let resp = await fetch(myDbUrl.toString());
    let list = await resp.json();
    let clue = new ClueInput(container,new Set(list),onNextStep); 
    clue.createFramework();
  }catch(e){
    alert(e);
  }

function onNextStep(val){
  let host = window.location.hostname;
  //crfeate new URL
  let url = new URL(`http://${host}/estate/new/streets/content`);
  //search params - region
 // url.searchParams.set("region",searchRegion);
  //search params - district
  //url.searchParams.set("district",searchDistrict);
  //locality
  url.searchParams.set("locality",val.key_x)
  //jump to the new URL
 window.location.assign(url);
}
   
 
}