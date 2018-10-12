//https://www.clicktime.com/ctc/devintern.html
var starts = [];
var stops = [];
var lats = [];
var lons = [];
var state = "start";
window.onload = tableRebuild();
window.onbeforeunload = saveOnClose();


function geoFindMe() {
    var output = document.getElementById("out");
  
    if (!navigator.geolocation){
      output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
      return;
    }
  
    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
  
      output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
    
      lats.push(latitude);
      lons.push(longitude);
    //testing local storage
    //   localStorage.setItem("lat",latitude);
    //   localStorage.setItem("lon",longitude);
    }
  
    function error() {
      output.innerHTML = "Unable to retrieve your location";
    }
  
    output.innerHTML = "<p>Locating…</p>";
    
    navigator.geolocation.getCurrentPosition(success, error);
  }

//depreciating
function setTime(state)
{
    var d = new Date();
    if(starts.length<1||starts==undefined)
    {
        var ret = localStorage.getItem("start");
        alert(ret);
        if(ret!=undefined)
        {
            starts = JSON.parse(ret);
        }
        else starts.push(d);
        alert("starts is currently" + starts.toString());
    }
    
    if(starts.length>=1&&state=="start")
    {
        starts.push(d);
        alert("pushed start");
    }
    else
    {
        stops.push(d);
        alert("pushed stop");
    }

    if(state=="stop")
    {
        localStorage.setItem("start",JSON.stringify(starts));
        localStorage.setItem("stop",JSON.stringify(stops));
        alert(JSON.stringify(starts));
        alert("saved");
        console.log(starts);
        alert(starts.toString());

    }
    // alert(state+" "+d.toTimeString());
}

function fsSetTime()
{
    var d = new Date();
    if(state=="start")
    {
        starts.push(d);
        setTimeout(geoFindMe(),1000);
        genTable(state);
        state="stop";
        // alert("started timer");
    }
    else
    {
        stops.push(d);
        setTimeout(geoFindMe(),1000);
        genTable(state);
        state="start";
        // alert("stoped timer");
    }
}

function fsStop()
{
    
}

function getTime()
{
    alert("Start time was "+localStorage.getItem("start")+"\n"+"End time was "+localStorage.getItem("stop"));
}

function clrTime()
{
    starts=[];
    stops=[];
    localStorage.clear();
    delRow();
    alert("Local storage cleared");
}
function getLocal()
{
    var output = document.getElementById("myout");

    var lat = localStorage.getItem("lat");
    var lon = localStorage.getItem("lon");
    output.innerHTML = '<p>Latitude is ' + lat + '° <br>Longitude is ' +lon+ '°</p>';

}

function getRows()
{
    var totalRowCount = $("#myTable tr").length;
    return totalRowCount;
}

//TODO Fix position buffer to write for start and end
//TODO fix position buffer so that I dont read null on table clear which creates errors
function genTable(state)
{
    var table = document.getElementById("myTable");
    var pos = getRows();

    //before genTable is called, we try to update position and push to arrays
    //if there is no position to be found, we use last known, otherwise use the next statement
    //next statement will just set it to not found
    var lat = lats[lats.length-1];
    var lon = lons[lons.length-1];

    if(state == "start")
    {
        //if our coordinates arent defined, just set them as NA
        //this handles if we lose internet connection or some other error
        if(lat==undefined || lon == undefined)
        {
            alert("lat/lon not found");
            lat = "Not found";
            lon = "Not found";
        }
        var row = table.insertRow(pos);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);

        c1.innerHTML = "Lt "+lat.toString()+"<br>Ln "+lon.toString();
        c1.setAttribute("class","timeEnt");
        c2.innerHTML = starts[(starts.length)-1];
        c2.setAttribute("class","timeEnt");
        return;
    }
    else if(state=="stop")
    {
        var row = table.rows[pos-1];
        var c3 = row.insertCell(2);
        var c4 = row.insertCell(3);
        c3.innerHTML = "Lt "+lat.toString()+"<br>Ln "+lon.toString();
        c3.setAttribute("class","timeEnt");
        c4.innerHTML = stops[(stops.length)-1];
        c4.setAttribute("class","timeEnt");
        return;
    }
    else
    {
        alert("error case");
    }



}

function delRow() {
    $(".timeEnt").remove();
    state="start";
}

//TODO finish so that if data is loaded, rebuild table with said data
function tableRebuild()
{  
    var startTreload = localStorage.getItem("start");
    var stopTreload= localStorage.getItem("stop");
    var latReload = localStorage.getItem("lats");
    var lonReload = localStorage.getItem("lons");

    if(startTreload != undefined)
    {
        starts=JSON.parse(startTreload);
        alert("Start Times reloaded");
    }
    else
    {
        alert("no start times to reload");
    }
    if(stopTreload != undefined)
    {
        stops = JSON.parse(stopTreload);
        alert("Stop Times reloaded");
    }
    else
    {
        alert("no stop times to reload");

    }
    if(latReload != undefined)
    {
        lats = JSON.parse(latReload);
        alert("lats reloaded");
    }
    else
    {
        alert("no lats");
    }
    if(lonReload != undefined)
    {
        lons = JSON.parse(lonReload);
        alert("lons reloaded");

    }
    else
    {
        alert("no lons");
    }
    //if we have no positional data, poll for intial data to get permission, then clear the data to remove any bad data
}

//saves to local storage on close
//sometimes this doesnt work as expected, so i added a manual save button in the html to make the user feel responsible for saving their data
function saveOnClose()
{
    localStorage.setItem("start",JSON.stringify(starts));
    localStorage.setItem("stop",JSON.stringify(stops));
    localStorage.setItem("lons",JSON.stringify(lons));
    localStorage.setItem("lats",JSON.stringify(lats));
    alert("Data is saved locally");
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else { 
        alert("location services are not supported on this browser");
    }
}

function showPosition(position) {
    console.log(position.coords.latitude + "," + (position.coords.longitude));  
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location Unavailable");
            break;
        case error.TIMEOUT:
            console.log("Timeout Error");
            break;
        case error.UNKNOWN_ERROR:
            console.log("Unknown Error");
            break;
    }
}