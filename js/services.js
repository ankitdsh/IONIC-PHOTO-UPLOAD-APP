angular.module('niffler.services', [])

// LOCALSTORAGE SERVICE EMULATING DATABASE LOOKUP
.service('StorageService', function() {

    var storageAvailable = true;


    _hasStorage = function() {
        if (typeof window.localStorage == "object") {
            storageAvailable = true;

        }

        return storageAvailable;
    }


    _setStorage = function(key, value) {
        if (storageAvailable) {
            window.localStorage.setItem(key, JSON.stringify(value))
        }

    }
    _getStorage = function(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }

    return {
        hasStorage: function() {
            return _hasStorage();
        },
        getStorage: function(key) {
            return _getStorage(key)
        },
        setStorage: function(key, value) {
            _setStorage(key, value)
        },
    }

})

// USERSERVICE TO GET RECIPE AUTHOR AND CURRENT LOGGED-IN USER DETAILS
.service('UserService', function(StorageService) {

    var USERS = [{
        id: 0,
        name: 'Ankit',
        pic: 'https://www.krazyride.com/images/Driver/363/Profile_201506032626022609.png'
    }, {
        id: 1,
        name: 'Dave',
        pic: 'http://organicthemes.com/demo/profile/files/2012/12/profile_img.png'
    }, {
        id: 2,
        name: 'Jimmy',
        pic: 'https://lh5.googleusercontent.com/-ZadaXoUTBfs/AAAAAAAAAAI/AAAAAAAAAGA/19US52OmBqc/photo.jpg'
    }, {
        id: 3,
        name: 'John',
        pic: 'http://www.realtimearts.net/data/images/art/46/4640_profile_nilssonpolias.jpg'
    }, {
        id: 4,
        name: 'Roger',
        pic: 'http://sms.latestsms.in/wp-content/uploads/facebook-profile-pictures5.jpg'
    }, {
        id: 5,
        name: 'Peggy',
        pic: 'http://www.realtimearts.net/data/images/art/47/4764_profile_mudie.jpg'
    }];

    _getUser: function _getUser(userID) {
        return USERS[userID];
    }
    _getUserName: function _getUserName(userID) {
        if (USERS[userID])
            return USERS[userID]['name'];
    }
    _isUserSessionPresent: function _isUserSessionPresent() {
        var user_present = false;

        if (StorageService.getStorage('USER')) {
            user_present = true;
        }
        return user_present;
    }
    _getUserFromSession: function _getUserFromSession() {
        if (_isUserSessionPresent()) {
            return StorageService.getStorage('USER');
        }
    }

    _createUser: function _createUser(user) {

        if (_isUserSessionPresent()) {
            return StorageService.getStorage('USER');
        } else {
            var user = user || {};
            var len = USERS.length;
            var new_user = {
                id: len,
                name: user.name || 'NO NAME',
                pic: user.pic || ''
            };
            USERS.push(new_user);
            StorageService.setStorage('USER', new_user)
            return new_user;
        }

    }

    return {
        createUser: function(user) {
            return _createUser(user);
        },
        getUser: function(userID) {
            return _getUser(userID)
        },
        getUserName: function(userID) {
            return _getUserName(userID)
        },
        getUserSession: function() {
            return _getUserFromSession();
        }

    }
})

