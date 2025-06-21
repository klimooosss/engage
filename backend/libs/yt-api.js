export async function getSubscriberCountByUsername(username, apiKey) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=${username}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    console.error("No items in API response:", data);
     throw new Error("No channel found — check username or API key.");
  }

  const count = data.items[0].statistics.subscriberCount;
  return count;
}

