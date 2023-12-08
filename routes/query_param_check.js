let checker={}
checker.isSearchParamsExist = (query, listOfProps=["property1", "property2", "property3"]) => {
      //get properties (query params) that exists in the query
    let queyProps = Object.keys(query);
      //convert query props to the Set
    let querySet = new Set(queyProps);
      //checking - all the given properties exists in a query
   return listOfProps.every( (val)=>{
       //return querySet.has(val);
       return Boolean( query[val]);
    });

}

module.exports=checker;