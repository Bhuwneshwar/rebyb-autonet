// utils/formatDate.js
import { format } from "date-fns";

export const formatDate = (dateString?: Date) => {
  try {
    if (dateString === undefined) {
      return "undefined";
    }
    const date = new Date(dateString);
    return format(date, "dd-MMM-yyyy");
  } catch (error) {
    return dateString?.toString();
  }
};

// utils/formatDate.js
export const formatDateName = (dateString: Date) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
