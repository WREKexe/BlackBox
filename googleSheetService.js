
const API_URL = "https://script.google.com/macros/s/AKfycbz2RRwH_zapvtx8yFHJhNYukVgnrAVbwDqYtR7E7HLc1uhjlIke3Ey8h365uetRkk2r/exec";

export async function fetchEntries() {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
}

export async function addEntry(type, name, tags) {
  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ Type: type, Name: name, Tags: tags }),
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Add failed:", err);
  }
}
