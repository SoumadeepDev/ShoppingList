//1st Task->  Add items to the list via form-input  (total 4 steps, see accordingly)

const Form = document.getElementById("item-form");
const inputItem = document.getElementById("item-input");
const ItemList = document.getElementById("item-list"); //ul

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}
function addItem(e) {
  e.preventDefault();

  const newItem = inputItem.value;
  //validate Items
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  //Task-8: Update item from edit mode
  //check for edit mode
  if (isEditMode) {
    const ItemToEdit = ItemList.querySelector(".edit-mode");
    removeItemFromStorage(ItemToEdit.textContent);
    ItemToEdit.classList.remove("edit-mode");
    ItemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("This Item is already exists in the List");
      return;
    }
  }

  //adding items to DOM
  addItemToDOM(newItem); // go to task-6
  addItemToLocalStorage(newItem); //add items to local storage
  checkUI(); // check for the task 4 for briefing

  inputItem.value = "";
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  return button;
}
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}
//---------------------------------------------------------------------------

//2nd Task- Remove items from list by clicking the 'X' button

function onclickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
    /**
    e.target = icon,  e.target.parentElement =button,
    e.target.parentElement.ParentElement =li tag,
    we need to delete this li tag so use remove()
    */
  } else if (e.target.closest("li")) {
    setItemToEdit(e.target); // for task 7 set item for edit
  }
}

function removeItem(item) {
  if (confirm("Are You Sure?")) {
    item.remove();
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  //filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  //reset to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

//---------------------------------------------------------------------------
//3rd task -Clear All Items with Clear All Button

const clearButton = document.getElementById("clear");

function clearAllItems() {
  while (ItemList.firstChild) {
    ItemList.removeChild(ItemList.firstChild);
  }

  //clear from local storage
  localStorage.removeItem("items");
  checkUI();
}

//-------------------------------------------------------------------------
//4th Task- when there is no items present in the list then 'Filter Items' Input text and 'Clear All' Button should be hidden from user

const Filter = document.getElementById("filter");

function checkUI() {
  inputItem.value = "";
  const Items = ItemList.querySelectorAll("li"); // we need to do this inside the function to run correctly

  if (Items.length === 0) {
    clearButton.style.display = "none";
    Filter.style.display = "none";
  } else {
    clearButton.style.display = "block";
    Filter.style.display = "block";
  }
  formbtn.innerHTML =
    '<i class="fa-solid fa-plus fa-beat-fade" style="color: #15d121"></i>Add Item';
  isEditMode = false;
}
/** 
checkUI() only run once when the page is loaded, so if we delete something
we need to bring it back on our own, things would not back automatically, so
we need to call checkUI() again in different places like, when we append a 
new item to the list or when we remove a item by X button or by clear all 
button every time checkUI needs to run.
*/

//Task-5 : Filter items by typing in the filter field
function filterItems(e) {
  const text = e.target.value.toLowerCase(); // user entered text in filter input box
  const li = document.querySelectorAll("li");

  li.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
//Task-6: Add localStorage to persist items
//LocalStorage Methods:
/* localStorage.setItem('name','Soumadeep');  // set a value with a key
   localStorage.getItem('name');
   localStorage.removeItem('name');
   localStorage.clear(); //clear all the values
*/
function addItemToDOM(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));

  const button = createButton("remove-item btn-link text-red");
  const icon = createIcon("fa-solid fa-xmark");

  button.appendChild(icon);
  li.appendChild(button);

  ItemList.appendChild(li);
}
function addItemToLocalStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}
function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") == null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}
//Task-7: Click on an item to put into edit mode and add to form
let isEditMode = false;
const formbtn = document.querySelector(".btn");

function setItemToEdit(item) {
  isEditMode = true;
  ItemList.querySelectorAll("li").forEach((i) =>
    i.classList.remove("edit-mode")
  );
  item.classList.add("edit-mode");
  formbtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item";
  inputItem.value = item.textContent;
}

//Task-9: prevent duplicate items in the list
function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();

  if (itemsFromStorage.includes(item)) {
    return true;
  } else {
    return false;
  }
}

//Event Listeners
Form.addEventListener("submit", addItem); //task-1 event
ItemList.addEventListener("click", onclickItem); //task-2 event
clearButton.addEventListener("click", clearAllItems); //task-3 event
checkUI(); //task-4 function call
Filter.addEventListener("input", filterItems); //task-5 event
document.addEventListener("DOMContentLoaded", displayItems);
