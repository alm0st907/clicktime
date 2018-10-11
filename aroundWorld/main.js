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
        genTable(state);
        state="stop";
        // alert("started timer");
    }
    else
    {
        stops.push(d);
        genTable(state);
        state="start";
        // alert("stoped timer");
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

function genTable(state)
{
    var table = document.getElementById("myTable");
    var pos = getRows();
    var lat = localStorage.getItem("lat");
    var lon = localStorage.getItem("lon");
    if(state == "start")
    {
        var row = table.insertRow(pos);
        var c1 = row.insertCell(0);
        var c2 = row.insertCell(1);
        c1.innerHTML = "Lt "+lat.toString()+"<br>Ln "+lon.toString();
        c1.setAttribute("class","timeEnt");
        c2.innerHTML = starts[(starts.length)-1];
        c2.setAttribute("class","timeEnt");
    }
    else
    {
        var row = table.rows[pos-1];
        var c3 = row.insertCell(2);
        var c4 = row.insertCell(3);
        c3.innerHTML = "N/A";
        c3.setAttribute("class","timeEnt");
        c4.innerHTML = stops[(stops.length)-1];
        c4.setAttribute("class","timeEnt");
    }



}

function delRow() {
    $(".timeEnt").remove();
}