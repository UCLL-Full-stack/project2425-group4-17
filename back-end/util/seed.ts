import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { subDays } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    try {
        await prisma.articleLike.deleteMany();
        await prisma.review.deleteMany();
        await prisma.article.deleteMany();
        await prisma.paper.deleteMany();
        await prisma.user.deleteMany();

        const userInputs = [
            {
                firstName: "Admin",
                lastName: "Admin",
                email: "Admin@admin.com",
                username: "admin",
                password: await bcrypt.hash("admin", 12),
                role: "admin",
            },
            {
                firstName: "Jhon",
                lastName: "Doe",
                email: "jhon.doe@ucll.be",
                username: "Jhon",
                password: await bcrypt.hash("Doe", 12),
                role: "admin",
            },
            {
                firstName: "Reader",
                lastName: "Reader",
                email: "reader@gmail.com",
                username: "reader",
                password: await bcrypt.hash("reader", 12),
                role: "reader",
            },
            {
                firstName: "Rudy",
                lastName: "Vranckx",
                email: "rudy@vranckx.com",
                username: "Rudy",
                password: await bcrypt.hash("rudy", 12),
                role: "journalist",
            },
            {
                firstName: "Ruben",
                lastName: "Van Gugcht",
                email: "ruben@gucht.com",
                username: "ruben",
                password: await bcrypt.hash("ruben", 12),
                role: "journalist",
            },
            ...(await Promise.all(Array.from({ length: 5 }, async (_, i) => ({
                firstName: `Reader${i + 1}`,
                lastName: `Reader${i + 1}`,
                email: `reader${i + 1}@gmail.com`,
                username: `reader${i + 1}`,
                password: await bcrypt.hash(`reader${i + 1}`, 12),
                role: "reader",
            })))),
        ];

        const createdUsers = [];
        for (const user of userInputs) {
            const createdUser = await prisma.user.create({ data: user });
            createdUsers.push(createdUser);
        }

        // Create papers
        const paperInputs = [
            {
                date: subDays(new Date(), 2),
                namePaper: "Paper 1",
                namePublisher: "Publisher 1",
            },
            {
                date: subDays(new Date(), 1),
                namePaper: "Paper 2",
                namePublisher: "Publisher 2",
            },
            {
                date: new Date(),
                namePaper: "Paper 3",
                namePublisher: "Publisher 3",
            },
        ];

        const createdPapers = await Promise.all(
            paperInputs.map(paper => prisma.paper.create({ data: paper }))
        );

        const articleTypes = ["informatif", "job add", "product add", "sport", "politics", "global news", "show bizz"];
        const articles = [];

        for (let i = 0; i < 30; i++) {
            const eligibleUsers = createdUsers.filter(u => u.role === "admin" || u.role === "journalist");
            const user = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
            const paper = createdPapers[Math.floor(Math.random() * createdPapers.length)];

            articles.push({
                title: `Article ${i + 1}`,
                summary: `Summary ${i + 1}`,
                picture: "https://www.example.com/image.jpg",
                publishedAt: paper.date,
                articleType: articleTypes[Math.floor(Math.random() * articleTypes.length)],
                userId: user.id,
                paperId: paper.id,
            });
        }

        const createdArticles = await prisma.article.createMany({ data: articles });
        const allArticles = await prisma.article.findMany();

        for (const article of allArticles) {
            const reviewCount = Math.floor(Math.random() * 6);
            for (let i = 0; i < reviewCount; i++) {
                const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                await prisma.review.create({
                    data: {
                        title: `Review ${i + 1} for Article ${article.id}`,
                        content: `Content of Review ${i + 1}`,
                        rating: Math.floor(Math.random() * 5) + 1, 
                        userId: user.id,
                        articleId: article.id,
                    },
                });
            }
        }

        for (const article of allArticles) {
            const likeCount = Math.floor(Math.random() * (createdUsers.length + 1));
            const likedUsers = new Set<number>();

            while (likedUsers.size < likeCount) {
                const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                if (!likedUsers.has(randomUser.id)) {
                    likedUsers.add(randomUser.id);
                    await prisma.articleLike.create({
                        data: {
                            userId: randomUser.id,
                            articleId: article.id,
                            date: new Date(),
                        },
                    });
                }
            }
        }

        console.log("Seeding complete!");
    } catch (error) {
        console.error("Error in seeding:", error);
    } finally {
        await prisma.$disconnect();
    }
};

(async () => {
    await main();
})();
