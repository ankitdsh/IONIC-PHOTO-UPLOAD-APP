angular.module('niffler', ['ionic', 'niffler.services', 'niffler.controllers'])


.config(function($stateProvider, $urlRouterProvider) {


    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        // MAIN PAGE
        .state('tab.recipe', {
            url: '/recipe',
            views: {
                'recipe': {
                    templateUrl: 'templates/recipe.html',
                    controller: 'RecipeCtrl'
                }
            }

        })
        // RECIPE DETAIL PAGE
        .state('tab.recipedetial', {
            url: '/recipedetial',
            // params: {
            //     myParam: ['recipeID']
            // },
            views: {
                'recipe': {
                    templateUrl: 'templates/recipe-details.html',
                    controller: 'RecipeDetailsCtrl'
                }
            }

        })
        //LOGIN PAGE
        .state('tab.login', {
            url: '/login',
            views: {
                'recipe': {
                    templateUrl: 'templates/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })
        // NEWEST RECIPE FIRST
        .state('tab.latest', {
            url: '/latest',
            views: {
                'latest': {
                    templateUrl: 'templates/recipe.html',
                    controller: 'RecipeCtrl'
                }
            }
        })
        //HIGHEST RATED
        .state('tab.votes', {
            url: '/votes',
            views: {
                'votes': {
                    templateUrl: 'templates/recipe.html',
                    controller: 'RecipeCtrl'
                }
            }
        })
        // MOST COMMENTED
        .state('tab.commented', {
            url: '/commented',
            views: {
                'commented': {
                    templateUrl: 'templates/recipe.html',
                    controller: 'RecipeCtrl'
                }
            }
        })
        // ADD RECIPE PAGE
        .state('tab.addrecipe', {
            url: '/AddRecipe',
            views: {
                'addrecipe': {
                    templateUrl: 'templates/addrecipe.html',
                    controller: 'NewRecipeCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/login');

});
