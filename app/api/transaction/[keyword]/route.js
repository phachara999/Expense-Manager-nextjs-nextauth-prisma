import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }
    const keyword = request.nextUrl.searchParams.get('keyword') || "all";
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);
    
    const skip = (page - 1) * limit;

    try {
        const [transactions, totalCount] = await Promise.all([
            prisma.transactions.findMany({
                where: {
                    type: {
                        contains: keyword
                    },
                    userId: session.user.id
                },
                skip,
                take: limit,
                orderBy: {
                    id: 'desc'
                },
            }),
            prisma.transactions.count({
                where: {
                    type: {
                        contains: keyword
                    },
                    userId: session.user.id
                }
            }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            status: 'ok',
            data: transactions,
            meta: {
                currentPage: page,
                totalPages,
                totalCount,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ status: 'error', message: 'Failed to fetch transactions' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}