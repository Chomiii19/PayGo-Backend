const getLastDayOfMonth = (date: string) => {
  const dt = new Date(date);
  return new Date(dt.getFullYear(), dt.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]
    .slice(-2);
};

export default getLastDayOfMonth;
