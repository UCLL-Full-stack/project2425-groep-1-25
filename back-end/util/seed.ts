import { PrismaClient } from '@prisma/client';
import { add } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();
    await prisma.event.deleteMany();
    await prisma.location.deleteMany();
    await prisma.category.deleteMany();
    await prisma.profile.deleteMany();

    const eventDate = add(new Date(), { days: 1 });

    const locationEvent1 = await prisma.location.create({
        data: {
            street: 'ING Arena',
            number: 1,
            city: 'Brussels',
            country: 'Belgium',
        },
    });

    const concertCategory = await prisma.category.create({
        data: {
            name: 'Concert',
            description: 'Concert of artist',
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
            password: 'Hello',
        },
    });
    const profileJefke = await prisma.profile.create({
        data: {
            firstName: 'Jefke',
            lastName: 'Vermeulen',
            email: 'JefkeVermeulen@gmail.com',
            age: 45,
            administrator: false,
            location: { connect: { id: locationJefke.id } },
            category: { connect: { id: concertCategory.id } },
            user: { connect: { id: jefke.id } },
        },
    });
    const admin = await prisma.user.create({
        data: {
            userName: 'admin',
            password: 'admin',
        },
    });
    const profileAdmin = await prisma.profile.create({
        data: {
            firstName: 'Gunther',
            lastName: 'hackerman',
            email: 'GuntherAdmin@gmail.com',
            age: 99,
            administrator: true,
            location: { connect: { id: locationJefke.id } },
            category: { connect: { id: concertCategory.id } },
            user: { connect: { id: admin.id } },
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
