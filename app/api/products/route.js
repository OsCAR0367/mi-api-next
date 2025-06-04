import { NextResponse } from 'next/server';

// Base de datos simulada
let products = [
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Mouse", price: 25 },
    { id: 3, name: "Teclado", price: 50 },
];

// GET - Obtener productos con filtros
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null;
    const name = searchParams.get('name');

    let filteredProducts = [...products];

    // Filtrar por precio mínimo
    if (minPrice !== null) {
        filteredProducts = filteredProducts.filter(p => p.price >= minPrice);
    }

    // Filtrar por precio máximo
    if (maxPrice !== null) {
        filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);
    }

    // Filtrar por nombre (búsqueda parcial, no sensible a mayúsculas/minúsculas)
    if (name) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    return NextResponse.json(filteredProducts);
}

// POST - Crear un nuevo producto
export async function POST(request) {
    try {
        const body = await request.json();
        
        // Validar campos requeridos
        if (!body.name || !body.price) {
            return NextResponse.json(
                { message: "Los campos name y price son requeridos" },
                { status: 400 }
            );
        }

        // Validar que el precio sea un número positivo
        if (typeof body.price !== 'number' || body.price <= 0) {
            return NextResponse.json(
                { message: "El precio debe ser un número positivo" },
                { status: 400 }
            );
        }

        // Crear nuevo producto
        const newProduct = {
            id: products.length + 1,
            name: body.name,
            price: body.price
        };

        products.push(newProduct);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error al procesar la solicitud" },
            { status: 400 }
        );
    }
}