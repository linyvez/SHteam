const fs = require('fs');
const path = require('path');

const API_URL = 'http://catalog-service:3000/api/catalog/shaders';

async function seed() {
  const presets = JSON.parse(fs.readFileSync('./presets.json', 'utf8'));

  for (const shader of presets) {
    const formData = new FormData();
    formData.append('title', shader.title);
    formData.append('description', shader.description);
    formData.append('price', shader.price.toString());
    formData.append('vertexShader', shader.vertexShader);
    formData.append('fragmentShader', shader.fragmentShader);
    formData.append('authorId', '00000000-0000-0000-0000-000000000000');

    const imageBuffer = fs.readFileSync(
      path.join(__dirname, shader.thumbnailFile),
    );
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('thumbnail', blob, shader.thumbnailFile);

    let success = false;
    let attempts = 0;
    while (!success && attempts < 10) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          console.log(`Seeded: ${shader.title}`);
          success = true;
        } else {
          console.error(`Server Error: ${shader.title}`, await response.text());
          break;
        }
      } catch (e) {
        attempts++;
        console.log(`Waiting for catalog-service... (Attempt ${attempts}/10)`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}

seed();
