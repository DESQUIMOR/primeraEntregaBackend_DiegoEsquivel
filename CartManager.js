/*---------------------------------------------------------------------------------
*                                                                                 *
*                             Clase Producto manager                              *
*_________________________________________________________________________________*/
import fs from 'fs';
import ProductManager from './ProductManager.js';
const productManager = new ProductManager;
class CartManager {
    // Id global
    static id = 0;
    constructor() {
        // Inicializando la clase
        this.carts = [];
        this.cart = { "products": [{ id: 0, quantity: 0 }] }
        this.fs = fs
        this.CartDirPath = "/files";
        this.CartFilePath = this.CartDirPath + "/Carts.json";
    }
    /*---------------------------------------------------------------------------------
    *                                Método UpdateFile                                *
    *             Método utilizado para crear y leer el archivo de Productos.         *
    *_________________________________________________________________________________*/
    updateFile = async () => {
        /// Crear el directorio
        await this.fs.promises.mkdir(this.CartDirPath, { recursive: true });
        // Se valida la existencia del archivo o se crea
        if (!this.fs.existsSync(this.CartFilePath)) {
            // Crea el archivo vacío
            await this.fs.promises.writeFile(this.CartFilePath, "[]");
        };
        // Leemos el archivo
        let cartsFile = await this.fs.promises.readFile(this.CartFilePath, "utf-8");
        // Se parsea el .json
        this.carts = JSON.parse(cartsFile);
    }
    /*---------------------------------------------------------------------------------
    *                              Método idPersistence                               *
    *        Método utilizado para actualizar el id y qué persista el más alto.       *
    *_________________________________________________________________________________*/
    idPersistence = async (carts) => {
        const higherId = carts.reduce((maxId, obj) => {
            return obj.id > maxId ? obj.id : maxId;
        }, -1);
        CartManager.id = higherId + 1
    }
    /*---------------------------------------------------------------------------------
    *                                  Método addCart                                 *
    *               Agregará un carrito al arreglo de carritos inicial.               *
    *_________________________________________________________________________________*/
    addCart = async () => {
        // Llamará aidPersistence para actualizar el id global
        await this.idPersistence(await this.getCarts())
        // Validación de campos obligatorios
        try {
            await this.updateFile()
            // Asignación de id autoincrementable
            const newCart = {
                id: CartManager.id,
                ...this.cart
            };
            // Agregar el nuevo producto al arreglo
            this.carts.push(newCart);
            console.log(newCart, "\n");
            // Actualizamos el archivo de productos
            await this.fs.promises.writeFile(this.CartFilePath, JSON.stringify(this.carts, null, 2, "\t"));
            console.log(`the cart was created successfully\n`);
            console.log("The cart was created with the id:", CartManager.id, "\n");
        } catch (error) {
            console.error(`Error adding new cart ${JSON.stringify(newCart)}, error detail: ${error}`);
            throw Error(`Error adding new cart: ${JSON.stringify(newCart)}, error detail: ${error}`);
        }
    }
    /*---------------------------------------------------------------------------------
    *                                  Método getCarts                                *
    *      Devolverá el arreglo con todos los carritos creados hasta el momento.      *
    *_________________________________________________________________________________*/
    getCarts = async () => {
        try {
            await this.updateFile()
            return this.carts
        } catch (error) {
            console.error(`Error consulting carts: ${this.ProdDirPath}, error detail: ${error}`);
            throw Error(`Error consulting carts: ${this.ProdDirPath}, error detail: ${error}`);
        }
    }
    /*---------------------------------------------------------------------------------
    *                               Método getCartsById                               *
    *    Devolverá el carrito especificadp por el id en que recibe como parametro.    *
    *_________________________________________________________________________________*/
    getCartById = async (id) => {
        try {
            await this.updateFile()
            const parseId = parseInt(id)
            // Busca en el arreglo el producto que coincida por su id
            const cart = this.carts.find(c => c.id === parseId);
            if (cart) {
                return cart;
            } else {
                console.log("Cart not found\n");
            }
        } catch (error) {
            console.error(`Error consulting carts by id: ${this.CartDirPath}, error detail: ${error}`);
            throw Error(`Error consulting carts by id: ${this.CartDirPath}, error detail: ${error}`);
        }
    }
    /*---------------------------------------------------------------------------------
    *                             Método addProductInCart                             *
    *      Agregará un preoducto según el id especificado al carrito especificado     *
    *_________________________________________________________________________________*/
    addProductInCart = async (idcart, idProduct) => {
        const parseIdCart = parseInt(idcart)
        const parseIdProduct = parseInt(idProduct)
        const productToAdd = await productManager.getProductById(parseIdProduct)
        try {
            await this.updateFile()
            const cart = this.carts.find(c => c.id === parseIdCart);
            if (cart) {
                const prodFound = cart.products.find(p => p.id === parseIdProduct)
                if (prodFound) {
                    prodFound.quantity++
                    await this.fs.promises.writeFile(this.CartFilePath, JSON.stringify(this.carts, null, 2, "\t"));
                    console.log(`the product was added successfully\n`);
                } else {
                    cart.products.push({ id: productToAdd.id, quantity: 1 });
                    await this.fs.promises.writeFile(this.CartFilePath, JSON.stringify(this.carts, null, 2, "\t"));
                    console.log(`the product was added successfully\n`);
                }
            }
        } catch (error) {
            console.error(`Error adding new product ${JSON.stringify(productToAdd)}, error detail: ${error}`);
            throw Error(`Error adding new product: ${JSON.stringify(productToAdd)}, error detail: ${error}`);
        }
    }
}
// --------------------------Exportar clase -------------------------------
export default CartManager