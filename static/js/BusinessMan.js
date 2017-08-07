//for tutorial
var tut=0;
//global var for players name
var name = document.getElementById("name").value;
//day [0], month [1], year [2]
var date = [22, 7, 15];
//time in number form
var time = 720;
var money = 0;
var status = "Rock Bottom";
var place;
//max energy
var maxEner = 100;
var energy = 100;
//max hunger
var maxHun = 100;
var hunger = 100;
//the buildings title currently selected
var titl;
//the buildings job title applying for currently selected
var appjobtitl;
//the buildings job hour working applying for currently selected
var appjobhou;
//the buildings job wage applying for currently selected
var appjobsal;
//the buildings job additional notes applying for currently selected
var appjobadin;
//the buildings energy cost and time taken to go and carry out action
var cost;
//the name of the button on the panel to carry out action
var actions="";
var applyBtn="";
//proposal date
var popDate = [22,7,15];
//benefits appointment date
var benDate = [0,0,0];
//checkout total cost of items
var checkout = 0;
//0=priceCost, 1=energyGained, 2=hungerGained 3=timeUsingItem
var prices = {Apple:[32,3,5,3] , Pen: [15,0,0,0], Drink: [79,5,0,3]};
//inventory
var inventoryItems = {Apple:0,Pen:0,Drink:0};
//checkout stock
var checkoutStock = {Apple:0,Pen:0,Drink:0}; 
//application stage //0=no app //1=obtained //2=has an incomplete app //3=has a complete app //4=returned //5=hearBack //6=got an interview //7=interview //8=got the job!
var application = {TrainStation:0,Butchers:0};
//important job dates for each workplace
var jobDates = {TrainStation:[0,0,0],Butchers:[0,0,0]};
//chance of get a interview
var successRate = {TrainStation:100,Butchers:0};
//chance of get a job
var successJobRate = {TrainStation:0,Butchers:0};
//0=time, 1=energyUsed
var appTime = {TrainStation:[59,5], Butchers:[28,3]};
//mail obtained
var collectMail = [];
//mail at post office
var postOffMail = [];

//accepts users settings like name and start position	
function startGame(){
	var name = document.getElementById("name").value;
	//an error occurs if the name is blank
	if(name == ''){
		document.getElementById("namErr").style.visibility="visible";
	}
	//shows map and starts game
	else{
		document.getElementById("startMenu").style.display="none";
		document.getElementById("panel").style.visibility="hidden";
		document.getElementById("namelbl").innerHTML=name;
		showBuildings();
		if(document.getElementById("startPoint").value == "bridge"){
			document.getElementById("homeBtn").style.top = "200px";
			document.getElementById("homeBtn").style.left = "820px";
		}
		place = document.getElementById("startPoint").value;
	}
}

//shows tutorial panel
function Tutorial(){
	hideBuildings();
	document.getElementById("panel").style.visibility="visible";
	document.getElementById("tutorialMenu").style.display="inline";
	document.getElementById("close").style.visibility="visible";
	var task = document.getElementById("taskTut");
	var desc = document.getElementById("descriptionTut");
	//not a tutorial just the first click
	if(tut==0){tut++; document.getElementById("tutorial").value = " ";}
	//the first tutorial
	else if (tut==1) { task.innerHTML = "Go the benefits office"; desc.innerHTML = "Time to start making money. Click the benefits office, then click the go action (this uses energy and takes time). You will get £57.90 per week, and all you have to do is, go to the benefits office each week and show evidence of looking for jobs. The payments will stop if you obtain a job or do not go to the office each week. Once complete, click the tutorial button again.";}
	//the second tutorial
	else if (tut==2){ task.innerHTML = "Go to the store and buy a pen"; desc.innerHTML = "You need a pen to fill out job applications. You can also purchase food from here to increase energy and hunger levels."}
	else if (tut==3){ task.innerHTML = "Go to the train station and apply for a job"; desc.innerHTML = "Now you ready to pick up applications from any business. Now apply for your first job at the train station. Click the train station and apply inside. Then click Jobs List and then the complete button to fill out the application."}
	else if (tut==4){ task.innerHTML = "Go to the butchers and apply for a job"; desc.innerHTML = "Follow the same process as done for the train station except now apply for the butchers."}
	else if (tut==5){ task.innerHTML = "Buy and eat an apple"; desc.innerHTML = "Go the store and click the apple then click checkout. Then go to Inventory and click the apple to consume it. This will give you energy and increase your hunger levels."}
	else if (tut==6){ task.innerHTML = "Rest for 20 mins"; desc.innerHTML = "Click the home button and type 20 in the minutes box, then click the rest button."}
	else if (tut==7){ task.innerHTML = "Done"; desc.innerHTML = "Tutorials are complete!"}
	}

