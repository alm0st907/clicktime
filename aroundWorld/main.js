//https://www.clicktime.com/ctc/devintern.html
var starts = [];
var stops = [];
var lats = [];
var lons = [];
var deltas = [];
var state = "start";


$(document).ready(function(){
    // your code
    $("#showDiv").hide();
    tableRebuild();
    $("#perm").click(function(){
        alert("clicked intital perm");
        $("#showDiv").show();
    });
});

window.onbeforeunload = function(event) {
    // do something
    saveOnClose();
};

// document.onload = tableRebuild();
// window.onbeforeunload = saveOnClose();




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
      output.innerHTML = "Unable to retrieve your location. Start/Stop Position will contain last known location if one is available.";
    }
  
    output.innerHTML = "<p>Locating…</p>";
    
    navigator.geolocation.getCurrentPosition(success, error);
  }

function fsSetTime()
{
    var d = new Date();
    d= d.getTime();
    
    
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
        getTdelta();
        setTimeout(geoFindMe(),1000);
        genTable(state);
        state="start";
        
        // alert("stoped timer");
    }
}

function parseMillisecondsIntoReadableTime(milliseconds){
    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
  
  
    return h + ':' + m + ':' + s;
}

function getTdelta()
{
    if(stops.length==starts.length)
    {
        var t1 = starts[starts.length-1];
        var t2 = stops[stops.length-1];
        deltas.push(parseMillisecondsIntoReadableTime(t2-t1));
        // console.log(t2-t1);
        // console.log(d1);
        // console.log(d2);
        console.log(parseMillisecondsIntoReadableTime(t2-t1));

    }


}


function clrTime()
{
    starts=[];
    stops=[];
    lats=[];
    lons=[];
    deltas=[];
    localStorage.clear();
    delTable();
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
            lats.push(lat);
            lons.push(lon);
        }
        var row = table.insertRow(1);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);

        c1.innerHTML = "Lt "+lat.toString()+"<br>Ln "+lon.toString();
        c1.setAttribute("class","timeEnt");
        var rawTime = starts[starts.length-1];
        var readTime = new Date(rawTime).toTimeString();
        c2.innerHTML = readTime;
        c2.setAttribute("class","timeEnt");
        return;
    }
    else if(state=="stop")
    {
        if(lat==undefined || lon == undefined)
        {
            alert("lat/lon not found");
            lat = "Not found";
            lon = "Not found";
            lats.push(lat);
            lons.push(lon);
        }
        var row = table.rows[1];
        var c3 = row.insertCell(2);
        var c4 = row.insertCell(3);
        var c5 = row.insertCell(4);
        c3.innerHTML = "Lt "+lat.toString()+"<br>Ln "+lon.toString();
        c3.setAttribute("class","timeEnt");
        var rawTime = stops[(stops.length)-1];
        var readTime = new Date(rawTime).toTimeString();
        c4.innerHTML = readTime;
        c4.setAttribute("class","timeEnt");
        c5.setAttribute("class","timeEnt");
        c5.innerHTML = deltas[deltas.length-1];
        return;
    }
    else
    {
        alert("error case");
    }
}

function rebuildStart()
{
    var table = document.getElementById("myTable");
    for(i=0;i<starts.length;i++)
    {
        var lat = lats[i];
        var lon = lons[i];
        var row = table.insertRow(1);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);

        c1.innerHTML = "Lt "+lat.toString()+"<br>Ln "+lon.toString();
        c1.setAttribute("class","timeEnt");
        var rawTime = starts[i];
        var readTime = new Date(rawTime).toTimeString();
        c2.innerHTML = readTime;
        c2.setAttribute("class","timeEnt");
        if(stops[i]!=undefined)
        {
            lat = lats[i+1];
            lon = lons[i+1];
            rawTime = stops[i];
            readTime = new Date(rawTime).toTimeString();
            var delta = deltas[i];
            var c3 = row.insertCell(2);
            var c4 = row.insertCell(3);
            var c5 = row.insertCell(4);
            c3.innerHTML = "Lt "+lat.toString()+"<br>Ln "+lon.toString();
            c3.setAttribute("class","timeEnt");
            c4.innerHTML = readTime;
            c4.setAttribute("class","timeEnt");
            c5.setAttribute("class","timeEnt");
            c5.innerHTML = delta;
        }
        else
        {
            state= "stop";
        }
    }
    return;
}

function delTable() {
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
    var deltaReload = localStorage.getItem("deltas");

    if(startTreload != undefined)
    {
        starts=JSON.parse(startTreload);
        // alert("Start Times reloaded");
    }
    if(stopTreload != undefined)
    {
        stops = JSON.parse(stopTreload);
        // alert("Stop Times reloaded");
    }
    if(latReload != undefined)
    {
        lats = JSON.parse(latReload);
        // alert("lats reloaded");
    }
    if(lonReload != undefined)
    {
        lons = JSON.parse(lonReload);
        // alert("lons reloaded");

    }
    if(deltaReload != undefined)
    {
        deltas = JSON.parse(deltaReload);
        // alert("deltas reloaded");
    }
    

    if(lats==[]||lons==[]||starts==[]||stops==[]||deltas==[])
    {
        alert("Incomplete data save. Resetting Table");
    }
    else
    {
        rebuildStart();
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
    localStorage.setItem("deltas",JSON.stringify(deltas));
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