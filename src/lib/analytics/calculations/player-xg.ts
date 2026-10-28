type PlayerShotInput = {
  type: string;
  shotXg: number | null;
};

export const calculatePlayerXg = (events: PlayerShotInput[]) => {
  const totalXg = events.reduce((total, event) => {
    if (event.type !== "Shot" || event.shotXg === null) {
      return total;
    }

    return total + event.shotXg;
  }, 0);

  return Number(totalXg.toFixed(2));
};
