window.onload = loadXML();//when window loads, loadXML function fires
var xmlhttp;
var xmlhttp2;
var id = [];// creates array for idis
var theatres =[]; //creates array of theatres
var index;//creates variable for the id index
var requestId;//variable for the id of the theatre needed for the request url 


    function loadXML() {//function that fires when window loaded
    xmlhttp = new XMLHttpRequest();//creates new XMLHttpRequest
  
    xmlhttp.open("GET", "https://www.finnkino.fi/xml/TheatreAreas/", true);// request with Finnkino API Theatre areas url 
    xmlhttp.send();//sends the request
    console.log(xmlhttp);//logs respond to the console
    }

    xmlhttp.onreadystatechange =function (){
       if (xmlhttp.readyState == 4 && xmlhttp.status == 200){//if ready state is 4 and status is 200 
         
           var FinKin = xmlhttp.responseXML;//stores response in the varible created
           console.log(FinKin);//logs the response into the console
           
           var cinemas= FinKin.getElementsByTagName("Name");//ctreates variable and stores there all cinemas names found by tag
           var idis=FinKin.getElementsByTagName("ID");//creates variable and stores there all theatres' idis found by tag

        for (var i = 0; i< cinemas.length; i++) {//goes through array with cinemas' names
             
           id[i]=idis[i].childNodes[0].nodeValue;//gets value from the idis array[i] and sets it with the index of [i] to the id array
            
           var cinema=cinemas[i].childNodes[0].nodeValue;//text (name of the cinema) for the option in the pull-down
           theatres[i]=cinema;//sets value to array theatres ith index of [i]  
               
           var textnode =document.createTextNode(cinema);//creates a textnode    
           var node = document.createElement("option");//creates an option element
           node.appendChild(textnode); //Appends the text to <option>   
           document.getElementById("cinema").appendChild(node);//appends <option> to <select>
        }
      }
   }
  $("#cinema").change(function (){//when user picks a cinema from the pull-down this function fires
    $( "#schedule" ).empty();  //removes elements from div #schedule previousely created
    $( "h1" ).remove();  //removes h1 element previousely created
    
      
    index = theatres.indexOf($("#cinema").val());//creates variable for the cinema's index from the id array, picks value from the pull-down and assings index of it (from the theatres array)to the variable 
    requestId = id[index];//gets id of the chosen theatre from the id array
    
    var url ="https://www.finnkino.fi/xml/Schedule/?area="+ requestId //url of the request with id of the requred cinema included
    
    xmlhttp2 = new XMLHttpRequest(); //creates new XMLHttpRequest
    xmlhttp2.open("GET", url, true);//request with the theatre ID in the string
    xmlhttp2.send();//sends the request
    console.log(xmlhttp2);//logs respond to the console
      
     xmlhttp2.onreadystatechange =function (){
       if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200){//if ready state is 4 and status is 200 
           var d = new Date();//creates variable and assigns it to the current date
           var strDate = d.getDate() + "." + (d.getMonth()+1) + "." + d.getFullYear();//from the current date gets date, month, year in that orded put them in the string for fruther use
           
           $( "#select" ).after( "<h1>Ongoing movies in "+$("#cinema").val()+" "+strDate+"</h1>" ); //creates new element <h1> with text about choosen cimnema
           $( "h1" ).hide();  //hides h1 element
           $( "h1" ).fadeIn('slow');  //animates the opacity of the matched elements
           var schedule = xmlhttp2.responseXML;//creates variable with value of responseXML
           console.log(schedule);//logs response in the console
           
           var pictures = schedule.getElementsByTagName("EventSmallImagePortrait");//creates valiable and  array of all images for of ongoing movies in this theatre
           var cinemasNames=schedule.getElementsByTagName("Theatre");//creates valiable and an array of all the theatres names
           
           var titles =schedule.getElementsByTagName("Title");//creates valiable and array of all movies' titles
           var times= schedule.getElementsByTagName("dttmShowStart");//creates valiable and array of all strat times
           
           for (var i = 0; i< pictures.length; i++) {//goes through array of pictures
               var node = document.createElement("div");//creates new div element
               node.className = 'block';//gives to new diw element class - block
               document.getElementById("schedule").appendChild(node);//appends new div to schedile
               
               var title=titles[i].childNodes[0].nodeValue;//gets the movie title name from the array of names
               var titlenode =document.createTextNode(title);//creates a textnode
               var newH2 = document.createElement("h2");//creates new <h2> element
               newH2.appendChild(titlenode);//appents the textnode to new <h2>
               node.appendChild(newH2);
               
               var picture=pictures[i].childNodes[0].nodeValue;//gets url of picture
               var newPicture = document.createElement("img");//creates new <img> element
               newPicture.src = picture;//sets scr for the new <img> element
               node.appendChild(newPicture); //appends <img> to new <div> .block
               
               var cinemaName=cinemasNames[i].childNodes[0].nodeValue;//gets the cinema name from the array of names
               var textnode =document.createTextNode(cinemaName);//creates a textnode
               var newH3 = document.createElement("h3");//creates new <h3> element
               newH3.appendChild(textnode);//appents the textnode to new <h3>
               node.appendChild(newH3); //appends <h3> to new <div>
              
               var t =times[i].childNodes[0].nodeValue;//gets strat time from the array of times
               var time = "Show starts at "+t.substring(11, 16);//extracts from "time" string only time (we do not need the date informtion)
                   
               var timetnode =document.createTextNode(time);//creates a textnode
               var new2H3 = document.createElement("h3");//creates new <h3> element
               new2H3.appendChild(timetnode);//appents the tmenode to new <h3>
               node.appendChild(new2H3); //appends <h3> to new <div>
            }
          $( ".block" ).hide();  //hides all alements with class block
          $( ".block" ).fadeIn('slow');  // animates the opacity of the matched elements
       }
  }});   