angular.module('niffler.controllers', [])


.controller('MainCtrl', function($scope, $rootScope, $stateParams, $state, RecipeService, UserService) {

    if (!$rootScope.user)
        $state.transitionTo('tab.login');

})


.controller('LoginCtrl', function($scope, $rootScope, $stateParams, $state, RecipeService, UserService) {

    $scope.user = {};
    // CHECKING IF USER PRESENT FROM PREVIOUSLY
    $scope.user_session = UserService.getUserSession()

    // IF USER PRESENT THEN POPULATE THE INPUT BOXES WITH USER DATA
    if ($scope.user_session) {
        $scope.user = $scope.user_session;
    }
    $scope.login = function() {
        // IF USER HAS INPUT SOME DATA THEN LOG HIM IN AND CHANGE STATE TO RECIPE
        if ($scope.user) {
            // SAVING USER DATA TO ROOTSCOPE HERE
            $rootScope.user = UserService.createUser($scope.user);
        }
        // GO TO MAIN PAGE
        $state.transitionTo('tab.recipe');
    }


})


// A simple controller that fetches a list of data from a service
.controller('RecipeCtrl', function($scope, $rootScope, $state, $stateParams, RecipeService, UserService) {
    $scope.title = "Recipes List";

    $scope.LOGGED_USER = $rootScope.user;

    if (!$rootScope.user) {
        $scope.LOGGED_USER = $rootScope.user = UserService.getUserSession();
    }


    $scope.order = $state.params.orderBy;
    $stateParams.params;

    var ordering = $state.current.name.split('.')[1];
    if (ordering == "latest") {
        // LATEST
        $scope.title = "Latest Recipes";
        $scope.ordering = "-id"

    } else if (ordering == "votes") {
        $scope.title = "Most Voted Recipes";
        // MOST VOTES
        $scope.ordering = "-votes"
    } else if (ordering == "commented") {
        $scope.title = "Most Commented";
        //MOST COMMENTS
        $scope.ordering = "-comments.length"
    } else {
        // HOME
        $scope.ordering = "id"


    };


    $scope.recipes = RecipeService.all();

    //REDIRECT TO RECIPE DETAILS PAGE
    $scope.checkRecipe = function(item) {
        $state.transitionTo('tab.recipedetial');
    }

    $scope.getUserName = function(item) {
        return UserService.getUserName(item.userid);
    }
})


.controller('RecipeDetailsCtrl', function($scope, $rootScope, $stateParams, $state, RecipeService, UserService) {

    //$scope.recipeID = $stateParams.recipeID || 0;

    //GETTING LOGGED IN USER'S DATA FROM ROOTSCOPE
    $scope.LOGGED_USER = $rootScope.user;

    if (!$rootScope.user) {
        $scope.LOGGED_USER = $rootScope.user = UserService.getUserSession();
    }


    //$scope.id = $stateParams.id;
    $scope.recipeID = 4;
    // GETTING THE RECIPE DETAIL'S
    $scope.recipe = RecipeService.recipe($scope.recipeID);
    // STORING VOTES IN ANOTHER VARIABLE


    //=============== VOTE SECTION=============================//
    $scope.votes = $scope.recipe.votes;
    $scope.changeVote = function(val) {
        RecipeService.voteRecipe($scope.recipe.id, val)
    }

    //=============== VOTE SECTION=============================//


    //=============== COMMENT SECTION=============================//

    $scope.user_comments = [];
    $scope.user_comments = getComments();


    function getComments() {
        // EMPTYING THE ARRAY IF PREVIOUSLY CALLED
        $scope.user_comments = [];
        var temp_user_comments = {};
        for (var i = 0, l = $scope.recipe.comments.length; i < l; i++) {
            // GETTING USER DETAILS FROM UserService
            var user = UserService.getUser($scope.recipe.comments[i]['userid']);

            if (!user)
                continue;

            this_user_comment = {
                userid: user.id,
                name: user.name,
                pic: user.pic,
                said: $scope.recipe.comments[i]['said']
            }

            $scope.user_comments.push(this_user_comment);
        }
        return $scope.user_comments;
    }

    $scope.addComment = function() {

            var comment = {
                userid: $scope.LOGGED_USER.id,
                name: $scope.LOGGED_USER.name,
                pic: $scope.LOGGED_USER.pic,
                said: $scope.recipe.newcomment
            };

            // ADDING COMMENT TO RECIPE USING RecipeService
            RecipeService.commentOnRecipe($scope.recipe.id, comment)

            //ADDING COMMENT TO LOCAL user_comments OBJECT
            $scope.user_comments.push(comment);
            // EMPTYING INPUT BOX AFTER COMMENT
            $scope.recipe.newcomment = "";

        }
        //=============== COMMENT SECTION=============================//  

})


.controller('NewRecipeCtrl', function($scope, $rootScope, $stateParams, $state, RecipeService, UserService) {

    $scope.LOGGED_USER = $rootScope.user;

    if (!$rootScope.user) {
        $scope.LOGGED_USER = $rootScope.user = UserService.getUserSession();
    }


    $scope.recipe = {}
    $scope.addNewRecipe = function() {

        if (!$rootScope.user)
            $rootScope.user = UserService.createUser($scope.user);

        RecipeService.addRecipe({
            userid: $rootScope.user.id,
            title: $scope.recipe.title || 'No Title',
            description: $scope.recipe.description || 'No Description',
            externalLink: $scope.recipe.externalLink || 'No externalLink',
            images: [$scope.recipe.imageURL] || []
        });
        $state.transitionTo('tab.latest');

    }


});
