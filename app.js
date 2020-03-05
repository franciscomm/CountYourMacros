
//Storage Controller
const StorageCtrl = (function () {
  //Public methods
  return {
    storeItem: function (item) {
      let items;
      //Check if an items are currently in local storage
      if (localStorage.getItem('items') === null) {
        items = [];
        //Push new item to items array
        items.push(item);
        //Set local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        //Push new item
        items.push(item);
        //Reset local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearAllItemsFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();





//Item Controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  //Data Structure/State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }
  //Public Methods
  return {
    getItems: function () {
      return data.items;
    },

    addItem: function (name, calories) {
      let ID;
      //Create ID for each item
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Turn calories into nums
      calories = parseInt(calories);

      //Create new item
      newItem = new Item(ID, name, calories);

      //Push item to the array of items
      data.items.push(newItem);

      return newItem;
    },

    getItemById(id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function (name, calories) {
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      //Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      //Get index
      const index = ids.indexOf(id);

      //Remove item to delete from array
      data.items.splice(index, 1);
    },

    clearItems: function () {
      data.items = [];
    },

    getTotalCalories: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.calories;
      });
      data.totalCalories = total;

      return data.totalCalories;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    logData: function () {
      return data;
    }
  }
})();





//UI Controller
const UICtrl = (function () {
  const UISelector = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    listItems: '#item-list li',
    clearBtn: '.clear-btn'
  }
  //Public Methods
  return {
    populateItemList: function (items) {
      let html = '';
      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      </li>`;
      });
      //Insert item to the UI
      document.querySelector(UISelector.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelector.itemNameInput).value,
        calories: document.querySelector(UISelector.itemCaloriesInput).value
      }
    },

    addListItem: function (item) {
      //Show list of items in UI
      document.querySelector(UISelector.itemList).style.display = 'block';
      //Create li element
      const li = document.createElement('li');
      //Add class to li
      li.className = 'collection-item';
      //Add id to li
      li.id = `item-${item.id}`;
      //Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <i href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      //Insert item to UI
      document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelector.listItems);
      //Convert node list from above into an array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInputFields: function () {
      document.querySelector(UISelector.itemNameInput).value = '';
      document.querySelector(UISelector.itemCaloriesInput).value = '';
    },

    addItemToForm: function () {
      document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function () {
      document.querySelector(UISelector.itemList).style.display = 'none';
    },

    showTotalCalories(totalCalories) {
      document.querySelector(UISelector.totalCalories).textContent = totalCalories;
    },

    clearEditState: function () {
      UICtrl.clearInputFields();
      document.querySelector(UISelector.updateBtn).style.display = 'none';
      document.querySelector(UISelector.deleteBtn).style.display = 'none';
      document.querySelector(UISelector.backBtn).style.display = 'none';
      document.querySelector(UISelector.addBtn).style.display = 'inline';
    },

    showEditState: function () {
      document.querySelector(UISelector.updateBtn).style.display = 'inline';
      document.querySelector(UISelector.deleteBtn).style.display = 'inline';
      document.querySelector(UISelector.backBtn).style.display = 'inline';
      document.querySelector(UISelector.addBtn).style.display = 'none';
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelector.listItems);
      //Turn Node List into an Array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },

    getSelector: function () {
      return UISelector;
    }
  }
})();





//App Controller
const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {

  //Load event listeners
  const loadEventListeners = function () {
    //Get UI Selectors/Get items list
    const UISelector = UICtrl.getSelector();

    //Event to add an item
    document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

    //Disable submit on enter key
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick);

    //Update item event
    document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Back button event, clears edit stage/view
    document.querySelector(UISelector.backBtn).addEventListener('click', UICtrl.clearEditState);

    //Delete item event
    document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Clear ALL items event
    document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItems);

  }

  //Add item to the list
  const itemAddSubmit = function (e) {
    //Get input from user from UI controller
    const input = UICtrl.getItemInput();

    //check for valid input
    if (input.name !== '' && input.calories !== '') {
      //Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add item to the UI list 
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Show total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Store in local storage
      StorageCtrl.storeItem(newItem);

      //Clear fields 
      UICtrl.clearInputFields();
    }

    e.preventDefault();
  }

  //Edit button state
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      //Get list item id
      const listId = e.target.parentNode.parentNode.id;

      //Break listId into an array
      const listIdArray = listId.split('-');
      console.log(listIdArray);

      //Get actual id number
      const id = parseInt(listIdArray[1]);

      //Get item with id
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  //Update item submit
  const itemUpdateSubmit = function (e) {
    //Get item input
    const input = UICtrl.getItemInput();

    //Update item 
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update UI when an item has been edited
    UICtrl.updateListItem(updatedItem);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Show total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Delete button event
  const itemDeleteSubmit = function (e) {
    //Get id from current item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete from data structure 
    ItemCtrl.deleteItem(currentItem.id);

    //Delete item from UI
    UICtrl.deleteListItem(currentItem.id);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Show total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Clear all items event
  const clearAllItems = function () {
    //Delete all items from data structure
    ItemCtrl.clearItems();

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Show total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Hide UL
    UICtrl.hideList();

    //Remove all items from UI
    UICtrl.removeItems();

    //Delete all items from local storage
    StorageCtrl.clearAllItemsFromStorage();
  }

  //Public Methods
  return {
    init: function () {

      //Set initital state(hides update, delete, and back buttons)
      UICtrl.clearEditState();

      //Fetch items from Data Structure
      const items = ItemCtrl.getItems();

      //Check if any items are in array
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate List with items 
        UICtrl.populateItemList(items);
      }
      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Show total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize App
AppCtrl.init();