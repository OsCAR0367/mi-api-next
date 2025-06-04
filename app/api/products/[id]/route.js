import { NextResponse } from 'next/server';

let products = [
    { id: 1, name: "Laptop", price: 1200 },
    { id: 2, name: "Mouse", price: 25 },
    { id: 3, name: "Teclado", price: 50 },
];

export async function GET(request, { params }) {
    const id = parseInt(params.id);
    const product = products.find((p) => p.id === id);

    if (!product) {
        return NextResponse.json(
            { message: "Producto no encontrado" },
            { status: 404 }
        );
    }

    return NextResponse.json(product);
}

export async function PUT(request, { params }) {
    try {
        const id = parseInt(params.id);
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

        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return NextResponse.json(
                { message: "Producto no encontrado" },
                { status: 404 }
            );
        }

        // Actualizar producto
        const updatedProduct = {
            id,
            name: body.name,
            price: body.price
        };

        products[productIndex] = updatedProduct;

        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json(
            { message: "Error al procesar la solicitud" },
            { status: 400 }
        );
    }
}

export async function DELETE(request, { params }) {
    const id = parseInt(params.id);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return NextResponse.json(
            { message: "Producto no encontrado" },
            { status: 404 }
        );
    }

    products = products.filter(p => p.id !== id);

    return NextResponse.json(
        { message: "Producto eliminado correctamente" },
        { status: 200 }
    );
} 