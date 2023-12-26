class DynamicMultiColTable{
    #rowTitles;
    #rowKeys;
    #identifierOfRow;
    #externCallback;
    #onClickHandler;
    /*
    When a user lick on a row of a table - the KEY of a row pass to the exten callback
    For exaple, we have an info: [{id:1, c1:"apple", c2:"tomato", c3:"Tom" },{id:2, c1:"cherry", c2:"corn", c3:"Jerry"}]
    `idName` - a name of property that will be used as a KEY for a row
    `rowKeys` - names of properties that will be used to construcing of table rows
    `rowTitlles` - it will be titles of table rows.  
     */
       constructor( idName="id",
                    rowKeys=["c1", "c2", "c3"],
                    rowTitles=["fructs","vegetables","client"]
                    ) {
        this.#rowTitles = rowTitles;
        this.#rowKeys = rowKeys; 
        this.#identifierOfRow = idName;
        this.#externCallback = null;
        //click event handler
        /* important: before use
        
█   █▀▄ █▀▀ █▀▀ █ █▄░█ █▀▀   █░█ █▀ █▀▀ █░░ █▀▀ █▀▀ ▀█▀ █▀▀ █▀▄   █▀█ █▀█ █░█░█ █░█   █ █▄░█   █▀▀ █▀ █▀   █
▄   █▄▀ ██▄ █▀░ █ █░▀█ ██▄   ░░░ ▄█ ██▄ █▄▄ ██▄ █▄▄ ░█░ ██▄ █▄▀   █▀▄ █▄█ ▀▄▀▄▀ ░░░   █ █░▀█   █▄▄ ▄█ ▄█   ▄
         */
        this.#onClickHandler = (evt)=>{
            // F I R S T L Y - clean all the rows from "highlight" style and assignin "highlight" to selected row:
            //iterate all the rows
           let rows =  evt.target.parentElement.parentElement.getElementsByTagName('tr');
           for (let row of rows) {
                row.classList.remove("selected_row");
           }
            //set highlight style for selected row:
            evt.target.parentElement.classList.add("selected_row");
            ////S E C O N D L Y: read a key value of selected row and pass it to the extern  callback function (when exists)
            if (this.#externCallback) {
                //returns a value of a key of the selected row to extern callbak function
                this.#externCallback(evt.target.parentElement.getAttribute(`data-${this.#identifierOfRow}`));
            } 
        }
       }

       #createTableHeader() {
            let theader = document.createElement("thead");
            let tRow = document.createElement("tr");
            for (let prop of this.#rowTitles) {
                    let th = document.createElement("th");
                    //set attribute in according to the Bootstrap
                    th.setAttribute("scope","col");
                    th.innerText = prop;
                    //assign to the parent
                    tRow.appendChild(th);
            }

            theader.appendChild(tRow);
            return theader;

       }

       #createRow (params={id:215, one:"ever", two:"and", three:"never"}, callback=null) {
            let tr = document.createElement("tr");
            tr.classList.add("clickable_row");
            //assign valure of the identifier of a row
            tr.setAttribute(`data-${this.#identifierOfRow}`,params[this.#identifierOfRow]);
            for (let key of this.#rowKeys) {
                //read value of a specified column
                let value = params[key];
                let td = document.createElement("td");
                td.innerText = value;
                //append to a parnt node
                tr.appendChild(td);
            }
            //add event listener - when it exists
            if (callback) {
                tr.addEventListener('click', callback);
            }
            return tr;
       }
   ///`rows` array must contains keys of strig (`id` in this example) and   
       createTable (rows= [{id:1, c1:"apple", c2:"tomato", c3:"Tom" },
                           {id:2, c1:"cherry", c2:"corn", c3:"Jerry"},
                           {id:3, c1:"banana", c2:"garlic", c3:"Goffy"}, ],
                            pNode, cb=null, tableStyles=["table-bordered","table"])   {
            //assign callback handler
            if (cb) {
                this.#externCallback = cb;
            }
            //create a table node 
            let table = document.createElement("table");
            for (let rule of tableStyles){
                 table.classList.add(rule);
            }
           
            //create  <tbody> node 
            let tbody = document.createElement("tbody");
            //create a table`s head
            let thead = this.#createTableHeader();
            //iterate rows
            for (let rowData of rows) {
                //create a row node and assign to the parent node
                tbody.appendChild(this.#createRow(rowData,this.#onClickHandler));
            }
            //assign header
            table.appendChild(thead);
            //and <tbody>
            table.appendChild(tbody);
            pNode.appendChild(table);
        
       }
    }