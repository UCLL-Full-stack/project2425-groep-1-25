import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.profileEvent.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
    await prisma.location.deleteMany();
    await prisma.category.deleteMany();

    const eventDate = add(new Date(), { days: 1 });

    const locationEvent1 = await prisma.location.create({
        data: {
            street: 'ING Arena',
            number: 1,
            city: 'Brussels',
            country: 'Belgium',
        },
    });

    const locationEvent2 = await prisma.location.create({
        data: {
            street: 'Ijsbaan Leuven',
            number: 1,
            city: 'Leuven',
            country: 'Belgium',
        },
    });

    const locationEvent3 = await prisma.location.create({
        data: {
            street: 'Wienerstrasse',
            number: 1,
            city: 'Salzburg',
            country: 'Austria',
        },
    });

    const concertCategory = await prisma.category.create({
        data: {
            name: 'Concert',
            description: 'Concert of artist',
        },
    });

    const artCategory = await prisma.category.create({
        data: {
            name: 'Concert',
            description: 'Concert of artist',
        },
    });

    await prisma.category.create({
        data: {
            name: 'Festival',
            description: 'Festival event',
        },
    });

    await prisma.category.create({
        data: {
            name: 'Comedy show',
            description: 'Comedy show of a comedian',
        },
    });

    await prisma.category.create({
        data: {
            name: 'Cantus',
            description: 'Drink alot of beer :)',
        },
    });

    await prisma.category.create({
        data: {
            name: 'Techno',
            description: 'A techno event, perfect for people that like techno',
        },
    });
    const sportCategory = await prisma.category.create({
        data: {
            name: 'Sport',
            description: 'Sport event',
        },
    });
    const event1 = await prisma.event.create({
        data: {
            name: 'Fred Again..',
            date: eventDate,
            price: 20,
            minParticipants: 5,
            maxParticipants: 10,
            location: { connect: { id: locationEvent1.id } },
            category: { connect: { id: concertCategory.id } },
        },
    });
    const event2 = await prisma.event.create({
        data: {
            name: 'ice hockey',
            date: eventDate,
            price: 10,
            minParticipants: 10,
            maxParticipants: 20,
            location: { connect: { id: locationEvent2.id } },
            category: { connect: { id: sportCategory.id } },
        },
    });
    const event3 = await prisma.event.create({
        data: {
            name: 'Theater',
            date: eventDate,
            price: 20,
            minParticipants: 5,
            maxParticipants: 10,
            location: { connect: { id: locationEvent1.id } },
            category: { connect: { id: artCategory.id } },
        },
    });
    const event4 = await prisma.event.create({
        data: {
            name: 'skiing',
            date: eventDate,
            price: 2000,
            minParticipants: 5,
            maxParticipants: 10,
            location: { connect: { id: locationEvent3.id } },
            category: { connect: { id: sportCategory.id } },
        },
    });
    const locationJefke = await prisma.location.create({
        data: {
            street: 'Kapucijnenvoer',
            number: 5,
            city: 'Leuven',
            country: 'Belgium',
        },
    });
    const jefke = await prisma.user.create({
        data: {
            userName: 'Jefke',
            email: 'JefkeVermeulen@gmail.com',
            role: 'User',
            password: await bcrypt.hash('Test123', 12),
        },
    });
    const profileJefke = await prisma.profile.create({
        data: {
            firstName: 'Jefke',
            lastName: 'Vermeulen',
            age: 45,
            location: { connect: { id: locationJefke.id } },
            category: { connect: { id: concertCategory.id } },
            user: { connect: { id: jefke.id } },
        },
    });
    const admin = await prisma.user.create({
        data: {
            userName: 'admin',
            email: 'GuntherAdmin@gmail.com',
            role: 'Admin',
            password: await bcrypt.hash('admin123', 12),
        },
    });
    const profileAdmin = await prisma.profile.create({
        data: {
            firstName: 'Gunther',
            lastName: 'hackerman',
            age: 99,
            location: { connect: { id: locationJefke.id } },
            category: { connect: { id: concertCategory.id } },
            user: { connect: { id: admin.id } },
        },
    });
    const mod = await prisma.user.create({
        data: {
            userName: 'mod',
            email: 'mod@gmail.com',
            role: 'Mod',
            password: await bcrypt.hash('mod123', 12),
        },
    });
    const profileMod = await prisma.profile.create({
        data: {
            firstName: 'mod',
            lastName: 'mod',
            age: 18,
            location: { connect: { id: locationJefke.id } },
            category: { connect: { id: concertCategory.id } },
            user: { connect: { id: mod.id } },
        },
    });
};
(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
