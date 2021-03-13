
// Item Controller

const ItemCtrl = (function(){

    const Items = function(id, name, calories){
        this.id = id,
        this.name = name,
        this.calories = calories
    }

    const data = {
        items: [],
        currentItem: null
    }

    return {
        ItemLog: function(){
            console.log(data.items)

        },

        getItems: function(){
            return data.items
        },

        itemEditState: function(id){
            let found = null;
            
            data.items.forEach(item => {
                
                if(item.id == id) {
                    
                    found = item;
                }
            });
            
            return found;
            
        },
        

        generateIds: function(){
            
            let id;
            if(data.items.length > 0){
                id = data.items.length + 1;
            } else {
                id = 1;
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

    

    


}
  

})();

// App Controller

const AppCtrl = (function(ItemCtrl, UICtrl){

    const allEventListeners = function(){

        document.querySelector('.add-btn').addEventListener('click', addItemsFromInput);

        document.querySelector('#item-list').addEventListener('click', addEditState);

    }

    const addEditState = function(e){
        let id;
        if(e.target.classList.contains('edit-item')){
            let currItemId = e.target.parentElement.parentElement.id;

            let currItemIdArray = currItemId.split('-');


            id = currItemIdArray[1];

            
            let found = ItemCtrl.itemEditState(id);

            UICtrl.addFoundToInput(found);

            console.log(found);
        }
        
        
        

       
    }

    const addItemsFromInput = function(e){
        let itemName = document.querySelector('#item-name').value;
        let itemCalories = document.querySelector('#item-calories').value;
        itemCalories = parseInt(itemCalories);
        let arrItems = ItemCtrl.getItems();
        let id = ItemCtrl.generateIds();
        arrItems.push({id: id, name: `${itemName}`, calories: itemCalories});
        UICtrl.addItemsToUI();
        UICtrl.totalCaloriesCounter();

        e.preventDefault();
        
    }


    



    return {
        init: function(){
            ItemCtrl.ItemLog();

            


            allEventListeners();

            
            
        }
    }

})(ItemCtrl, UICtrl);

AppCtrl.init();
