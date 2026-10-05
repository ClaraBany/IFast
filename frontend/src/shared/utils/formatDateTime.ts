export function formatDepartureDateTime(isoString: string) {
  const date = new Date(isoString);

  const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });

  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });

  const departureTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  return {
    weekday: capitalizedWeekday,
    date: formattedDate,
    time: departureTime,
  };
}
