
const BASE = 'http://localhost:4000/api/v1/harvests';

const run = async () => {
  try {
    const payload = {
      farmerName: 'API Test Farmer',
      cropType: 'Potato',
      quantity: 99,
      unit: 'KG',
      date: '2026-01-31',
      location: 'API Village',
    };

    const postRes = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const postJson = await postRes.json();
    console.log('POST /harvests ->', postRes.status, postJson.status, postJson.message);

    const getRes = await fetch(BASE);
    const getJson = await getRes.json();
    console.log('GET /harvests ->', getRes.status, 'records:', Array.isArray(getJson.data) ? getJson.data.length : 'N/A');
  } catch (err) {
    console.error('Test API failure:', err);
  }
};

run();
