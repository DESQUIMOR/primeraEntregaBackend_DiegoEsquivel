/*---------------------------------------------------------------------------------
*                                API whith express                                *
*_________________________________________________________________________________*/
import express from 'express';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import __dirname from '../utils.js'
/*---------------------------------------------------------------------------------
*                              Server configurations                              *
*_________________________________________________________________________________*/
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/src/public'))
/*---------------------------------------------------------------------------------
*                      Puntos de entrada para los routers                         *
*_________________________________________________________________________________*/
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
/*---------------------------------------------------------------------------------
*                                     LISTENER                                    *
*_________________________________________________________________________________*/
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});