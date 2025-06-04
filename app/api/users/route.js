import { NextResponse } from 'next/server';

// Base de datos simulada de usuarios
let users = [
    { id: 1, name: "Juan Pérez", email: "juan@example.com", age: 25 },
    { id: 2, name: "María García", email: "maria@example.com", age: 30 },
    { id: 3, name: "Carlos López", email: "carlos@example.com", age: 28 }
];

// GET - Obtener usuarios con filtros
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const minAge = searchParams.get('minAge') ? parseInt(searchParams.get('minAge')) : null;
    const maxAge = searchParams.get('maxAge') ? parseInt(searchParams.get('maxAge')) : null;
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    let filteredUsers = [...users];

    // Filtrar por edad mínima
    if (minAge !== null) {
        filteredUsers = filteredUsers.filter(u => u.age >= minAge);
    }

    // Filtrar por edad máxima
    if (maxAge !== null) {
        filteredUsers = filteredUsers.filter(u => u.age <= maxAge);
    }

    // Filtrar por nombre (búsqueda parcial, no sensible a mayúsculas/minúsculas)
    if (name) {
        filteredUsers = filteredUsers.filter(u => 
            u.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // Filtrar por email (búsqueda parcial, no sensible a mayúsculas/minúsculas)
    if (email) {
        filteredUsers = filteredUsers.filter(u => 
            u.email.toLowerCase().includes(email.toLowerCase())
        );
    }

    return NextResponse.json(filteredUsers);
}

// POST - Crear un nuevo usuario
export async function POST(request) {
    try {
        const body = await request.json();
        
        // Validar campos requeridos
        if (!body.name || !body.email || !body.age) {
            return NextResponse.json(
                { message: "Los campos name, email y age son requeridos" },
                { status: 400 }
            );
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { message: "Formato de email inválido" },
                { status: 400 }
            );
        }

        // Validar que age sea un número positivo
        if (typeof body.age !== 'number' || body.age <= 0) {
            return NextResponse.json(
                { message: "La edad debe ser un número positivo" },
                { status: 400 }
            );
        }

        // Validar email único
        if (users.some(user => user.email === body.email)) {
            return NextResponse.json(
                { message: "El email ya está registrado" },
                { status: 400 }
            );
        }

        // Crear nuevo usuario
        const newUser = {
            id: users.length + 1,
            name: body.name,
            email: body.email,
            age: body.age
        };

        users.push(newUser);

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error al procesar la solicitud" },
            { status: 400 }
        );
    }
}

// PUT - Actualizar un usuario
export async function PUT(request) {
    try {
        const body = await request.json();
        
        if (!body.id) {
            return NextResponse.json(
                { message: "Se requiere el ID del usuario" },
                { status: 400 }
            );
        }

        const userIndex = users.findIndex(u => u.id === body.id);

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
            if (users.some(u => u.email === body.email && u.id !== body.id)) {
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

// DELETE - Eliminar un usuario
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id'));

        if (!id) {
            return NextResponse.json(
                { message: "Se requiere el ID del usuario" },
                { status: 400 }
            );
        }

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
    } catch (error) {
        return NextResponse.json(
            { message: "Error al procesar la solicitud" },
            { status: 400 }
        );
    }
} 