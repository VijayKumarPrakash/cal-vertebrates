import axios from 'axios';
import db from './database.js';

// List of birds to fetch data for
const birdList = [
  { commonName: 'Red-tailed Hawk', scientificName: 'Buteo jamaicensis' },
  { commonName: 'Black-bellied Plover', scientificName: 'Pluvialis squatarola' },
  { commonName: 'Least Sandpiper', scientificName: 'Calidris minutilla' },
  { commonName: 'Glaucous-winged Gull', scientificName: 'Larus glaucescens' },
  { commonName: 'Great Horned Owl', scientificName: 'Bubo virginianus' },
  { commonName: 'American Robin', scientificName: 'Turdus migratorius' },
  { commonName: 'Northern Cardinal', scientificName: 'Cardinalis cardinalis' },
  { commonName: 'Blue Jay', scientificName: 'Cyanocitta cristata' },
  { commonName: 'Mallard', scientificName: 'Anas platyrhynchos' },
  { commonName: 'American Crow', scientificName: 'Corvus brachyrhynchos' }
];

// Fetch bird image from Wikipedia
async function fetchWikipediaData(scientificName) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&titles=${encodeURIComponent(scientificName)}&pithumbsize=500&exintro=true&explaintext=true&redirects=1`;
    const response = await axios.get(searchUrl);
    const pages = response.data.query.pages;
    const page = Object.values(pages)[0];

    return {
      image_url: page.thumbnail?.source || null,
      description: page.extract ? page.extract.substring(0, 500) : null
    };
  } catch (error) {
    console.error(`Error fetching Wikipedia data for ${scientificName}:`, error.message);
    return { image_url: null, description: null };
  }
}

// Fetch bird sound from Xeno-canto
async function fetchBirdSound(scientificName) {
  try {
    const searchUrl = `https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(scientificName)}&len:10-60`;
    const response = await axios.get(searchUrl);

    if (response.data.recordings && response.data.recordings.length > 0) {
      // Get the first high-quality recording
      const recording = response.data.recordings[0];
      return `https:${recording.file}`;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching bird sound for ${scientificName}:`, error.message);
    return null;
  }
}

// Get bird taxonomy and info from GBIF (Global Biodiversity Information Facility)
async function fetchGBIFData(scientificName) {
  try {
    const searchUrl = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`;
    const response = await axios.get(searchUrl);

    return {
      family: response.data.family || null,
      order: response.data.order || null,
      status: response.data.status || null
    };
  } catch (error) {
    console.error(`Error fetching GBIF data for ${scientificName}:`, error.message);
    return { family: null, order: null, status: null };
  }
}

// Hardcoded supplementary data based on UC Berkeley IB 104LF course content
const supplementaryData = {
  'Buteo jamaicensis': {
    habitat: 'Open country, woodlands, prairie groves, mountains, plains',
    size: '45-65 cm length, wingspan 110-141 cm',
    diet: 'Small mammals, birds, reptiles',
    conservation_status: 'Least Concern'
  },
  'Pluvialis squatarola': {
    habitat: 'Coastal beaches, mudflats, tidal estuaries',
    size: '27-30 cm length, wingspan 71-83 cm',
    diet: 'Marine worms, crustaceans, insects',
    conservation_status: 'Least Concern'
  },
  'Calidris minutilla': {
    habitat: 'Mudflats, shores, marshes',
    size: '13-15 cm length, wingspan 34-37 cm',
    diet: 'Insects, small crustaceans, snails',
    conservation_status: 'Least Concern'
  },
  'Larus glaucescens': {
    habitat: 'Pacific coast, harbors, beaches, garbage dumps',
    size: '50-54 cm length, wingspan 120-150 cm',
    diet: 'Fish, marine invertebrates, refuse',
    conservation_status: 'Least Concern'
  },
  'Bubo virginianus': {
    habitat: 'Forests, deserts, urban areas, open country',
    size: '46-63 cm length, wingspan 101-145 cm',
    diet: 'Mammals, birds, reptiles, amphibians',
    conservation_status: 'Least Concern'
  },
  'Turdus migratorius': {
    habitat: 'Lawns, gardens, woodlands, forests',
    size: '23-28 cm length, wingspan 31-41 cm',
    diet: 'Earthworms, insects, berries, fruits',
    conservation_status: 'Least Concern'
  },
  'Cardinalis cardinalis': {
    habitat: 'Woodlands, gardens, shrublands, swamps',
    size: '21-23 cm length, wingspan 25-31 cm',
    diet: 'Seeds, grains, fruits, insects',
    conservation_status: 'Least Concern'
  },
  'Cyanocitta cristata': {
    habitat: 'Deciduous and mixed forests, parks, residential areas',
    size: '22-30 cm length, wingspan 34-43 cm',
    diet: 'Nuts, seeds, insects, small vertebrates',
    conservation_status: 'Least Concern'
  },
  'Anas platyrhynchos': {
    habitat: 'Wetlands, ponds, lakes, rivers, parks',
    size: '50-65 cm length, wingspan 81-98 cm',
    diet: 'Aquatic plants, insects, small fish',
    conservation_status: 'Least Concern'
  },
  'Corvus brachyrhynchos': {
    habitat: 'Forests, fields, urban and suburban areas',
    size: '40-53 cm length, wingspan 85-100 cm',
    diet: 'Omnivorous - insects, seeds, fruits, carrion',
    conservation_status: 'Least Concern'
  }
};

// Main function to fetch and insert bird data
async function seedBirds() {
  console.log('Starting to fetch bird data...\n');

  for (const bird of birdList) {
    console.log(`Fetching data for ${bird.commonName} (${bird.scientificName})...`);

    try {
      // Fetch data from multiple sources
      const [wikiData, audioUrl, gbifData] = await Promise.all([
        fetchWikipediaData(bird.scientificName),
        fetchBirdSound(bird.scientificName),
        fetchGBIFData(bird.scientificName)
      ]);

      const suppData = supplementaryData[bird.scientificName] || {};

      // Prepare bird data
      const birdData = {
        common_name: bird.commonName,
        scientific_name: bird.scientificName,
        family: gbifData.family,
        order: gbifData.order,
        description: wikiData.description,
        image_url: wikiData.image_url,
        audio_url: audioUrl,
        range_map_url: `https://www.allaboutbirds.org/guide/${bird.commonName.replace(/ /g, '_')}/maps-range`,
        habitat: suppData.habitat,
        size: suppData.size,
        diet: suppData.diet,
        conservation_status: suppData.conservation_status
      };

      // Insert into database
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO birds
           (common_name, scientific_name, family, bird_order, description, image_url, audio_url, range_map_url, habitat, size, diet, conservation_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            birdData.common_name,
            birdData.scientific_name,
            birdData.family,
            birdData.order,
            birdData.description,
            birdData.image_url,
            birdData.audio_url,
            birdData.range_map_url,
            birdData.habitat,
            birdData.size,
            birdData.diet,
            birdData.conservation_status
          ],
          function(err) {
            if (err) {
              console.error(`Error inserting ${bird.commonName}:`, err);
              reject(err);
            } else {
              console.log(`✓ Successfully added ${bird.commonName} (ID: ${this.lastID})`);
              resolve();
            }
          }
        );
      });

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${bird.commonName}:`, error.message);
    }
  }

  console.log('\nBird data seeding completed!');
  process.exit(0);
}

// Run the seeding
seedBirds();
