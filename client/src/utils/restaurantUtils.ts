export const checkTimeWindow = (window: { open?: string; close?: string }, currentTimeInMinutes: number): { isOpen: boolean; closingSoon: boolean } => {
  if (!window.open || !window.close) return { isOpen: false, closingSoon: false };

  const parseTime = (timeStr: string) => {
    const timeMatch = /(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i.exec(timeStr.trim());
    if (!timeMatch) return 0;

    let hours = Number.parseInt(timeMatch[1], 10);
    const mins = Number.parseInt(timeMatch[2], 10);
    const period = timeMatch[3]?.toUpperCase();

    if (period) {
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    }

    return hours * 60 + mins;
  };

  const openMins = parseTime(window.open);
  let closeMins = parseTime(window.close);

  let isOpen = false;

  if (closeMins < openMins) {
    isOpen = currentTimeInMinutes >= openMins || currentTimeInMinutes <= closeMins;
  } else {
    isOpen = currentTimeInMinutes >= openMins && currentTimeInMinutes <= closeMins;
  }

  let closingSoon = false;
  if (isOpen) {
    if (closeMins < currentTimeInMinutes) closeMins += 24 * 60;
    if (closeMins - currentTimeInMinutes <= 30) closingSoon = true;
  }

  return { isOpen, closingSoon };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRestaurantStatus = (restaurant: any) => {
  if (!restaurant.operatingDays || !restaurant.mealTimings) return { text: "Open", color: "bg-green-500", isOpen: true };

  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = days[now.getDay()];

  if (!restaurant.operatingDays.includes(currentDay)) {
    return { text: "Closed", color: "bg-red-500", isOpen: false };
  }

  const currentMins = now.getHours() * 60 + now.getMinutes();
  let isOpen = false;
  let closingSoon = false;

  const timings = restaurant.mealTimings;
  const windows = [timings.breakfast, timings.lunch, timings.dinner].filter(Boolean);

  for (const window of windows) {
    const status = checkTimeWindow(window, currentMins);
    if (status.isOpen) {
      isOpen = true;
      closingSoon = status.closingSoon;
      break;
    }
  }

  if (!isOpen) return { text: "Closed", color: "bg-red-500", isOpen: false };
  if (closingSoon) return { text: "Closes in 30 mins", color: "bg-orange-500", isOpen: true };

  return { text: "Open", color: "bg-green-500", isOpen: true };
};
