class DynamicMultiColTable{
    #rowTitles;
    #rowKeys;
    #identifierOfRow;
       constructor( idName="id",
                    rowKeys=["one","two","three"],
                    rowTitles=["rock","paper","scissors"], 
                    callback=null ) {
        this.#rowTitles = rowTitles;
        this.#rowKeys = rowKeys; 
        this.#identifierOfRow = idName;
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

       #createRow (params={id:215, one:"ever",two:"and",three:"never" }, callback=null) {
            let tr = document.createElement("tr");
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

       createTable (rows=[{id:215, one:"ever", two:"and", three:"never" },
                    {id:215, one:"ever",two:"and",three:"never" },
                    {id:215, one:"ever",two:"and",three:"never" }], pNode, cb=null)   {
            
            //create a table node 
            let table = document.createElement("table");
            table.classList.add("table");
            //create  <tbody> node 
            let tbody = document.createElement("tbody");
            //create a table`s head
            let thead = this.#createTableHeader();
            //iterate rows
            for (let rowData of rows) {
                //create a row node and assign to the parent node
                tbody.appendChild(this.#createRow(rowData,cb));
            }
            //assign header
            table.appendChild(thead);
            //and <tbody>
            table.appendChild(tbody);
            pNode.appendChild(table);
        
       }
    }