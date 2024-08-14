function extractDomain(url: string): string {
  // Create an anchor element to use the browser's URL parsing capability
  const anchor = document.createElement("a");
  anchor.href = url;

  // Extract the hostname from the anchor element
  return anchor.hostname;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
export { extractDomain, formatDate };
