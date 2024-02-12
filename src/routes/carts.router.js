import CartManager from '../../CartManager.js';
const cartManager = new CartManager();
import { Router } from 'express';

const router = Router();

/*---------------------------------------------------------------------------------
*                                    Endpoints                                    *
*_________________________________________________________________________________*/
/*---------------------------------------------------------------------------------
*                                 POST (New product)                              *
*_________________________________________________________________________________*/
router.post('/', async (req, res) => {
    try {
        await cartManager.addCart()
        res.send({ message: 'Cart added successfully' });
        await cartManager.getCarts()
    } catch (error) {
        res.status(500).send({ error: error.message });

    }
});
/*---------------------------------------------------------------------------------
*                                    GET (ById)                                   *
*_________________________________________________________________________________*/
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.send(cart);
        } else {
            res.status(404).send({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
/*---------------------------------------------------------------------------------
*                                 POST (New product)                              *
*_________________________________________________________________________________*/
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        await cartManager.addProductInCart(cartId, productId)
        res.send({ message: 'Cart added successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });

    }
});

export default router;