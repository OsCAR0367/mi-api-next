# API de Productos con Next.js

Esta es una API REST simple para gestionar productos, construida con Next.js 13+ utilizando el nuevo App Router.

## Endpoints Disponibles

### 1. Obtener todos los productos
- **Método:** GET
- **URL:** `/api/products`
- **Respuesta exitosa:**
  ```json
  [
    { "id": 1, "name": "Laptop", "price": 1200 },
    { "id": 2, "name": "Mouse", "price": 25 },
    { "id": 3, "name": "Teclado", "price": 50 }
  ]
  ```

### 2. Crear un nuevo producto
- **Método:** POST
- **URL:** `/api/products`
- **Body:**
  ```json
  {
    "name": "Monitor",
    "price": 300
  }
  ```
- **Respuesta exitosa:** (201 Created)
  ```json
  {
    "id": 4,
    "name": "Monitor",
    "price": 300
  }
  ```

### 3. Obtener un producto específico
- **Método:** GET
- **URL:** `/api/products/{id}`
- **Respuesta exitosa:**
  ```json
  {
    "id": 1,
    "name": "Laptop",
    "price": 1200
  }
  ```

### 4. Actualizar un producto
- **Método:** PUT
- **URL:** `/api/products/{id}`
- **Body:**
  ```json
  {
    "name": "Laptop Gaming",
    "price": 1500
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "id": 1,
    "name": "Laptop Gaming",
    "price": 1500
  }
  ```

### 5. Eliminar un producto
- **Método:** DELETE
- **URL:** `/api/products/{id}`
- **Respuesta exitosa:**
  ```json
  {
    "message": "Producto eliminado correctamente"
  }
  ```

## Validaciones

- Los campos `name` y `price` son requeridos para crear y actualizar productos
- El `price` debe ser un número positivo
- Se retornan errores 404 cuando no se encuentra un producto
- Se retornan errores 400 para solicitudes inválidas

## Códigos de Estado

- 200: Operación exitosa
- 201: Recurso creado exitosamente
- 400: Solicitud inválida
- 404: Recurso no encontrado
