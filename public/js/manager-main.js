// Here we write json and functionalities.
let tables = [
    {
	tableID: 1,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 2,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 3,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 4,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 5,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 6,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 7,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 8,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 9,
	seat1: {},
	seat2: {}
    },
    {
	tableID: 10,
	seat1: {},
	seat2: {}
    }
]

let startingSlot;
// let mouseOverActive = false;


function slotTaken(slot){
    return slot.getAttribute('locked');
}

function lockSlot(slot){
    console.log("lockSlot() ID " + slot.id);
    slot.setAttribute('locked', true);
}

function unlockSlot(slot){
    console.log("unlockSlot() ID: " + slot.id);
    slot.setAttribute('locked', false);
}

function onDragStart(event) {

    if(event.target == null){
	console.log("Invalid element!!");
	event.preventDefault();
	return;
    }

     if(event.target.nodeName == "#text"){
	 console.log("Invalid element!!");
	 event.preventDefault();
	return;
    }

    if(event.target.parentElement.classList.contains("manager-slot-empty")){
	event.target.parentElement.style.opacity = 0.2;
    }

    if(!event.target.classList.contains("manager-slot-taken") && !event.target.classList.contains("manager-list-slot")){
	console.log("Invalid element!!");
	event.preventDefault();
	return;
    }

    event.dataTransfer.setData("text", event.target.id);
    event.currentTarget.style.backgroundColor = "#eab9c1";
    startingSlot = event.currentTarget.parentNode;
    if(event.currentTarget.parentNode.getAttribute('name') == "profile-wrapper-slot"){
	unlockSlot(event.currentTarget.parentNode);
    }
}

function onDragOver(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    if(dropzone.classList == "manager-slot-empty"){
	dropzone.classList.add("manager-slot-hover");
    }
}

function onDragExit(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    dropzone.classList.remove("manager-slot-hover");
}
function onDrop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const draggableElement = document.getElementById(id);



    if(draggableElement == null){
	console.log("Invalid element!!");
	return
    }
    if(!draggableElement.classList.contains("manager-slot-taken") && !draggableElement.classList.contains("manager-list-slot")){
	console.log("Invalid element!!");
	return;
    }

    draggableElement.style.backgroundColor = "#e19ba7";
    let dropzone = event.currentTarget;
    dropzone.classList.remove("manager-slot-hover");

    let userInfo = draggableElement.children[0];
    let userImg = draggableElement.children[1];

    //console.log(dropzone.id);
    //console.log(getSeatId(dropzone.id));
    
    if(dropzone.id == "manager-user-list-wrapper"){
	draggableElement.classList.remove("manager-slot-taken");
	draggableElement.classList.add("manager-list-slot");
	userInfo.style.display = "flex";
	userImg.style.display = "none";
	getUserById(draggableElement.id).matched = false;

    }else if(dropzone.classList == "manager-list-slot"){
	dropzone = document.getElementById("manager-user-list-wrapper");
	draggableElement.classList.remove("manager-slot-taken");
	draggableElement.classList.add("manager-list-slot");
	userInfo.style.display = "flex";
	userImg.style.display = "none";
	getUserById(draggableElement.id).matched = false;
    }else{
	if(slotTaken(dropzone) == "true"){
	    swapUsers(draggableElement, dropzone);
	    return;
	}else{
	    lockSlot(dropzone);
	    draggableElement.classList.remove("manager-list-slot");
	    draggableElement.classList.add("manager-slot-taken");
	    dropzone.style.opacity = "1";
	    userInfo.style.display = "none";
	    userImg.style.display = "block";
	    getUserById(draggableElement.id).matched = true;
	    rearrange_table(id, dropzone.id, getSeatId(dropzone.id));
	    if(startingSlot.getAttribute('name') == "profile-wrapper-slot"){
		rearrange_table(null, startingSlot.id, getSeatId(startingSlot.id));
	    }
	}
    }
    dropzone.appendChild(draggableElement);
}

