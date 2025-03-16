const utcDate = (dateStart: string, dateEnd: string) => {
  const startDate = new Date(dateStart);

  const start = new Date(startDate.getTime() - -8 * 60 * 60 * 1000);

  const adjustEndDate = new Date(`${dateEnd}T23:59:59.999Z`);

  const end = new Date(adjustEndDate.getTime() - -8 * 60 * 60 * 1000);

  return { start, end };
};

export default utcDate;
