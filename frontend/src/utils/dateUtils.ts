export const getDuration = (startTime: string, endTime: string) => {
  const start = new Date(`01/01/2000 ${startTime}`).getTime();
  const end = new Date(`01/01/2000 ${endTime}`).getTime();
  const diff = end - start;

  // Convert milliseconds to hours and minutes
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

export const getFormattedDate = (date: Date | string) => {
  if (typeof date === "string")
    date = new Date(date);

  return date.toLocaleDateString('en-UK', { month: 'long', day: 'numeric', year: 'numeric' });
}

const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoDateFormat.test(value);
}

export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];

    if (isIsoDateString(value)) {
      body[key] = new Date(value);
    }
    else if (typeof value === "object")
      handleDates(value);
  }
}