function openProfile(event) {
    console.log("openProfile()");
    console.log(vm.users);
    // if(mouseOverActive != mouseOverCall) return;
    // mouseOverActive = true;
    event.preventDefault();
    idContainer = event.currentTarget.id; // TODO: dont use global variable

    const popupWindow = document.getElementById("manager-profile-popup");
    const profile = document.getElementById(event.currentTarget.id);
    let name = document.getElementById("manager-profile-popup-name");
    let age = document.getElementById("manager-profile-popup-age");
    let gender = document.getElementById("manager-profile-popup-gender");
    let img = document.getElementById("manager-profile-popup-img");
    let index = parseInt(profile.id.substring(4, profile.id.length), 10);
    console.log(index);
    img.src = vm.users[index].img;
    name.innerHTML = "Name: " + vm.users[index].name;
    age.innerHTML = "Age: " + vm.users[index].age;
    gender.innerHTML = "Gender: " + vm.users[index].gender;
    
    /* Disable draggable while profile window is active */
    profile.draggable = false;

    /* Make profile window visibel */
    document.querySelector('.manager-profile-popup').style.display = "flex";

    /* Place profile window relative to the profile picture*/
    popupWindow.style.top = profile.offsetTop + 'px';
    popupWindow.style.left = (profile.offsetLeft + (profile.offsetWidth/2)) - (popupWindow.offsetWidth/2) + 'px';
}

function closeProfile(event) {
    console.log("closeProfile()");
    event.preventDefault();

    const id = idContainer;
    const profile = document.getElementById(id);

    profile.draggable = true;

    document.querySelector('.manager-profile-popup').style.display = "none";

    // if(mouseOverActive != mouseOverCall) mouseOverActive = false;
}
function getUserById(userID){
    if(userID == null){
	return null;
    }
    for(let i=0; i<vm.users.length; i++){
	if(vm.users[i].id == userID){
	    return vm.users[i];
	}
    }
}

function swapUsers(draggableElement, dropzone){

    let element2 = dropzone.children[0];

    if(draggableElement.classList == "manager-list-slot"){

	let name1 = draggableElement.children[0];
	let img1 = draggableElement.children[1];

	let name2 = element2.children[0];
	let img2 = element2.children[1];


	draggableElement.classList.remove("manager-list-slot");
	draggableElement.classList.add("manager-slot-taken");

	element2.classList.remove("manager-slot-taken");
	element2.classList.add("manager-list-slot");
	name1.style.display = "none";
	img1.style.display = "block";

	name2.style.display = "block";
	img2.style.display = "none";
	getUserById(draggableElement.id).matched = true;
    }

    let tableId1 = getTableId(dropzone.id) - 1;
    let tableId2 = getTableId(startingSlot.id) - 1;
    let tableseat1 = getSeatId(dropzone.id);
    let tableseat2 = getSeatId(startingSlot.id);

    
    var tempUser;
    if(tableseat1 == 1){

	tempUser = vm.tables[tableId1].seat1;

	if(tableseat2 == 1){
	    vm.tables[tableId1].seat1 = vm.tables[tableId2].seat1;
	    vm.tables[tableId2].seat1 = tempUser;
	}else{
	    vm.tables[tableId1].seat1 = vm.tables[tableId2].seat2;
	    vm.tables[tableId2].seat2 = tempUser;
	}
    }else{
	
	tempUser = vm.tables[tableId1].seat2;

	if(tableseat2 == 1){
	    vm.tables[tableId1].seat2 = vm.tables[tableId2].seat1;
	    vm.tables[tableId2].seat1 = tempUser;
	}else{
	    vm.tables[tableId1].seat2 = vm.tables[tableId2].seat2;
	    vm.tables[tableId2].seat2 = tempUser;
	}
    }
    
    startingSlot.appendChild(element2);
    startingSlot.style.opacity = "1";
    dropzone.appendChild(draggableElement);
    lockSlot(startingSlot);
}

function skipDrag(event){
    console.log("skipDrag()");
    event.preventDefault();
}

function rearrange_table(userID, table, seat){
    
   let tableIndex = parseInt(table,10) - 1;
    if(seat == 1){
	vm.tables[(tableIndex)].seat1 = getUserById(userID);
    }else{
	vm.tables[(tableIndex)].seat2 = getUserById(userID);
    }
}

function getSeatId(tableID){
    if(tableID.length == 3){
	return parseInt(tableID[2]);
    }else{
	return parseInt(tableID[3]);
    }
}

function getTableId(id){
     if(id.length == 3){
	return parseInt(id[0]);
    }else{
	return parseInt(id[0]+id[1]);
    }
}
