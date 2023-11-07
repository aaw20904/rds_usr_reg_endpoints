window.onload = function() {
    const params =new URLSearchParams(window.location.search);
    let localityId = params.get("locality");
    let streetType = params.get("street_type");
    let streetId = params.get("street_id");
    let building = params.get("building");
    let region = params.get("region");
    let flat = params.get("flat");
    console.log(`region ${region}, locality ${localityId}, streetType ${streetType}, streetId ${streetId}, building ${building}, flat ${flat}`);


}