/*
var observable_array_1 = require("data/observable-array");
var ViewModel = (function () {
    function ViewModel() {
        this.initDataItems();
    }
    Object.defineProperty(ViewModel.prototype, "dataItems", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    ViewModel.prototype.initDataItems = function () {
        this._items = new observable_array_1.ObservableArray();
        for (var i = 0; i < 10; i++) {
            this._items.push(new DataItem(i, "Item " + i, "This is item description."));
        }
    };
    return ViewModel;
})();
exports.ViewModel = ViewModel;
var DataItem = (function () {
    function DataItem(id, name, description) {
        this.id = id;
        this.itemName = name;
        this.itemDescription = description;
    }
    return DataItem;
})();
exports.DataItem = DataItem;
*/
var config = require("../../shared/config");
var fetchModule = require("fetch");
var observableArrayModule = require("data/observable-array");

function GroceryListViewModel(items) {
    var viewModel = new observableArrayModule.ObservableArray(items);

    viewModel.load = function() {
        return fetch(config.apiUrl + "Groceries", {
            headers: {
                "Authorization": "Bearer " + config.token
            }
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            
            data.Result.forEach(function(grocery) {
                
                viewModel.push({
                    name: grocery.Name,
                    id: grocery.Id
                });
            });
        });
    };
    
    viewModel.add = function(grocery) {
        return fetch(config.apiUrl + "Groceries", {
            method: "POST",
            body: JSON.stringify({
                Name: grocery
            }),
            headers: {
                "Authorization": "Bearer " + config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            viewModel.push({ name: grocery, id: data.Result.Id });
        });
    };
    
    viewModel.delete = function(index) {
        return fetch(config.apiUrl + "Groceries/" + viewModel.getItem(index).id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + config.token,
                "Content-Type": "application/json"
            }
        })
        .then(handleErrors)
        .then(function() {
            viewModel.splice(index, 1);
        });
    };

    viewModel.empty = function() {
        while (viewModel.length) {
            viewModel.pop();
        }
    };

    return viewModel;
}

function handleErrors(response) {
    if (!response.ok) {
        console.log(JSON.stringify(response));
        throw Error(response.statusText);
    }
    return response;
}

module.exports = GroceryListViewModel;
