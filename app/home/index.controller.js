(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;
        vm.isLoading = true;
        vm.fruits = []
        vm.fruitName = null;

        vm.user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                vm.fruits = globalThis.fruits;
                vm.isLoading = false;
            });
        }

        this.search = function(item) {
            if (!this.fruitName || (item.fruitName.toLowerCase().indexOf(this.fruitName) != -1) ){
                return true;
            }
            return false;
        };
    }

})();