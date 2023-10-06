
/**
█▀▀ █▀█ █▀█ █▄░█ ▀█▀ █▀▀ █▄░█ █▀▄   █▀█ ▄▀█ █▀█ ▀█▀
█▀░ █▀▄ █▄█ █░▀█ ░█░ ██▄ █░▀█ █▄▀   █▀▀ █▀█ █▀▄ ░█░
 */
class bsDropRegion{
  
  constructor (par= [{id:1, name:"Bob"},{id:2, name:"Jessica"},{id:3, name:"Tom"},{id:3, name:"Helen"}]) {
    let template = par;
  }

  _createList () {
    let container = document.createElement("div");  
    container.classList.add('dropdown');
    let button = document.createElement("a");
    //button.setAttribute("role","button");
    button.setAttribute("href","#");
    button.setAttribute("id","dropdownMenuLink");
    button.setAttribute( "data-bs-toggle","dropdown");
    button.setAttribute("aria-expanded","false");
    button.innerText = "Select your region:";
    button.classList.add('btn', 'btn-secondary', 'dropdown-toggle');    

    let list = document.createElement('ul');
    list.classList.add("dropdown-menu","dropdown-menu-end", );
    list.setAttribute("aria-labelledby","dropdownMenuLink");
    container.appendChild(button);
    container.appendChild(list);
    return container;

  }

  _onButtonClick(event){
    //clear previuos selections:
      const clickedElement = event.target;
    let list = clickedElement.parentNode;
    let listOfChildren = list.childNodes;
    listOfChildren.forEach(n=>{
        n.classList.remove("selected");
    })
    
    //highlight selected now:
    clickedElement.classList.add("selected")
    console.log(event);
  }

  _appendListItems (dropdown, infoList=[{id:1, name:"y"}]) {
        let list = dropdown.querySelector("ul");
        let DOMelems = [];
        //create DOM elems and fill values
        for (const record of infoList) {
            let li = document.createElement("li");
            li.setAttribute("identyfier",record.id);
            li.classList.add("dropdown-item");
            li.innerText = record.name;
            DOMelems.push(li);
        }
        //append listeners and append to parent

        DOMelems.forEach(el=>{
            el.addEventListener("click",this._onButtonClick);
            dropdown.appendChild(el);
        })


  }

  parceInfoAndCreateComponent(items= [{id:1, name:"Bob"},{id:2, name:"Jessica"},{id:3, name:"Tom"},{id:3, name:"Helen"}]){
    let container = this._createList();
    this._appendListItems(container.querySelector("ul"), items);
    return container;
  }

  

}

window.onload = function(){
  let dropdownMaker =  new bsDropRegion();
  let insertPoint = document.querySelector("section");
  let component = dropdownMaker.parceInfoAndCreateComponent( [{id:1, name:"Bob"},{id:2, name:"Jessica"},{id:3, name:"Tom"},{id:3, name:"Helen"}])
  //insertPoint.appendChild(component);
 
}