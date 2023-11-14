const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {

    it("1. Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto.", async () => {
        const { body, statusCode } = await request(server).get("/cafes").send();
        expect(body).toBeInstanceOf(Array)
        expect(body.length).toBeGreaterThan(0)       
        expect(statusCode).toBe(200)
        });

    it("2. Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe.", async () => {
        const id = Math.floor(Math.random() * 999); // generación de id totalmente aleatorio y seteado a número natural
        const cafe = { id, nombre: "Café con id que no existe" };
        const deleteCafe = await request(server)
            .delete(`/cafes/${id}`)
            .set("Authorization", "Bearer fakeToken") // tuve que agregar un token falso o nulo en las cabeceras, de lo contrario me arroja código 400
            .send(cafe); 
        expect(deleteCafe.statusCode).toBe(404);  
        });

    it("3. Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201.", async () => {
        const id = Math.floor(Math.random() * 999);
        const cafe = { id, nombre: "Nuevo café" };
        const postResponse = await request(server).post("/cafes").send(cafe); 
        expect(postResponse.statusCode).toBe(201);  
        expect(postResponse.body).toContainEqual(cafe);  
        });

   
    it("4. Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload.", async () => {
        const cafeId = Math.floor(Math.random() * 999);     // genera un id aleatorio para el café del body
        const cafeToUpdate = { id: cafeId, nombre: "Café a modificar" };
        const cafeParamsId = Math.floor(Math.random() * 998);   // genera un id aleatorio diferente al id que van en el body

        const updateCafeResponse = await request(server)
            .put(`/cafes/${cafeParamsId}`)          // se usa el id aleatorio que es diferente al del body
            .send(cafeToUpdate); 

        expect(updateCafeResponse.statusCode).toBe(400);  
        })
    })
