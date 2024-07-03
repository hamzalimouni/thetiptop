import prisma from './db';

const prismaData = async () => {
    try {
        await prisma.profits.createMany({
            data: [
                {
                    id: 1,
                    libelle: 'Infuseur à thé',
                    percentage: 60,
                    quantityTotal: 300000,
                    quantityRemaining: 300000,
                    img: 'infuseur.png',
                    status: true,
                },
                {
                    id: 2,
                    libelle: 'Boite de 100g d’un thé détox ou d’infusion',
                    percentage: 20,
                    quantityTotal: 100000,
                    quantityRemaining: 100000,
                    img: 'boitedetox.png',
                    status: true,
                },
                {
                    id: 3,
                    libelle: 'Boite de 100g d’un thé signature',
                    percentage: 10,
                    quantityTotal: 50000,
                    quantityRemaining: 50000,
                    img: 'boitesignature.png',
                    status: true,
                },
                {
                    id: 4,
                    libelle: 'Coffret découverte d’une valeur de 39€',
                    percentage: 6,
                    quantityTotal: 30000,
                    quantityRemaining: 30000,
                    img: 'coffret39.png',
                    status: true,
                },
                {
                    id: 5,
                    libelle: 'Coffret découverte d’une valeur de 69€',
                    percentage: 4,
                    quantityTotal: 20000,
                    quantityRemaining: 20000,
                    img: 'coffret69.png',
                    status: true,
                },
            ],
        });

        await prisma.config.create({
            data: {
                id: 1,
                dateOfStart: new Date('2024-03-01'),
                dateOfEnd: new Date('2024-03-31'),
                dateOfValidate: new Date('2024-04-30'),
            },
        });

        console.log('Prisma data inserted successfully.');
    } catch (error) {
        console.error('Error inserting prisma data:', error);
    }
};

prismaData();
