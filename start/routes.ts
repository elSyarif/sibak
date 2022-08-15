/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// path
Route.group(() => {
    // route version
    Route.group(() => {

        // auth route
        Route.group(() => {
            Route.post('/login', 'AuthController.login')
            Route.post('/register', 'AuthController.register')
    
            Route.group(() => {
                Route.post('/refresh-token', 'AuthController.refresh')
                Route.delete('/logout', 'AuthController.logout')
            }).middleware('auth:jwt')
        }).prefix('/auth')

        // users route
        //

    }).prefix('/v1')
}).prefix('/api')

