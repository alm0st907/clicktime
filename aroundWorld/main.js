//https://www.clicktime.com/ctc/devintern.html
var starts = [];
var stops = [];
var state = "start";
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

    //testing local storage
      localStorage.setItem("lat",latitude);
      localStorage.setItem("lon",longitude);
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
        state="stop";
        alert("started timer");
    }
    else
    {
        stops.push(d);
        state="start";
        alert("stoped timer");
        localStorage.setItem("start",JSON.stringify(starts));
        localStorage.setItem("stop",JSON.stringify(stops));

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
    alert("Local storage cleared");
}
function getLocal()
{
    var output = document.getElementById("myout");

    var lat = localStorage.getItem("lat");
    var lon = localStorage.getItem("lon");
    output.innerHTML = '<p>Latitude is ' + lat + '° <br>Longitude is ' +lon+ '°</p>';

}

function genTable()
{
    var table = document.getElementById("myTable");
    var row = table.insertRow(0);
    var c1 = row.insertCell(0);
    var c2 = row.insertCell(1);
    var c3 = row.insertCell(2);
    var c4 = row.insertCell(3);

    var lat = localStorage.getItem("lat");
    var lon = localStorage.getItem("lon");
    c1.innerHTML = lat.toString();
    c2.innerHTML = lon.toString();
    c3.innerHTML = starts[(starts.length)-1];
    c4.innerHTML = stops[(stops.length)-1];
}

function delRow() {
    $("#myTable tr").remove();
}