//https://www.clicktime.com/ctc/devintern.html
/* 
I used arrays for sake of simplicity in this prototype.
Ideally a data structure would be better suited for the project and make the code cleaner
    I was time constrained due to exams and valued a functioning prototype above the "perfect" prototype

latitutde and longitutde arrays MUST be read in start/stop order when used
    but this gets rid of an extra array

state is a global var for the start/stop status of the start/stop button
*/
var starts = [];
var stops = [];
var lats = [];
var lons = [];
var deltas = [];
var state = "start";

//jquery to check for page load, and handle all necssary behaviors
$(document).ready(function(){
    // your code
    $("#showDiv").hide();//intitially hide all other UI
    //we dont want to show UI till we have user location permission
    //otherwise we get bad data, even though the user may have internet connection
    
    tableRebuild();
    //once we have the basic permission for the app. call table rebuild to redisplay old data
    //on permission click/grant show the UI
    $("#perm").click(function(){
        // alert("clicked intital perm");
        $("#showDiv").show();
    });
});

//non jquery way to check for window exit/refresh and call our save fucntion automatically
window.onbeforeunload = function(event) {
    // do something
    saveOnClose();
};

// document.onload = tableRebuild();
// window.onbeforeunload = saveOnClose();



//function ripped from API example from mozilla and "repurposed"
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


  //functional "set time"
  //checks global var state for start/stop state to see which action to perform
  //like a real stopwatch
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


//parser to create a "usable" delta time for the user to read
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

//calculating time deltas for the stretch goals based on UTC timestamps
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

//function to clear data locally, and the storage
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

//simple subfunction to get rows of the table using jquery
function getRows()
{
    var totalRowCount = $("#myTable tr").length;
    return totalRowCount;
}

//function used to generate table entries on stop/start clicks
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

//taking reloaded data and rebuilding the data on the website for persistance
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

//function to reload our data, and if the data is not "bad" we call our table rebuildStart
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
