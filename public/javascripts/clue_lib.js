class ClueInput{
    
    constructor(parentNode, list= [
        { key_x: 1, value_x: "Oliver" },
        { key_x: 2, value_x: "Harry" },
        { key_x: 3, value_x: "Jack" },
        { key_x: 4, value_x: "Charlie" },
        { key_x: 5, value_x: "Noah" },
        { key_x: 6, value_x: "Thomas" },
        { key_x: 7, value_x: "William" },
        { key_x: 8, value_x: "James" },
        { key_x: 9, value_x: "Michael" },
        { key_x: 10, value_x: "George" },
        { key_x: 11, value_x: "Leo" },
        { key_x: 12, value_x: "Isla" },
        { key_x: 13, value_x: "Olivia" },
        { key_x: 14, value_x: "Amelia" },
        { key_x: 15, value_x: "Lily" },
        { key_x: 16, value_x: "Sophie" },
        { key_x: 17, value_x: "Mia" },
        { key_x: 18, value_x: "Ava" },
        { key_x: 19, value_x: "Ella" },
        { key_x: 20, value_x: "Florence" },
        { key_x: 21, value_x: "Emily" },
        { key_x: 22, value_x: "Anya" },
        { key_x: 23, value_x: "Maisie" },
        { key_x: 24, value_x: "Isabella" },
        { key_x: 25, value_x: "Evie" },
], callBackToSend=()=>{/**the properties of an argument are: text as "value_x" and "key_x" as number  */}){
    /*create a MAP object from the list of objects*/
    //it needs to have "value_x" as a key_x in Map - iteration search matching implemented by the KEY n Map! 
       this.parentNode = parentNode;
       //A) convert to 2-dimension array
       let twoDimArray = [];
       for (const elem of list) {
            let item =[];
        //the first item in subarray can be textValue because it can be parameter for search/matching 
            item.push(elem.value_x);
            item.push(elem.key_x);
            twoDimArray.push(item);
       }
       //B) convert to Map

       this.list= new Map(twoDimArray);
       this._callabckToSend = callBackToSend;
       this._onBtnSend = this._onBtnSend.bind(this);
       this._onChangeInput = this._onChangeInput.bind(this);
    }

    _onClickEventMenu(evt){
       //let valueOfItem = evt.target.getAttribute("data-key");
       let valueOfItem = evt.target.innerText;
       this.parentNode.querySelector("input.clue-input").value = valueOfItem;
    }

    _onBtnSend (evt) {
        let selectedParameter=this.parentNode.querySelector("input.clue-input").value;
        //checking - is the value exist in a list?
        if(this.list.has(selectedParameter)){
            let key = this.list.get(selectedParameter);
            this._callabckToSend({value_x:selectedParameter, key_x:key},document.querySelector("a.clue-send"));
        } else {
            let warn = this.parentNode.querySelector("p.warning-string");
            let input = this.parentNode.querySelector("input.clue-input");
            warn.innerText="Please enter correct data from the list!";
            input.setAttribute("style","border-color:red !important;");


        }

        
    }

     _onChangeInput (evt) {
        //hide wrning
        let warn = this.parentNode.querySelector("p.warning-string");
        if(!warn.innerText==" "){
            //clear warn text and  red border of an input
             warn.innerText=" ";
             let input = this.parentNode.querySelector("input.clue-input");
             input.removeAttribute("style");
        }
            
        //remove li elems when exists
        this._removeList();
        //matching in according to user`s string
        let matched =  this._matchingArrayByTemplate(evt.target.value, this.list);
        //create a new <li> items
        this._createList(matched);
    }

    _matchingArrayByTemplate(template="O", db=new Map([[ 1,"Oliver"], [2,"Harry"], [3,"Jack" ], [16,"Sophie" ]])) {
        if(template.length < 1){
            //when a string is empty - return an empty array
            return [];
        }
        //there must be letters or numbers
        if (! /[A-Z,a-z,А-Я,а-я,_]/.test(template)) {
            return [];
        }

        let result = [];
        let tool= new RegExp(`^${template}\w*`);
        for (const [key,value] of db){
            if(tool.test(key)) {
                result.push([key,value])
            }
        }
        return new Map(result);
    }

   

    _createList (list=new Map([[ "Oliver", 1], ["Harry", 2], ["Jack", 3], ["Sophie", 4]])) {
        let listNode = this.parentNode.querySelector(".clue-menu")
        //attribute = 1; inner text = "Oliver"
        for (const [key,value] of list) {
            //create list item
            let listItem = document.createElement("li");
            listItem.classList.add("px-3","py-2");
            listItem.setAttribute("data-key",value);
            listItem.innerText = key;
            listNode.appendChild(listItem);
            listItem.addEventListener("click",this._onClickEventMenu.bind(this));  
            
        }
      
        return listNode;
    }

    _removeList () {
        let listNode = document.querySelector("ul.clue-menu");
        let arrayOfItems= Array.prototype.slice.call(listNode.childNodes);
        for(const item of arrayOfItems){
            item.removeEventListener("click",this._onClickEventMenu.bind(this));
            listNode.removeChild(item);
        }
    }

    createFramework () {
        //a container
        let container = document.createElement("section");
        container.classList.add("clue-container", "d-flex", "flex-column", "justify-content-center", "align-items-start");
        //unordered list (empty)
        let listNode = document.createElement('ul');
        listNode.classList.add ("clue-menu","p-0","m-0","d-block","w-100","rounded-2");
        //a html input
        let textInput = document.createElement("input");
        textInput.setAttribute("type","text");
        textInput.classList.add("clue-input");
        //a text warn string
        let warning = document.createElement("p");
        warning.classList.add("warning-string","p","text","text-danger", "p-1");
        warning.innerText=" ";
         //a link to go to next stage - "clue_send" class
        let btnSend = document.createElement("a");
        btnSend.setAttribute("href","#");
        btnSend.classList.add("clue-send", "m-2", "rounded-2");
        btnSend.innerText = "Go next"
        //button and input wrapper
        let btnInpWrapper = document.createElement("div");
        btnInpWrapper.classList.add("d-flex", "flex-row", "justify-content-start", "align-items-center");
        //event listener for a button
        btnSend.addEventListener('click',this._onBtnSend.bind(this));
        //when user typing something into the Input
        textInput.addEventListener("input",this._onChangeInput.bind(this))
        //asign child elems
        container.appendChild(warning);
        btnInpWrapper.appendChild(textInput);
         btnInpWrapper.appendChild(btnSend);
        container.appendChild(btnInpWrapper);
        this.parentNode.appendChild(container);
          this.parentNode.appendChild(listNode)
        
    }

    

}