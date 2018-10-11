//https://www.clicktime.com/ctc/devintern.html
var starts = [];
var stops = [];
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
    else
    {
        starts.push(d);
        alert("pushed");
    }

    if(state=="stop")
    {
        localStorage.setItem("start",JSON.stringify(starts));
        alert(JSON.stringify(starts));
        alert("saved");
        console.log(starts);
        alert(starts.toString());

    }
    // alert(state+" "+d.toTimeString());
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