# Project 1: Shared shopping list

Write the documentation of your project here. Do not include your personal
details (e.g. name or student number).

Remember to include the address of the online location where your project is
running as it is a key part of the submission.

# LINK TO HOSTING SERVICE:

A [link](https://king-terrys-wsd-project-ii-shared.onrender.com/lists)

Note!!! The Onrender hosting service is utter garbage and is slow to respond. I have deactivated all my other webservices made in this course. This seemed to help significantly, however, it is still possible to get the hosting service to prompt "Internal Server Error" if you spam the links. As this doesn't occur when hosting the application locally, regardless of how rapidly you spam, it is clearly a problem with Onrender (Onrender allows only 0.1 CPU for free users) and not the application. 

I also experienced this with the other online deployment excersices that used databases in the hosting service...

# Project structure:
.
├── e2e-playwright
│   ├── tests
│   │   └── shopping-list-management.spec.js
│   ├── Dockerfile
│   ├── package.json
│   └── playwright.config.js
├── flyway
│   └── sql
│       └── V1___initial_schema.sql
├── shopping-lists
│   ├── controllers
│   │   └── shoppingController.js
│   ├── database
│   │   └── database.js
│   ├── services
│   │   ├── shoppingItemService.js
│   │   └── shoppingListService.js
│   ├── views
│   │   ├── layouts
│   │   │   └── layout.eta
│   │   ├── index.eta
│   │   ├── shoppingItems.eta
│   │   └── shoppingLists.eta
│   ├── Dockerfile
│   ├── app.js
│   └── deps.js
├── README.md
├── docker-compose.yml
└── project.env

Above is shown the stucture for the project. 

## Controllers:

    "shoppingController.js" is the interface between "app.js" and the database containing 
    all entries of shopping_lists and shopping_list_items. It uses the functions defined in "shoppingListService.js" and "shoppingItemService.js" to add lists and items; deactivate lists; collect items; get statistics; and find lists and items.

## Database:

    "database.js" uses a connections pool to access the database. All SQL commands of the application (SQL from "shoppingListService.js" and "shoppingItemService.js") are executed using the "executeQuery()" function defined in this file.

## Services:

    "shoppingItemService.js" contains all of the SQL commands for creating, collecting and finding shopping items in shopping lists and getting statistics. Contains all of the SQL relating to the "shopping_list_items" database schema.

    "shoppingListService.js" contains all of the functionality for creating, deactivating and finding shopping lists and getting statistics. Basically it contains all of the SQL commands relating to the "shopping_lists" database schema.

## Views:
    
    Layouts:

        "layout.eta" is the main layout for the website that is used by all the ".eta" files for different pages of the website.

    "index.eta" is used to render the main page ("/") of the website. "layout.eta" as a base.

    "shoppingItems.eta" is used to when rendering the page ("/lists/{id}") containing shopping items of a specific shopping list. It uses "layout.eta" as a base.

    "shoppingLists.eta" is used to render the page ("/lists") containing all current shopping lists

## TESTS:

    The included tests can be run with the following command: 
    
    "docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf"

    Note!!! The database does not need to be empty for the tests to work properly however, upon successfully completing the tests the database will be cleared.