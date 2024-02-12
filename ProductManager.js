/*---------------------------------------------------------------------------------
*                                                                                 *
*                             Clase Producto manager                              *
*_________________________________________________________________________________*/
import fs from 'fs';
class ProductManager {
    // Id global
    static id = 0;
    constructor() {
        // Inicializando la clase
        this.products = [];
        this.fs = fs
        this.ProdDirPath = "/files";
        this.ProdFilePath = this.ProdDirPath + "/Products.json";
    }
    /*---------------------------------------------------------------------------------
    *                                Método UpdateFile                                *
    *             Método utilizado para crear y leer el archivo de Productos.         *
    *_________________________________________________________________________________*/
    updateFile = async () => {
        /// Crear el directorio
        await this.fs.promises.mkdir(this.ProdDirPath, { recursive: true });
        // Se valida la existencia del archivo o se crea
        if (!this.fs.existsSync(this.ProdFilePath)) {
            // Crea el archivo vacío
            await this.fs.promises.writeFile(this.ProdFilePath, "[]");
        };
        // Leemos el archivo
        let productsFile = await this.fs.promises.readFile(this.ProdFilePath, "utf-8");
        // Se parsea el .json
        this.products = JSON.parse(productsFile);
    }
    /*---------------------------------------------------------------------------------
    *                              Método idPersistence                               *
    *        Método utilizado para actualizar el id y qué persista el más alto.       *
    *_________________________________________________________________________________*/
    idPersistence = async (products) => {
        const higherId = products.reduce((maxId, obj) => {
            return obj.id > maxId ? obj.id : maxId;
        }, -1);
        ProductManager.id = higherId + 1
    }
    /*---------------------------------------------------------------------------------
    *                                Método addProduct                                *
    *              Agregará un producto al arreglo de productos inicial.              *
    *_________________________________________________________________________________*/
    addProduct = async (product) => {
        // Llamará aidPersistence para actualizar el id global
        await this.idPersistence(await this.getProducts())
        // Validación de campos obligatorios
        if (!product.title || !product.description || !product.price /*|| !product.thumbnail*/ || !product.code || !product.stock) {
            console.error("All fields are required.\n");
            return;
        }
        try {
            await this.updateFile()
            //Validación de código único
            if (this.products.some(p => p.code === product.code)) {
                console.log("A product with the same code already exists\n");
            } else {
                // Asignación de id autoincrementable
                const newProduct = {
                    id: ProductManager.id,
                    ...product
                };
                // Agregar el nuevo producto al arreglo
                this.products.push(newProduct);
                console.log(newProduct, "\n");
                // Actualizamos el archivo de productos
                await this.fs.promises.writeFile(this.ProdFilePath, JSON.stringify(this.products, null, 2, "\t"));
                console.log(`the product was created successfully\n`);
                console.log("The product was created with the id:", ProductManager.id, "\n");
            }
        } catch (error) {
            console.error(`Error adding new product ${JSON.stringify(newProduct)}, error detail: ${error}`);
            throw Error(`Error adding new product: ${JSON.stringify(newProduct)}, error detail: ${error}`);
        }
    }
    /*---------------------------------------------------------------------------------
    *                                Método getProduct                                *
    *     Devolverá el arreglo con todos los productos creados hasta el momento.      *
    *_________________________________________________________________________________*/
    getProducts = async () => {
        try {
            await this.updateFile()
            return this.products
        } catch (error) {
            console.error(`Error consulting products: ${this.ProdDirPath}, error detail: ${error}`);
            throw Error(`Error consulting products: ${this.ProdDirPath}, error detail: ${error}`);
        }
    }
    /*---------------------------------------------------------------------------------
    *                              Método getProductById                              *
    *               Buscará un producto específico recibiendo el id.                  *
    *_________________________________________________________________________________*/
    getProductById = async (id) => {
        try {
            await this.updateFile()
            // Busca en el arreglo el producto que coincida por su id
            const parseId =parseInt(id)
            const product = this.products.find(p => p.id === parseId);
            if (product) {
                return product;
            } else {
                console.log("Product not found\n");
            }
        } catch (error) {
            console.error(`Error consulting products by id: ${this.ProdDirPath}, error detail: ${error}`);
            throw Error(`Error consulting products by id: ${this.ProdDirPath}, error detail: ${error}`);
        }
    }
    /*---------------------------------------------------------------------------------
    *                              Método removeProduct                               *
    *                  Removerá un producto especificado por el id.                   *
    *_________________________________________________________________________________*/
    removeProduct = async (id) => {
        try {
            // Obtener la lista de productos actualizada actualizada
            let updatedList = await this.getProducts()
            if (this.products.some(p => p.id === id)) {
                // Remover el producto con el id especificado
                updatedList = updatedList.filter(obj => obj.id !== id);
                this.products = updatedList
                // Actualizamos el archivo de productos
                await this.fs.promises.writeFile(this.ProdFilePath, JSON.stringify(this.products, null, 2, "\t"));
                console.log(`The product was deleted successfully\n`);
                console.log(`The new list of products:\n`);
                console.log(this.products, "\n");
            }else{
                console.log("The product you want to delete does not exist\n");
            }
        } catch (error) {
            console.error(`Error deleting product, error detail: ${error}`);
            throw Error(`Error deleting product, error detail: ${error}`);
        }
    }
    /*---------------------------------------------------------------------------------
    *                              Método upDateProduct                               *
    * Modificará un producto identificado con id y objeto con propiedades modificadas.*
    *_________________________________________________________________________________*/
    updateProduct = async (id, objMod) => {
        try {
            const parseId =parseInt(id)
            // Obtener la lista de productos actualizada actualizada
            let updatedList = await this.getProducts()
            if (this.products.some(p => p.id === parseId)) {
                // Mofificar el producto
                for (let i = 0; i < updatedList.length; i++) {
                    if (updatedList[i].id === parseId) {
                        updatedList[i] = { ...updatedList[i], ...objMod };
                        console.log("The product was modified successfully\n");
                        this.products = updatedList
                        console.log(this.products[i], "\n");
                    }
                }
            } else {
                console.log("The product you want to modify does not exist\n");
            }
            // Actualizamos el archivo de productos
            await this.fs.promises.writeFile(this.ProdFilePath, JSON.stringify(this.products, null, 2, "\t"));
        } catch (error) {
            console.error(`Error modifying product, error detail: ${error}`);
            throw Error(`Error modifying product, error detail: ${error}`);
        }
    }
}
// --------------------------Exportar clase -------------------------------

export default ProductManager
