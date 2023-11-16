class DynamicTable{
        constructor ( keys={id:"estate_id",value:"descr"}, 
        list=[{estate_id:1, descr:"potato"},{estate_id:2,descr:"apple" }],
         linkRet="http://localhost/counter/new/s1",
         additionalSearchParams={a:1,b:2} ) {
            this.idName = keys.id;
            this.valueName = keys.value;
            this.baseLink = linkRet;
            this.arrayOfObjects = list;
            this.additionalSearchParams = additionalSearchParams;
        }

        createTemplate (nodeForEmbed) {
            let rows=[];
           for (let item of this.arrayOfObjects) {
            let iteratedRow = this._createRow(item[this.idName],item[this.valueName]);
             rows.push(iteratedRow);
           }

           let myTable = this._createTable(rows);
           nodeForEmbed.appendChild(myTable);

        }

        _createTable (rows) {
            let table = document.createElement ("table");
            table.classList.add("w-100","p-1","table");
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
          row.classList.add("p-0","m-0");
          col.classList.add("p-0","m-0");
          col.classList.add("d-flex","justify-content-center","align-items-center","flex-row");
          let link = document.createElement("a");
          let href="";
          href+=`${this.baseLink}?${this.idName}=${key}`;
          //when additional params exists - add them to the URL
          if (this.additionalSearchParams) {
            let ownProps = Object.getOwnPropertyNames(this.additionalSearchParams);
            for(let key of ownProps) {
                href += `&${key}=${this.additionalSearchParams[key]}`;
            }
          }

          link.setAttribute("href",href)
          link.classList.add("a","table_row","m-1","w-100","text-center");
          link.innerText=value;
          col.appendChild(link);
          row.appendChild(col);
          return row;
        }
    }