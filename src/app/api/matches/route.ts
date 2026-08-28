import { prisma } from "@/lib/db/prisma";

export const GET = async () => {
  try {
    const matches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(matches);
  } catch (error) {
    console.error("Failed to load teams");

    return Response.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
};
