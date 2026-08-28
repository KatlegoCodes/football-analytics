import { prisma } from "@/lib/db/prisma";

export const GET = async () => {
  try {
    const teams = await prisma.team.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return Response.json(teams);
  } catch (error) {
    console.error("Failed to fetch teams:", error);

    return Response.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
};
