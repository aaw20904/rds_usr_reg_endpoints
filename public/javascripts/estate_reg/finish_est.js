window.onload = function() {
    const params =new URLSearchParams(window.location.search);
    let localityId = params.get("locality");
    let streetType = params.get("street_type");
    let streetId = params.get("street_id");
    let building = params.get("building");
    let region = params.get("region");
    let flat = params.get("flat");


    let registrationButton = document.querySelector(".btn_registration");

    registrationButton.setAttribute("href",`http://${window.location.hostname}/estate/new/finish/insert?locality=${localityId}&street_type=${streetType}&street_id=${streetId}&building=${building}&flat=${flat}`);

    
    console.log(`region ${region}, locality ${localityId}, streetType ${streetType}, streetId ${streetId}, building ${building}, flat ${flat}`);


}