//hides all panel	
function panelClose(){
	document.getElementById("actionBuil").style.visibility = "visible";
	document.getElementById("panel").style.visibility="hidden";
	document.getElementById("tutorialMenu").style.display="none";
	document.getElementById("buildingMenu").style.display="none";
	document.getElementById("newsMenu").style.display="none";
	document.getElementById("jobsListMenu").style.display="none";
	document.getElementById("inventoryMenu").style.display="none";
	document.getElementById("homeMenu").style.display="none";
	
	document.getElementById("Error").style.visibility = "hidden";
	document.getElementById("close").style.visibility="hidden";
	//hides stock of store if store is selected
	document.getElementById("storeStock").style.display = "none";
	document.getElementById("mailTableBody").style.display="none";
	//resets checkout
	checkout=0;
	document.getElementById("checkout").innerHTML="Total: £0.00";
	//resets checkout items to zero
	for (var i in checkoutStock){eval("checkoutStock."+i+"="+0);}
	//sets applyBtn to blank
	applyBtn="";
	//sets actions to blank
	actions="";
	//shows buildings on the map
	showBuildings();
}

//on mouse over of a building on the map highlight (yellow border)
function highlight(th){
var clas = th.parentNode.className.animVal;
document.getElementsByClassName(clas)[0].style.stroke = "yellow";
}//on mouse out of a building on the map return to default (black border)
function dehighlight(th){
var clas = th.parentNode.className.animVal;
document.getElementsByClassName(clas)[0].style.stroke = "black";
}