// RECIPE SERVICE FOR ADDING A RECIPE, COMMENTING ON A RECIPE AND VOTING FOR A RECIPE
.service('RecipeService', function(StorageService) {

    var RECIPES = [{
        id: 0,
        userid: 1,
        title: 'Pani Puri',
        description: 'The Panipuri (About this sound pānīpūrī (help·info), Nepali: पानीपूरी, also known as Gol gappa is a popular street snack from the Magadha region of India. It consists of a round, hollow puri, fried crisp and filled with a mixture of flavored water ("pani"), tamarind chutney, chili, chaat masala, potato, onion and chickpeas.',
        externalLink: '',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Home_made_Indian_Panipuri.jpg/1280px-Home_made_Indian_Panipuri.jpg'],
        votes: 2,
        comments: [{
            userid: 2,
            said: 'Very Good'
        }, {
            userid: 1,
            said: 'Tasty'
        }, {
            userid: 5,
            said: 'Perfect!!!!!'
        }]
    }, {
        id: 1,
        userid: 4,
        title: 'Samosa',
        description: 'A samosa /səˈmoʊsə/ or samoosa is a fried or baked pastry with savoury filling, such as spiced potatoes, onions, peas, lentils and also with minced meat (lamb, beef or chicken),[1] and sometimes pine nuts. The samosa is claimed to have originated in Central Asia.[2][3] Its size and consistency may vary, but typically it is distinctly triangular or tetrahedral in shape. Indian samosas are usually vegetarian, and often accompanied by a mint sauce or chutney.[4] Vegetarian samosas originated in Uttar Pradesh.[5] Samosas are a popular entree appetizer or snack in the local cuisines of Indian subcontinent, Southeast Asia, Central Asia and Southwest Asia, the Arabian Peninsula, the Mediterranean, the Horn of Africa and North Africa. Due to cultural diffusion and emigration from these areas, samosas are today also prepared in other regions.',
        externalLink: '',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Samosachutney.jpg/800px-Samosachutney.jpg'],
        votes: 0,
        comments: [{
            userid: 2,
            said: 'Very Good'
        }, {
            userid: 1,
            said: 'Tasty'
        }, {
            userid: 5,
            said: 'Perfect!!!!!'
        }, {
            userid: 1,
            said: 'Tasty'
        }, {
            userid: 5,
            said: 'Perfect!!!!!'
        }]
    }, {
        id: 2,
        userid: 0,
        title: 'Chole bhature',
        description: '',
        externalLink: '',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chana_masala.jpg/1280px-Chana_masala.jpg'],
        votes: 4,
        comments: []
    }, {
        id: 3,
        userid: 3,
        title: 'Dhokla',
        description: 'Dhokla (Gujarati: ઢોકળા) is a vegetarian food item that originates from the Indian state of Gujarat. It is made with a fermented batter derived from rice and chickpea splits.[1] Dhokla can be eaten for breakfast, as a main course, as a side dish, or as a snack.',
        externalLink: '',
        images: ['https://upload.wikimedia.org/wikipedia/commons/0/08/Khaman_dhokla.jpg'],
        votes: 23,
        comments: [{
            userid: 2,
            said: 'Very Good'
        }, {
            userid: 1,
            said: 'Tasty'
        }]
    }, {
        id: 4,
        userid: 0,
        title: 'Nachos',
        description: 'Nachos is a Tex-Mex[1][2] dish from northern Mexico.[1] The dish is composed of tortilla chips (totopos) covered with cheese or cheese-based sauce, and is often served as a snack. More elaborate versions add more ingredients and can be served as a main dish. First created circa 1943 by Ignacio "Nacho" Anaya, the original nachos consisted of fried corn tortillas covered with melted cheddar cheese and sliced jalapeño peppers.',
        externalLink: '',
        images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nachos-cheese.jpg/800px-Nachos-cheese.jpg'],
        votes: 4,
        comments: [{
            userid: 2,
            said: 'Very Good'
        }, {
            userid: 1,
            said: 'Tasty'
        }, {
            userid: 5,
            said: 'Perfect!!!!!'
        }, {
            userid: 1,
            said: 'Tasty'
        }, {
            userid: 5,
            said: 'Perfect!!!!!'
        }, {
            userid: 5,
            said: 'Perfect!!!!!'
        }, {
            userid: 1,
            said: 'Tasty'
        }, {
            userid: 5,
            said: 'Perfect!!!!!'
        }]
    }];

    // PRIVATE FUNCTIONS
    _addRecipe: function _addRecipe(recipe) {

        var len = RECIPES.length;

        var new_recipe = {
            id: len,
            userid: recipe.userid,
            title: recipe.title || 'No Title',
            description: recipe.description || 'No Description',
            externalLink: recipe.externalLink || 'No externalLink',
            images: recipe.images || [],
            votes: 0,
            comments: []
        };

        RECIPES.push(new_recipe);
        StorageService.setStorage('RECIPES', RECIPES)
    }


    _getRecipe: function _getRecipe(recipeID) {
        return RECIPES[recipeID];
    }


    _upvoteRecipe: function _upvoteRecipe(recipeID, val) {
        // counter to increment or decrement recipe only once by a user
        RECIPES[recipeID]['votes'] = RECIPES[recipeID]['votes'] + val;
    }


    _commentOnRecipe: function _commentOnRecipe(recipeID, comment) {
        RECIPES[recipeID]['comments'].push({
            userid: comment.userid,
            said: comment.said
        });
    }

    return {
        all: function() {
            //CHECKING IF RECIPE STORED IN SESSION OR ELSE GETTING IT FROM THE SERVICE
            var storage_recipe = StorageService.getStorage('RECIPES');
            if (storage_recipe) {
                RECIPES = storage_recipe;
            }

            return RECIPES;
        },
        recipe: function(recipeID) {
            return _getRecipe(recipeID);
        },
        addRecipe: function(recipe) {
            _addRecipe(recipe);
        },
        voteRecipe: function(recipeID, val) {
            _upvoteRecipe(recipeID, val)
        },
        commentOnRecipe: function(recipeID, comment) {
            _commentOnRecipe(recipeID, comment)
        }
    }
})
