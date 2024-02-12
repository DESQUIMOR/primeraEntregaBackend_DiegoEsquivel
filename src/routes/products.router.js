import { Router } from 'express';
import ProductManager from '../../ProductManager.js';

const router = Router();
const productManager = new ProductManager();
/*---------------------------------------------------------------------------------
*                                    Endpoints                                    *
*_________________________________________________________________________________*/
/*---------------------------------------------------------------------------------
*                                    GET (All)                                    *
*_________________________________________________________________________________*/
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
/*---------------------------------------------------------------------------------
*                                    GET (ById)                                   *
*_________________________________________________________________________________*/
router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
/*---------------------------------------------------------------------------------
*                                 POST (New product)                              *
*_________________________________________________________________________________*/
router.post('/', async (req, res) => {
    const newProduct = req.body;
    try {
        await productManager.addProduct(newProduct);
        res.send({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
/*---------------------------------------------------------------------------------
*                               PUT (Update product)                              *
*_________________________________________________________________________________*/
router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.id);
    const modifiedProduct = req.body;
    try {
        await productManager.updateProduct(productId, modifiedProduct);
        res.send({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
/*---------------------------------------------------------------------------------
*                             DELETE (Remove Product)                             *
*_________________________________________________________________________________*/
router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.id);
    try {
        await productManager.removeProduct(productId);
        
        
        res.send(productManager.products);
        // { message: 'Product deleted successfully' }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;