//shows buildings on the map
function showBuildings(){
	//selects all buildings
	elements = document.getElementsByClassName("building");
	//for each building they are shown
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display="inline";
    }
}
//hides buildings on the map
function hideBuildings(){
	elements = document.getElementsByClassName("building");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display="none";
    }
}
//when building is clicked on map
function buildings(th){
	//hides building on the map
	hideBuildings();//show the panel and places information
	document.getElementById("panel").style.visibility="visible";
	document.getElementById("buildingMenu").style.display="inline";
	document.getElementById("close").style.visibility="visible";
	titl = th.getAttribute('title');
	document.getElementById("buildingName").innerHTML = titl;
	description();
	//hides action button if blank and shows if not
	if(actions==""){document.getElementById("actionBuil").style.visibility="hidden";} else { document.getElementById("actionBuil").style.visibility="visible";}
	if(applyBtn==""){document.getElementById("applyBuil").style.visibility="hidden";document.getElementById("applyInfo").style.display="none";} else { document.getElementById("applyBuil").style.visibility="visible";document.getElementById("applyInfo").style.display="block";}
	document.getElementById("descriptionBuil").innerHTML = desc;
	document.getElementById("appJobTitl").innerHTML = appjobtitl;
	document.getElementById("appJobHou").innerHTML = appjobhou;
	document.getElementById("appJobSal").innerHTML = appjobsal;
	document.getElementById("appJobAdIn").innerHTML = appjobadin;
	document.getElementById("costBuil").innerHTML = "Energy: <br>"+cost[0]+", "+cost[1]+", "+cost[2]+ "<br><br>Time:<br>"+cost[3]+" mins, "+cost[4]+" mins, "+cost[5]+" mins";
	document.getElementById("actionBuil").innerHTML = actions;
	document.getElementById("applyBuil").innerHTML = applyBtn;
}
//display panels information about the currently selected building
function description(){
	//information on the Benefits Office
	if(titl=="Benefits' Office"){
		desc = "This is where you get money you may be entitled to. If entitled come back here each week at the time of appointment.";
		cost = [3, 3, 3, 4, 30, 4];
		//starts for the first collection, as the benDate is not set
		if(tut<=1){actions = "Collect";}
		//when clicks on the ben off hides go button between an hour before and 30m after
		if(tut > 1){
			if(date[0] == benDate[0] && date[1] == benDate[1] && date[2] == benDate[2] && time > 660 && time < 750){
				//collect
				document.getElementById("actionBuil").style.visibility = "visible";
				actions = "Collect";
			}
			else {
				//not available
				//hides action button
				document.getElementById("actionBuil").style.visibility = "hidden";
			}
		}
	}
	else if (titl=="Store"){
		desc = "The general store where you buy general things.";
		cost = [3, 1, 3, 4, 2, 3];
		//shows the stock in stock
		document.getElementById("storeStock").style.display = "inline";
		actions = "Checkout";
	}
	else if (titl=="Train Station"){
		desc = "This is the local train station, where people commute to the city for further opportunities.";
		if(application.TrainStation == 0){
			cost = [1, 2, 1, 1, 1, 1];
			//shows job details
			applyBtn = "Apply";
		} else if(application.TrainStation == 4) { applyBtn="Application Received";}
		else if(application.TrainStation == 7) { cost = [1,5,1,1,45,1]; applyBtn="Go to Interview";}
		else if(application.TrainStation == 9) { cost = [1,20,1,1,240,1]; actions="Work shift";}
		else {cost = [1,1,1,1,1,1];applyBtn = "Return Application";}
	}
	else if (titl=="Butchers"){
		desc = "The local butchers where you can purchase meat for energy and keep up hunger levels. You can also apply for work here as well.";
		appjobtitl = "Job Title: Butcher's Assistant";
		appjobhou = "Job Hours: Mon-Fri 9.00am-18.00pm";
		appjobsal = "Job Salary: £6.75 p/h";
		appjobadin = "Additional information: Previous experience in customer service is an advantage.";
		if(application.Butchers == 0){
			cost = [3, 1, 3, 3, 2, 3];
			//shows job details
			applyBtn = "Apply";
		} else if (application.Butchers == 4) { applyBtn = "Application Received";}
		else if(application.Butchers == 7) {  cost = [1,5,1,1,62,1]; applyBtn="Go to Interview";}
		else {cost = [3,1,3,3,1,3];applyBtn = "Return Application";}
	}
	else if (titl=="Post Office"){
		desc = "Welcome to the local post office. This is where you pick up your mail, if you do not have a permanent address."
		cost = [2, 1, 2, 1, 5, 2];
		actions = "Collect Mail";
	}
}
//what the action button actually does
function actionGo(){
	//task for benefits office
	if(titl=="Benefits' Office"){
		//the first tutorial completion
		if(tut <= 1){
			//next tutorial available
			tut = 2;
		}
			//changes tutorial name from Click Me! to null
			document.getElementById("tutorial").value = " ";
			//adds £57.90
			moneyChange(5790);
			//hides buildings panel
			document.getElementById("buildingMenu").style.display ="none";
			//shows news panel
			document.getElementById("newsMenu").style.display ="inline";
			addDays(7);
			benDate[0] = popDate[0]; benDate[1] = popDate[1]; benDate[2] = popDate[2];
			//changes the description updating news and information.
			document.getElementById("descriptionNews").innerHTML = "<br>You are signed up for benefits.<br><br>You have been given £57.90.<br><br>Return in a week to receive your next budget, your appointment is at 12:00 on the "+benDate[0]+"/"+benDate[1]+"/20"+benDate[2]+". <br>DO NOT FORGET THIS DATE or you will not get your money!";	
	}
	else if(titl=="Store"){
		//minus the checkout price in store
		moneyChange(checkout-checkout-checkout);
		//checkout to £0.00
		checkout =0;
		document.getElementById("checkout").innerHTML="Total: £0.00"
		//adds checkoutStore to inventory for each item
		for (var i in checkoutStock) {eval("inventoryItems."+i+"="+(eval("inventoryItems."+i)+eval("checkoutStock."+i)))}
		//resets checkout items to zero
		for (var i in checkoutStock){eval("checkoutStock."+i+"="+0);}
		//if a pen was brought tutorial 2 is complete
		if(tut==2 && inventoryItems.Pen > 0) {tut=3;}
	}
	else if(titl=="Post Office"){
		for (var i=0; i<postOffMail.length; i++){
			 collectMail.push(postOffMail[i]);
			document.getElementById("mail").style.borderColor="gold";
		}
		postOffMail = [];
	}
	//closes panel after transaction if not benefit office
	if(titl!="Benefits' Office"){panelClose();}
}
function apply(){
//buildings that you can apply for jobs
	//puts build into an array if a space is used
	var build=titl.split(" ");
	//if the array contains more than one entry, the spaces are eliminated in build.
	if(build.length==2){build=build[0]+build[1];}
	//sets the buildings entry in application to 1 (mean an application is obtained).
	var appVal = eval("application."+build);
	if(appVal==0){eval("application."+build+"="+1);}
	else if(appVal==3){eval("application."+build+"="+4); jobProcess(build); if(build=="TrainStation"&&tut==3){tut=4;} else  if(build=="Butchers"&&tut==4){tut=5; eval("successRate."+build+"="+5); eval("successJobRate."+build+"="+1);}}
	else if(appVal==7){eval("application."+build+"="+8); jobProcess(build);}
	panelClose();
}
//the action button on buildings
function go(){
	//the total Energy cost (to the building (cost[0]) plus in the building (cost[1]) plus back home (cost[2]))
	var totEneCost = cost[0]+cost[1]+cost[2];
	// the total time taken (to the building (cost[3]) plus in the building (cost[4]) plus back home (cost[5]))
	var totTimeCost = cost[3]+cost[4]+cost[5];
	if(energy - totEneCost >= 0){
		//yes
		if(money - checkout >= 0)
		{
			energyChange(totEneCost-totEneCost-totEneCost);
			calTime(totTimeCost);
			if(applyBtn=="Apply" || applyBtn=="Return Application" || applyBtn=="Go to Interview" || applyBtn=="Application Received"){apply();}
			else{ actionGo();}
		}
		else{//error not enough money
			document.getElementById("Error").style.visibility = "visible";
			document.getElementById("Error").innerHTML = "Not enough money for this action.";
		}
	}
	else{//error not enough energy
			document.getElementById("Error").style.visibility = "visible";
			document.getElementById("Error").innerHTML = "Not enough energy for this action.";
	}
}
//add to time and calculate the date and time
function calTime(addTime){
	//preTime used to calculate hours changes (for hunger)
	var preTime = time;
	//adds the time in number 720 + 38
	time = time + addTime;
	//takes preTime and calculates hours
	var preHours = parseInt(preTime / 60);
	//converts the number time to hours
	var hours = parseInt(time / 60);
	//number of hours past since previous time
	if(preHours < hours ){ 
		var difTime = hours - preHours;
		//minus 5 hunger for every hour(difHours)
		if(energy >= 40){ hungerChange((difTime*5)-(difTime*5)-(difTime*5)); }
		else{ hungerChange((difTime*10)-(difTime*10)-(difTime*10)); }
		//see if the time is past 0:00 am (1440 minutes)
		if(time >= 1440){
			//resets the time ready for the next day
			time = time - 1440;
			//setDay()
			setDate(1);
		}
	}
	hours = parseInt(time / 60);
	//calcs minutes mod 60
	var minutes = time % 60;
	var type = "pm";
	//if pasted 12:00 (720) set to pm
	if (time >= 720){ type = "pm"; }
	else{ type = "am"; }
	//pads the minutes if less than 10, i.e. if the time is 12hours and 4mins. it is writes it as 12:04 instead of 12:4
	if (minutes < 10){ document.getElementById("timelbl").innerHTML = hours+":0"+minutes + " "+ type;}
	else{document.getElementById("timelbl").innerHTML = hours+":"+minutes + " "+ type;}
}
//for finding proposed date (for deadlines)
function addDays(days) {
	popDate[0] = date[0] + days;
	popDate[1] = date[1];
	popDate[2] = date[2];
	if(popDate[0] > 30 && (date[1] == 4 || date[1] ==6 || date[1] ==9 || date[1] ==11)) {
		popDate[0] = popDate[0] - 30;
		popDate[1]=date[1]+1;
	}
	else if(date[1] == 2 && popDate[0] > 28) {
		popDate[0] = popDate[0] - 28;
		popDate[1] = 3;
	}
	else if (popDate[0] > 31 && (date[1] == 1 || date[1] ==3 || date[1] ==4 || date[1] ==5 || date[1] ==7 || date[1] ==8 || date[1] ==10 || date[1] ==12)) {
		popDate[0] = popDate[0] - 31;
		popDate[1]=date[1]+1;
	}
}
//changing the date
function setDate(days){
	//adds days
	date[0] = date[0] + days;
	if(date[0] > 30 && (date[1] == 4 || date[1] ==6 || date[1] ==9 || date[1] ==11)) {
		date[0] = date[0] - 30;
		date[1]++;
	}
	else if(date[1] == 2 && date[0] > 28) {
		date[0] = date[0] - 28;
		date[1] = 3;
	}
	else if (date[0] > 31 && (date[1] == 1 || date[1] ==3 || date[1] ==4 || date[1] ==5 || date[1] ==7 || date[1] ==8 || date[1] ==10 || date[1] ==12)) {
		date[0] = date[0] - 31;
		date[1]++;
	}
	if(date[1] >= 10) {
	document.getElementById("daylbl"). innerHTML = date[0]+"/"+date[1]+"/20"+date[2];
	}
	else {
		document.getElementById("daylbl"). innerHTML = date[0]+"/0"+date[1]+"/20"+date[2];
	}
	//checks if dates are up for jobs
	for(var i in jobDates){
		//hear back
		if(eval("application."+i)==4&&jobDates[i][0]==date[0]&&jobDates[i][1]==date[1]) {
			eval("application."+i+"="+5);
			jobProcess(i);
		}
		//go to interview
		else if(eval("application."+i)==6&&jobDates[i][0]==date[0]&&jobDates[i][1]==date[1]) {
			eval("application."+i+"="+7);
			jobProcess(i);
		}
		//missed interview if the next day is still on application7
		else if(eval("application."+i)==7&&jobDates[i][0]+1==date[0]&&jobDates[i][1]==date[1]) {
			eval("application."+i+"="+0);
			jobProcess(i);
		}
	}
}
//money deduction and increase
function moneyChange(mon){
	//adds money to account in number form
	money = money + mon;
	document.getElementById("moneylbl").innerHTML = "£"+(money/100).toFixed(2);
}
function energyChange(ene){
	if(energy+ene <= maxEner){energy = energy + ene;}
	else {energy=maxEner;}
	document.getElementById("energyba").style.width= energy +"px";
	document.getElementById("energylbl").innerHTML = energy + " / " + maxEner;
}
function hungerChange(hun){
	hunger = hunger + hun;
	//sets visuals (bar and number) of hunger
	document.getElementById("hungerba").style.width=hunger +"px";
	document.getElementById("hungerlbl").innerHTML = hunger + " / " + maxHun;}
