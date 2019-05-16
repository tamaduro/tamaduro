(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'infinite-scroll'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        let listingHomeRoute = {
            url: '/',
            templateUrl: 'home/index.html',
            controller: 'Home.IndexController',
            controllerAs: 'vm',
            data: { activeTab: 'home', pageLabel: 'Lista' }
        };

        $stateProvider
            .state('home', listingHomeRoute)
            
            .state('Cadastro', {
                url: '/favorites',
                templateUrl: 'favorites/favorites.html',
                controller: 'Cadastro.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'Cadastro', pageLabel: '' }
            })
            
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
            $rootScope.label = toState.data.label;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });

    $(document).ready(function(){
        $('.sidenav').sidenav();
    });
})();