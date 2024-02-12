var webkam = {
  // a taken upper area 
    takenArea: {
      aspectRatioW: 0.7 , //always be 1
      aspectRatioH: 0.2,
    },
  // (A) INITIALIZE
  hVid : null, hSnaps :null, hTake : null, hSave : null,
  init : () => {
    // (A1) GET HTML ELEMENTS
    webkam.hVid = document.getElementById("kam-live"),
    webkam.hSnaps = document.getElementById("kam-snaps"),
    webkam.hTake = document.getElementById("kam-take"),
    webkam.hSave = document.getElementById("save-results");
    webkam.hRecognize = document.getElementById("recognize-results");

    webkam.hVid.addEventListener('play',()=>{
      let marker = document.querySelector(".marker");
       //plot video area pros:
        console.log(webkam.hVid.clientWidth, webkam.hVid.clientHeight);
         //calculate dimensions of marker (bar):
        let markerWidth = Math.round(webkam.hVid.clientWidth * webkam.takenArea.aspectRatioW);
        let markerHeight = Math.round(webkam.hVid.clientHeight * webkam.takenArea.aspectRatioH);
          //apply dimensions
        marker.style.width = `${markerWidth}px`;
        marker.style.height = `${markerHeight}px`;
          //calc position of the marker bar (offsets):
        let leftOffset = Math.round(((webkam.hVid.clientWidth - markerWidth) / 2));
        let topOffset = Math.round((webkam.hVid.clientHeight - markerHeight) / 2);
          //set position of the marker
        marker.style.top=`${topOffset}px`;
        marker.style.left=`${leftOffset}px`;
         //read search params - counter_id estate_id:
         var urlParams = new URLSearchParams(window.location.search);
        let estate_id = urlParams.get('estate_id');
        let counter_id = urlParams.get('counter_id');
          //aply to the form:
        let estateIn = document.querySelector(".estate_id");
        let counterIdIn = document.querySelector(".counter_id");
        let form = document.querySelector("form.form");
          //apply counter params and the path
        estateIn.setAttribute("value", estate_id, );
        counterIdIn.setAttribute("value", counter_id);
        //form.setAttribute("action","../rec_1");
    })

  
    window.addEventListener("resize",(evt)=>{
      let live = document.getElementById("kam-live");
      console.log(live.clientWidth, live.clientHeight );
      //set position of the marker
        let marker = document.querySelector(".marker"); 
      //calculate dimensions of marker (bar):
        let markerWidth = Math.round(webkam.hVid.clientWidth * webkam.takenArea.aspectRatioW);
        let markerHeight = Math.round(webkam.hVid.clientHeight * webkam.takenArea.aspectRatioH);
      //apply dimensions
        marker.style.width = `${markerWidth}px`;
        marker.style.height = `${markerHeight}px`;
      //calc position of the marker bar (offsets):
        let leftOffset = Math.round(((webkam.hVid.clientWidth - markerWidth) / 2));
        let topOffset = Math.round((webkam.hVid.clientHeight - markerHeight) / 2);
      //set position of the marker
        marker.style.top=`${topOffset}px`;
        marker.style.left=`${leftOffset}px`;

    });


 
    // (A2) GET USER PERMISSION TO ACCESS CAMERA
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      // "LIVE FEED" WEB CAM TO <VIDEO>
      webkam.hVid.srcObject = stream;
      // add listeners
      webkam.hTake.onclick = webkam.take;
      webkam.hRecognize.onclick = webkam.save;
      webkam.hTake.disabled = false;
      webkam.hSave.disabled = false;
    })
    .catch((err) => { console.error(err); });
  },

  // (B) HELPER - SNAP VIDEO FRAME TO CANVAS
  snap : () => {
    // (B1) CREATE NEW CANVAS
    let canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),

    vWidth = webkam.hVid.videoWidth,
    vHeight = webkam.hVid.videoHeight;
        //calculate dimensions of the area to copy in according to fact video resolution:
    let copyWindowW =  Math.round(webkam.hVid.videoWidth * webkam.takenArea.aspectRatioW);
    let copyWindowH = Math.round(webkam.hVid.videoHeight * webkam.takenArea.aspectRatioH);
        //calculate strart point for copying:
    let startX, startY;
    startX = Math.round( (webkam.hVid.videoWidth / 2) - (copyWindowW / 2) );
    startY = Math.round( (webkam.hVid.videoHeight / 2) - (copyWindowH / 2 ) );

     // (B2) CAPTURE VIDEO FRAME TO CANVAS
    canvas.width = copyWindowW;
    canvas.height = copyWindowH;
     //destinationContext.drawImage(sourceCanvas,      sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.drawImage(webkam.hVid, startX, startY, copyWindowW, copyWindowH, 0, 0, copyWindowW, copyWindowH);
    console.log(webkam.hVid)
    //show button "send","recognize"
    webkam.hSave.classList.remove("d-none");
    webkam.hRecognize.classList.remove("d-none");

    // (B3) DONE
    return canvas;
  },
   removeAllChildren: (node) => {
      while (node.firstChild) {
          node.removeChild(node.firstChild);
      }
    },
  // (C) TAKE A SNAPSHOT - PUT CANVAS INTO <DIV> WRAPPER
  take : () => {
     webkam.removeAllChildren(webkam.hSnaps);
     let child = webkam.snap();
     child.classList.add("img-fluid","img-thumbnail","taken");
    webkam.hSnaps.appendChild(child);
  },
  // (D) SAVE SNAPSHOT
  save : async () => {
    //converting canvas to blob:
     let blobImage =   await new Promise((resolve, reject) => {
                let canvas  = document.querySelector(".taken");
                canvas.toBlob((blob)=>{
                  resolve(blob)
                }, 'image/gif')
      });

      ///send to a server
      await new Promise((resolve, reject) => {
        let progrressspinner = document.querySelector(".progress_");
        progrressspinner.classList.remove("d-none");
         let decoded = document.querySelector(".decoded");
          fetch(`http://${window.location.hostname}/readings/add/rec1`, {
              method: 'POST',
              headers: {
               'Content-Type': 'application/octet-stream',
               'Content-Length': blobImage.size.toString(),
              },
              body: blobImage,
          })
          .then(response=>{
                if(response.status==200){
                  return  response.json()
                } else {
                    throw new Error("The server  is unreachable!")
                }
            })
          .then(data=>{
           
            decoded.value = data.TXT;
            progrressspinner.classList.add("d-none");
          })
          .catch(e=>{
            
            alert(e.toString());
             
          })
      });
    
  },

  linkListener:(evt)=>{
    evt.preventDefault(); // Prevent the default behavior of the link
       // search params
    var urlParams = new URLSearchParams(window.location.search);
    let estate_id = urlParams.get('estate_id');
    let counter_id = urlParams.get('counter_id');
    ///read readings from the <input>:
    let inp = document.getElementById("readingsofcounter");

    // Get the current URL
    var ref = document.querySelector(".final_lnk");
    ref.setAttribute("href",`http://${window.location.hostname}/readings/add/finish?estate_id=${estate_id}&counter_id=${counter_id}&readings=${inp.value}`);
    var clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });
    ref.removeEventListener("click",webkam.linkListener);
    ref.dispatchEvent(clickEvent);

  }
};
let video =  document.getElementById("kam-live");

window.addEventListener("load", webkam.init);
window.onload=function(){
  let lnk = document.querySelector(".final_lnk");
  lnk.addEventListener("click",webkam.linkListener);
}


  