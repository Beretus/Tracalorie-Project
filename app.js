
// Item Controller

const ItemCtrl = (function(){

    const data = {
        items: [
            {id: 0, name: 'Steak', calories: 800},
            {id: 1, name: 'Cookie', calories: 400},
            {id: 2, name: 'Juice', calories: 300},
        ]
    }

    return {
        ItemLog: function(){
            console.log(data.items)
        },

        getItems: function(){
            return data.items
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
            console.log(item)
            html += `<li class="collection-item" id="item-0">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="fa fa-pencil"></i>
            </a>
          </li>`;
        });
        // Add to ul
        let list = document.querySelector('#item-list');
        list.innerHTML += html;
    }

}
  

})();

// App Controller

const AppCtrl = (function(ItemCtrl, UICtrl){



    return {
        init: function(){
            ItemCtrl.ItemLog();

            UICtrl.addItemsToUI();
        }
    }

})(ItemCtrl, UICtrl);

AppCtrl.init();
