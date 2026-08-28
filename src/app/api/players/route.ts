import { prisma } from "@/lib/db/prisma";

export const GET = async () => {
  try {
    const players = await prisma.player.findMany({
      include: {
        team: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return Response.json(players);
  } catch (error) {
    console.error("Failed to load players");

    return Response.json({ error: "Failed to load players" }, { status: 500 });
  }
};
