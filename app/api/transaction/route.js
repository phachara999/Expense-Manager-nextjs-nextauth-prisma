//add transaction
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(request) {
    const session = await getServerSession(authOptions)
    const {name, amount, type} = await request.json()
    
    const amountNumber = parseFloat(amount)
    const newTransaction = await prisma.transactions.create({
        data: {
            name,
            amount : amountNumber,
            type,
            userId: session.user.id,
        },
    });

    return NextResponse.json({ ms : 'ok' });
}
export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }

    const keyword = request.nextUrl.searchParams.get('type') || "";
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);
    
    const skip = (page - 1) * limit;

    try {
        let whereClause = {
            userId: session.user.id
        };

        // ถ้า keyword ไม่ใช่ค่าว่างและไม่ใช่ "all" ให้เพิ่มเงื่อนไขการกรอง
        if (keyword && keyword.toLowerCase() !== "all") {
            whereClause.type = {
                contains: keyword
            };
        }

        const [transactions, totalCount] = await Promise.all([
            prisma.transactions.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: {
                    id: 'desc'
                },
            }),
            prisma.transactions.count({
                where: whereClause
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