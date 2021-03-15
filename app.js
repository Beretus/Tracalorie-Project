// Storage Controller

const StorageCtrl = (function(){
    
    return {
        storeItem: function(item){
            
            let items;

            if(localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                localStorage.setItem('items', JSON.stringify(items));
            }
            
        }, 

        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }, 
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        }
    }
})();


// Item Controller

const ItemCtrl = (function(){

    const Items = function(id, name, calories){
        this.id = id,
        this.name = name,
        this.calories = calories
    }

    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null
    }

    return {
        ItemLog: function(){
            console.log(data.items)

        },

        getItems: function(){
            return data.items
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        itemEditState: function(id){
            let found = null;
            
            data.items.forEach(item => {
                
                if(item.id == id) {
                    
                    found = item;
                    data.currentItem = item;
                }
            });
            console.log(found);
            return found;
            
        },

        updateSelectedItem: function(id, name, calories){
            console.log(id)
            let found;
            calories = parseInt(calories);
            // console.log(id, Ids)
            data.items.forEach(item => {
                if(item.id == id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
                
                
            });
            return found;
            
            
        },

        checkSelectedItem: function(id){
            
            ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);

            data.items.splice(index, 1);

        },

        

        generateIds: function(){
            
            let id;
            if(data.items.length > 0){
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 0;
            }
            
            return id;
        }

    }

})();

// UI Controller

const UICtrl = (function(){


    

    return {

    addItemsToUI: function(){
        let items = ItemCtrl.getItems();
        let html = '';
        items.forEach(item => {
            
            html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="fa fa-pencil edit-item"></i>
            </a>
          </li>`;
        });
        // Add to ul
        let list = document.querySelector('#item-list');
        list.innerHTML = html;

        return html;

    },



    totalCaloriesCounter: function(){
        let calCounter = document.querySelector('.total-calories');

        let items = ItemCtrl.getItems();
        let calories = 0;
        items.forEach(item => {
            calories += item.calories;
        });

        calCounter.innerHTML = calories;
    },

    addFoundToInput: function(found){

        document.querySelector('#item-name').value = found.name;
        document.querySelector('#item-calories').value = found.calories;

    },

    

    deleteItemFromUI: function(id){
        const itemID = `#item-${id}`;
        const item = document.querySelector(itemID);
        item.remove();
    },

    clearInput: function(){
        document.querySelector('#item-calories').value = '';
        document.querySelector('#item-name').value = '';
    },

   

    showEditStateOptions: function(){
        document.querySelector('.update-btn').style.display = 'inline-block';
        document.querySelector('.delete-btn').style.display = 'inline-block';
        document.querySelector('.add-btn').style.display = 'none';
    },


    hideEditStateOptions: function(){
        document.querySelector('.update-btn').style.display = 'none';
        document.querySelector('.delete-btn').style.display = 'none';
        document.querySelector('.add-btn').style.display = 'inline-block';
    }

    

    


}
  

})();

// App Controller

const AppCtrl = (function(ItemCtrl, UICtrl, StorageCtrl){

    const allEventListeners = function(){

        document.querySelector('.add-btn').addEventListener('click', addItemsFromInput);

        document.querySelector('#item-list').addEventListener('click', addEditState);

        document.querySelector('.delete-btn').addEventListener('click', deleteSelectedItem);

        document.querySelector('.update-btn').addEventListener('click', updateSelectedItem);

    }

    const addEditState = function(e){
        let id;
        if(e.target.classList.contains('edit-item')){
            let currItemId = e.target.parentElement.parentElement.id;

            let currItemIdArray = currItemId.split('-');


            id = currItemIdArray[1];

            
            let found = ItemCtrl.itemEditState(id);

            UICtrl.addFoundToInput(found);
            UICtrl.showEditStateOptions();
            // console.log(found);
            return found;
        }
        
        
        

       
    }
    

    const addItemsFromInput = function(e){


        let itemName = document.querySelector('#item-name').value;
        let itemCalories = document.querySelector('#item-calories').value;
        
    if(itemName != '' && itemCalories != ''){
        itemCalories = parseInt(itemCalories);
        let arrItems = ItemCtrl.getItems();
        let id = ItemCtrl.generateIds();
        let addItems = arrItems.push({id: id, name: `${itemName}`, calories: itemCalories});
        let storeItems = {
            id: id,
            name: itemName,
            calories: itemCalories
        };

        console.log(storeItems);
        UICtrl.addItemsToUI();
        UICtrl.totalCaloriesCounter();
        UICtrl.clearInput();
        StorageCtrl.storeItem(storeItems);
    }
        e.preventDefault();
        
    }

    const deleteSelectedItem = function(e) {
        
        const currentItem = ItemCtrl.getCurrentItem();
        
        ItemCtrl.checkSelectedItem(currentItem.id);

        UICtrl.deleteItemFromUI(currentItem.id);
        UICtrl.totalCaloriesCounter();

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearInput();


        e.preventDefault()
    }

    const updateSelectedItem = function(e) {
        
        const currentItem = ItemCtrl.getCurrentItem()


        let name = document.querySelector('#item-name').value;
        let calories = document.querySelector('#item-calories').value;

        let updatedItem = ItemCtrl.updateSelectedItem(currentItem.id, name, calories);
        console.log(updatedItem);
        UICtrl.addItemsToUI();

        UICtrl.totalCaloriesCounter();

        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearInput();



        e.preventDefault()
    }


    



    return {
        init: function(){

            UICtrl.hideEditStateOptions();

            // ItemCtrl.ItemLog();
            UICtrl.addItemsToUI();
            UICtrl.totalCaloriesCounter();
            allEventListeners();


        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

AppCtrl.init();
