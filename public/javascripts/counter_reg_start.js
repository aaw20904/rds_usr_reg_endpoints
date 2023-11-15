window.onload = function(){
    class DynamicTable{
        constructor ( keys:{id:"estate_id",value:"desr"}, list:[{id:1, descr:"potato"},{id:2,descr:"apple" }], linkRet="http://localhost/counter/new/s1" ) {
            this.idName = keys.id;
            this.valueName = keys.value;
            this.baseLink = linkRet;
            arrayOfObjects = list;
        }

        createTemplate (nodeForEmbed) {
            let rows=[];
           for (let item of this.list) {
            let iteratedRow = this._createRow(item[this.idName],item[this.valueName]);
             rows.push(iteratedRow);
           }

           let myTable = this._createTable(rows);
           nodeForEmbed.appendChild(myTable);

        }

        _createTable (rows) {
            let table = document.createElement ("table");
            let tbody = document.createElement ("tbody");
            for ( let row of rows) {
                tbody.appendChild(row);
            }
            table.appendChild(tbody);
            return table;
        }

        _createRow (key, value) {
          let row = document.createElement("tr");
          let col = document.createElement("td");
          let link = document.createElement("a");
          link.setAttribute("href",`${this.baseLink}?${this.idName}=${key}`)
          link.innerText=value;
          col.appendChild(link);
          row.appendChild(col);
          return row;
        }
    }
    
    function parseJSONencodedString(strWithEncoded){
        let area = document.createElement("div");
        area.innerHTML = strWithEncoded;
        return  JSON.parse(area.textContent);
    }


    
    console.log(parseJSONencodedString( arrayOfAppData71));
}