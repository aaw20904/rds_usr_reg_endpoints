function objTobase64(inputObj) {
  let JsonString =JSON.stringify(inputObj);
//creating a buffer
  let buf = Buffer.from(JsonString,'utf-8');
//encode to Base64
  const base64String = buf.toString("base64");
return base64String;
}

function base64ToObj(encoded){
    let buf = Buffer.from(encoded,"base64");
    let utf8Enc = buf.toString("utf-8");
    let obj = JSON.stringify(utf8Enc);
    return obj;
}

module.exports={objTobase64, base64ToObj}