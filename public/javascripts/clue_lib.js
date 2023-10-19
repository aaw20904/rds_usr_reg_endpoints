class ClueInput{
    
    constructor(parentNode, list=[  
                                    "Oliver",
                                    "Olivia",
                                    "George",
                                    "Amelia",
                                    "Harry",
                                    "Isla",
                                    "Jack",
                                    "Ava",
                                    "Arthur",
                                    "Mia",
                                    "Leo",
                                    "Sophia",
                                    "Muhammad",
                                    "Grace",
                                    "Noah",
                                    "Lily",
                                    "Oscar",
                                    "Freya",
                                    "Charlie",
                                    "Ivy"], callBackToSend=()=>{}){
       this.parentNode = parentNode;
       this.list= new Set(list);
       this._callabckToSend = callBackToSend;
       this._onBtnSend = this._onBtnSend.bind(this);
       this._onChangeInput = this._onChangeInput.bind(this);
    }

    _onClickEventMenu(evt){
       let valueOfItem = evt.target.getAttribute("data-value");
       this.parentNode.querySelector("input.clue-input").value = valueOfItem;
    }

    _onBtnSend (evt) {
        let selectedParameter=this.parentNode.querySelector("input.clue-input").value;
        //checking - is the value exist in a list?
        if(this.list.has(selectedParameter)){
            this._callabckToSend(selectedParameter);
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

    _matchingArrayByTemplate(template="a", array=new Set(["apple", "bear", "garlic", "ananas", "gam", "12"])) {
        if(template.length < 1){
            //when a string is empty - return an empty array
            return [];
        }
        //there must be letters or numbers
        if (! /[A-Za-zА-Яа-я]/.test(template)) {
            return [];
        }

        let result = [];
        let tool= new RegExp(`^${template}\w*`);
        for (const a of array){
            if(tool.test(a)) {
                result.push(a)
            }
        }
        return result;
    }

   

    _createList (list=new Set(['1','2','3','4','5'])) {
        let listNode = this.parentNode.querySelector(".clue-menu")
        
        for (const itemText of list) {
            //create list item
            let listItem = document.createElement("li");
            listItem.classList.add("px-3","py-2");
            listItem.setAttribute("data-value",itemText);
            listItem.innerText = itemText;
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
        container.classList.add("clue-containerx", "w-100","d-flex", "flex-column", "justify-content-center", "align-items-center");
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
         //a button with "send" title
        let btnSend = document.createElement("button");
        btnSend.setAttribute("type","button");
        btnSend.classList.add("clue-send", "m-2", "rounded-2");
        btnSend.innerText = "Select"
        //button and input wrapper
        let btnInpWrapper = document.createElement("div");
        btnInpWrapper.classList.add("d-flex","w-100","py-2", "flex-row", "justify-content-start", "align-items-center");
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