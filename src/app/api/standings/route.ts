import { prisma } from "@/lib/db/prisma";
import { getStandings } from "@/lib/analytics/standings";

export const GET = async () => {
  try {
    const season = await prisma.season.findFirst({
      where: {
        provider: "football-data",
      },
      orderBy: {
        startYear: "desc",
      },
    });

    if (!season) {
      return Response.json({ error: "No provider-backed season found." }, { status: 404 });
    }

    const standings = await getStandings(season.id);

    return Response.json(standings);
  } catch (error) {
    console.error("Could not get league standings");

    return Response.json({ error: "Could not get standings" }, { status: 500 });
  }
};
