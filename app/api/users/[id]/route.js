import { NextResponse } from 'next/server';

let users = [
    { id: 1, name: "Juan Pérez", email: "juan@example.com", age: 25 },
    { id: 2, name: "María García", email: "maria@example.com", age: 30 },
    { id: 3, name: "Carlos López", email: "carlos@example.com", age: 28 }
];

// GET - Obtener usuario por ID
export async function GET(request, { params }) {
    const id = parseInt(params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return NextResponse.json(
            { message: "Usuario no encontrado" },
            { status: 404 }
        );
    }

    return NextResponse.json(user);
}

// PUT - Actualizar usuario por ID
export async function PUT(request, { params }) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();

        const userIndex = users.findIndex(u => u.id === id);

        if (userIndex === -1) {
            return NextResponse.json(
                { message: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Actualización parcial: solo actualizar los campos proporcionados
        const currentUser = users[userIndex];
        const updatedUser = {
            ...currentUser,
            name: body.name !== undefined ? body.name : currentUser.name,
            email: body.email !== undefined ? body.email : currentUser.email,
            age: body.age !== undefined ? body.age : currentUser.age
        };

        // Validar email si se está actualizando
        if (body.email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(body.email)) {
                return NextResponse.json(
                    { message: "Formato de email inválido" },
                    { status: 400 }
                );
            }
            // Verificar que el nuevo email no esté en uso por otro usuario
            if (users.some(u => u.email === body.email && u.id !== id)) {
                return NextResponse.json(
                    { message: "El email ya está registrado" },
                    { status: 400 }
                );
            }
        }

        // Validar age si se está actualizando
        if (body.age !== undefined && (typeof body.age !== 'number' || body.age <= 0)) {
            return NextResponse.json(
                { message: "La edad debe ser un número positivo" },
                { status: 400 }
            );
        }

        users[userIndex] = updatedUser;

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json(
            { message: "Error al procesar la solicitud" },
            { status: 400 }
        );
    }
}

// DELETE - Eliminar usuario por ID
export async function DELETE(request, { params }) {
    const id = parseInt(params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return NextResponse.json(
            { message: "Usuario no encontrado" },
            { status: 404 }
        );
    }

    users = users.filter(u => u.id !== id);

    return NextResponse.json(
        { message: "Usuario eliminado correctamente" },
        { status: 200 }
    );
} 