//buying in store
function buy(th) {
	//total price eval()changes the string "prices.Apple" to variable
		checkout=checkout+eval("prices."+th.title+"[0]");
	//item is the checkoutStock.Apple value
	var item = eval("checkoutStock."+th.title);
	//adds one to that value
	item++;
	//sets the incremented value
	eval("checkoutStock."+th.title+"="+item);
	document.getElementById("checkout").innerHTML = "Total: £"+(checkout/100).toFixed(2);
}
//adds to the application array ready for use for when JobsList is clicked.
//DO NOT NEED PROBABLY (in actionGo())
function addJob(build){
	//puts build into an array if a space is used
	build=build.split(" ");
	//if the array contains more than one entry, the spaces are eliminated in build.
	if(build.length==2){build=build[0]+build[1];}
	//sets the buildings entry in application to 1 (mean an application is obtained).
	eval("application."+build+"="+1);
}
//When Inventory menu button is clicked
function Inventory(){
	//hides building on the map
	hideBuildings();
	//show the panel
	document.getElementById("panel").style.visibility="visible";
	document.getElementById("inventoryMenu").style.display="inline";
	document.getElementById("close").style.visibility="visible";
	for (var i in inventoryItems){
		if (inventoryItems[i]>0){
			if(document.getElementById(i+"tdId")==null){
				var td = document.createElement("TD");
				td.id = i+"tdId";
				td.addEventListener("click", function() { 
					var id = this.id.split("tdId"); 
					if(eval("prices."+id[0]+"[2]")+hunger<=maxHun){
						eval("inventoryItems."+id[0]+"="+(eval("inventoryItems."+id[0])-1)); 
						energyChange(eval("prices."+id[0]+"[1]")); hungerChange(eval("prices."+id[0]+"[2]")); 
						calTime(eval("prices."+id[0]+"[3]")); 
						document.getElementById(id[0]+"divnId").innerHTML = id[0]+" - "+eval("inventoryItems."+id[0]); 
						if(eval("inventoryItems."+id[0])==0){ 
							document.getElementById(id[0]+"tdId").parentNode.removeChild(document.getElementById(id[0]+"tdId"));
						} 
						if(id[0]=="Apple" && tut==5){tut=6;}
					} 
					else { 
						document.getElementById("Error").style.visibility = "visible"; 
						document.getElementById("Error").innerHTML = "Can not consume this.";
					} 
				} );
				td.title = i;
				//td onclick
				var divp = document.createElement("DIV");
				divp.className = "itemPic";
				divp.style.backgroundImage = "url('/static/img/" +i+ ".png')";
				var divn = document.createElement("DIV");
				divn.className="itemName";
				divn.innerHTML=i +" - "+inventoryItems[i];
				divn.id = i+"divnId";
				td.appendChild(divp);
				td.appendChild(divn);
				document.getElementById("intTableBody").appendChild(td);
			}
			else { document.getElementById(i+"divnId").innerHTML=i +" - "+inventoryItems[i];}	
		}
	}
}
//When JobsList is clicked.
function JobsList() {
	//hides building on the map
	hideBuildings();
	//show the panel
	document.getElementById("panel").style.visibility="visible";
	document.getElementById("jobsListMenu").style.display="inline";
	document.getElementById("close").style.visibility="visible";
	//create entry in table
	for (var i in application){
		if(application[i]==1){
			application[i]=2;
			var tr = document.createElement("TR");
			var tdn = document.createElement("TD");
			var tds = document.createElement("TD");
			var tdc = document.createElement("TD");
			var butc = document.createElement("button");
			butc.id = i+"Btn";
			tds.id = i+"Stat";
			tdc.id = i+"Com";
			butc.addEventListener("click", function() { if(inventoryItems.Pen>0){ var id = this.id.split("Btn"); if(energy >= eval("appTime."+id[0]+"[1]")){ energyChange(eval("appTime."+id[0]+"[1]")-eval("appTime."+id[0]+"[1]")-eval("appTime."+id[0]+"[1]")); this.style.visibility="hidden"; document.getElementById(id[0]+"Stat").innerHTML="Complete"; eval("application."+id[0]+"="+3);calTime(eval("appTime."+id[0]+"[0]")); } else{ document.getElementById("Error").style.visibility = "visible"; document.getElementById("Error").innerHTML = "Not enough energy for this action.";}} else{ document.getElementById("Error").style.visibility = "visible"; document.getElementById("Error").innerHTML = "A pen is required for this action.";} });
			tr.id = i + "TR";
			tdn.innerHTML = i;
			tds.innerHTML = "Incomplete";
			butc.innerHTML = "Complete";
			tdc.appendChild(butc);
			tr.appendChild(tdn);
			tr.appendChild(tds);
			tr.appendChild(tdc);
			document.getElementById("appTableBody").appendChild(tr);
		}
		else if (application[i]==0 && document.getElementById(i+"TR") != null){
			//delete id of tr if exists.
			document.getElementById(i+"TR").parentNode.removeChild(document.getElementById(i+"TR"));
		}
		else if(application[i]==4){
			document.getElementById(i+"Stat").innerHTML =  "Waiting to hear back";
			//Take out this line is just for reference
			document.getElementById(i+"Com").innerHTML =  eval("jobDates."+i+"[0]")+"/"+eval("jobDates."+i+"[1]")+"/"+eval("jobDates."+i+"[2]");
		}
		else if (application[i]==6) {
			document.getElementById(i+"Stat").innerHTML =  "Interview";
			document.getElementById(i+"Com").innerHTML =  eval("jobDates."+i+"[0]")+"/"+eval("jobDates."+i+"[1]")+"/"+eval("jobDates."+i+"[2]");
		}
		else if (application[i]==9) {
			document.getElementById(i+"Stat").innerHTML =  "Got Job";
			document.getElementById(i+"Com").innerHTML =  " ";
		}
	}
}
function jobProcess(build){
	if(eval("application."+build)==4){
		var days = Math.floor(Math.random() * (15 - 3 + 1)) + 3;
		addDays(days);
		eval("jobDates."+build+"=["+popDate[0]+","+popDate[1]+","+popDate[2]+"]");
	}
	else if(eval("application."+build)==5){
		//console.log("result");
		var interviewNum = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
		//create job variable likelihood to get the job
		if(interviewNum<=eval("successRate."+build)){
			//got an interview
			addMail(build, "successful", "interview");
			eval("application."+build+"="+6);
			//days till interview
		var days = Math.floor(Math.random() * (15 - 3 + 1)) + 3;
		addDays(days);
		eval("jobDates."+build+"=["+popDate[0]+","+popDate[1]+","+popDate[2]+"]");
		}
		else{ eval("application."+build+"="+0); addMail(build, "unsuccessful", "interview"); }
	}
	else if(eval("application."+build)==8){
		var interviewNum = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
		//create job variable likelihood to get the job
		if(interviewNum<=eval("successJobRate."+build)){
			//got an the job
			addMail(build, "successful", "job");
			eval("application."+build+"="+9);
		}
		else{ eval("application."+build+"="+0); addMail(build, "unsuccessful", "job"); if(build=="TrainStation"){eval("successRate."+build+"="+10); eval("successJobRate."+build+"="+2);} }
	}
}
function homeBtn() {
	//hides building on the map
	hideBuildings();
	//show the panel
	document.getElementById("panel").style.visibility="visible";
	document.getElementById("homeMenu").style.display="inline";
	document.getElementById("close").style.visibility="visible"
}
function rest() {
	if(isNaN(document.getElementById("hourBox").value)==true || isNaN(document.getElementById("minBox").value)==true){
		//not a number
		document.getElementById("Error").style.visibility = "visible";
		document.getElementById("Error").innerHTML = "Please enter a whole number.";
	}
	else{
		if(tut==6){ tut=7;}
		if(document.getElementById("hourBox").value==""){	document.getElementById("hourBox").value=0; }
		else if (document.getElementById("minBox").value=="") { document.getElementById("minBox").value=0;}
		document.getElementById("Error").style.visibility = "hidden";
		var mins = parseInt(document.getElementById("minBox").value);
		var hours = parseInt(document.getElementById("hourBox").value)*60;
		mins = mins+hours;
		if ( (energy >= 40 && hunger-(parseInt(mins/60)*5) >= 5) || (energy < 40 && hunger-(parseInt(mins/60)*10) >= 5) ){
		calTime(mins);
		//energy not hours (saves making new variable)
		hours=parseInt(mins/10);
		energyChange(hours);
		} else { 
		document.getElementById("Error").style.visibility = "visible";
		document.getElementById("Error").innerHTML = "Invalid! Hunger will go below 5, you will die. Eat something or rest for a shorter time.";}
	}
}
function Mail(){
	//hides building on the map
	hideBuildings();
	//show the panel
	document.getElementById("panel").style.visibility="visible";
	document.getElementById("newsMenu").style.display="inline";
	document.getElementById("close").style.visibility="visible";
	document.getElementById("mail").style.borderColor="black";
	document.getElementById("mailTableBody").style.display="inline";
	var descHTML = document.getElementById("descriptionNews");
	if(collectMail.length==0){
		descHTML.innerHTML = "No mail available.";
	}
	//collectMail.length>0
	else{ 
		//show mail
		descHTML.innerHTML = "</br>Mail:";
		for (var i=0; i<collectMail.length; i++)
		{
			if(document.getElementById("row"+i+"Mail")==null){
				var tr = document.createElement("TR");
				tr.id="row"+i+"Mail";
				var tdd = document.createElement("TD");
				tdd.innerHTML = date;
				tdd.style.padding="0px 10px";
				var tdf = document.createElement("TD");
				tdf.innerHTML = collectMail[i][0];
				tdf.style.padding="0px 10px";
				var tdl = document.createElement("TD");
				if(collectMail[i][1]=="successful" && collectMail[i][2]=="interview"){
					tdl.innerHTML="Congratulations, we would like to invite to our interview.";
				}
				else if(collectMail[i][1]=="successful" && collectMail[i][2]=="job"){
					tdl.innerHTML="We are pleased to inform you, that we would like to offer you the job.";
				}
				else if (collectMail[i][1]=="unsuccessful"){
					tdl.innerHTML="Sorry to inform you, but your application will not be taken any further.";
				}
				tdl.style.padding="0px 10px";
				tr.appendChild(tdd);
				tr.appendChild(tdf);
				tr.appendChild(tdl);
				document.getElementById("mailTableBody").appendChild(tr);
			}
		}
	}
	if(place=="bridge" && postOffMail.length>0){
		descHTML.innerHTML = "You have mail, collect it from the Post Office.</br>" + descHTML.innerHTML;
	}
}
function addMail(build, success, type){
	var dest;
	if(place=="bridge"){dest="postOffMail";} else{dest="collectMail";}
	document.getElementById("mail").style.borderColor="gold";
	eval(dest+"["+eval(dest+".length")+"]=["+'build'+","+'success'+","+'type'+"]");
}