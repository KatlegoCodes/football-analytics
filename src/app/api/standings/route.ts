import { getStandings } from "@/lib/analytics/standings";

export const GET = async () => {
  try {
    const standings = await getStandings();

    return Response.json(standings);
  } catch (error) {
    console.error("Could not get league standings");

    return Response.json({ error: "Could not get standings" }, { status: 500 });
  }
};
