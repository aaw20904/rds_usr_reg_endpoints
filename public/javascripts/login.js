window.onload=function(){
    let formNode = document.querySelector(".form");
    formNode.setAttribute("action",`http://${window.location.hostname}/login/`);
}