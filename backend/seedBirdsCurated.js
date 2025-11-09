import db from './database.js';

// Curated bird data with reliable sources
const curatedBirds = [
  {
    common_name: 'Red-tailed Hawk',
    scientific_name: 'Buteo jamaicensis',
    family: 'Accipitridae',
    order: 'Accipitriformes',
    description: 'The Red-tailed Hawk is a large bird of prey that is one of the most common hawks in North America. Adults have a distinctive rust-red tail, dark brown upperparts, and pale underparts with a dark belly band. They are powerful hunters with excellent vision.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Red-tailed_hawk_-_natures_pics.jpg/1200px-Red-tailed_hawk_-_natures_pics.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC413729-190709_1162_RT_Hawk.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/Red-tailed_Hawk/maps-range',
    habitat: 'Open country, woodlands, prairie groves, mountains, plains',
    size: '45-65 cm length, wingspan 110-141 cm',
    diet: 'Small mammals, birds, reptiles',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'Black-bellied Plover',
    scientific_name: 'Pluvialis squatarola',
    family: 'Charadriidae',
    order: 'Charadriiformes',
    description: 'The Black-bellied Plover is a medium-sized plover breeding in Arctic regions and migrating long distances. In breeding plumage, they have a striking black face and belly, with a white cap. Non-breeding birds are gray and white.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Black-bellied-plover-breeding.jpg/1200px-Black-bellied-plover-breeding.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC629229-BB%20Plover%20TUOLUMNE%20190721.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/Black-bellied_Plover/maps-range',
    habitat: 'Coastal beaches, mudflats, tidal estuaries',
    size: '27-30 cm length, wingspan 71-83 cm',
    diet: 'Marine worms, crustaceans, insects',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'Least Sandpiper',
    scientific_name: 'Calidris minutilla',
    family: 'Scolopacidae',
    order: 'Charadriiformes',
    description: 'The Least Sandpiper is the smallest shorebird in the world. They have yellowish legs, brown upperparts, and a streaked breast. They are often found feeding at the edges of mudflats and shallow pools.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Least_Sandpiper_%2835881652056%29.jpg/1200px-Least_Sandpiper_%2835881652056%29.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC413730-190721_1306_Le_Sandpiper.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/Least_Sandpiper/maps-range',
    habitat: 'Mudflats, shores, marshes',
    size: '13-15 cm length, wingspan 34-37 cm',
    diet: 'Insects, small crustaceans, snails',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'Glaucous-winged Gull',
    scientific_name: 'Larus glaucescens',
    family: 'Laridae',
    order: 'Charadriiformes',
    description: 'The Glaucous-winged Gull is a large white-headed gull found along the Pacific coast. Adults have pale gray wings and back, with pink legs. They are opportunistic feeders and adaptable to urban environments.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Larus_glaucescens_-Sitka%2C_Alaska%2C_USA-8.jpg/1200px-Larus_glaucescens_-Sitka%2C_Alaska%2C_USA-8.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC629230-Glaucous-winged%20Gull%20190721.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/Glaucous-winged_Gull/maps-range',
    habitat: 'Pacific coast, harbors, beaches, garbage dumps',
    size: '50-54 cm length, wingspan 120-150 cm',
    diet: 'Fish, marine invertebrates, refuse',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'Great Horned Owl',
    scientific_name: 'Bubo virginianus',
    family: 'Strigidae',
    order: 'Strigiformes',
    description: 'The Great Horned Owl is a large, powerful owl with distinctive ear tufts. They have mottled brown plumage, yellow eyes, and a white throat patch. They are skilled nocturnal hunters and highly adaptable.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Bubo_virginianus_06.jpg/1200px-Bubo_virginianus_06.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC567059-Great_Horned_Owl_0320.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/Great_Horned_Owl/maps-range',
    habitat: 'Forests, deserts, urban areas, open country',
    size: '46-63 cm length, wingspan 101-145 cm',
    diet: 'Mammals, birds, reptiles, amphibians',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'American Robin',
    scientific_name: 'Turdus migratorius',
    family: 'Turdidae',
    order: 'Passeriformes',
    description: 'The American Robin is a familiar migratory songbird with a reddish-orange breast, gray-brown back, and cheerful song. They are often seen hopping on lawns searching for earthworms.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Turdus-migratorius-002.jpg/1200px-Turdus-migratorius-002.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC599121-AmRobin.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/American_Robin/maps-range',
    habitat: 'Lawns, gardens, woodlands, forests',
    size: '23-28 cm length, wingspan 31-41 cm',
    diet: 'Earthworms, insects, berries, fruits',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'Northern Cardinal',
    scientific_name: 'Cardinalis cardinalis',
    family: 'Cardinalidae',
    order: 'Passeriformes',
    description: 'The Northern Cardinal is a brilliant red songbird with a distinctive crest and black face mask in males. Females are tan with red accents. Their clear whistled songs are a familiar sound in many backyards.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Cardinal.jpg/1200px-Cardinal.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC599122-NorthCard.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/Northern_Cardinal/maps-range',
    habitat: 'Woodlands, gardens, shrublands, swamps',
    size: '21-23 cm length, wingspan 25-31 cm',
    diet: 'Seeds, grains, fruits, insects',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'Blue Jay',
    scientific_name: 'Cyanocitta cristata',
    family: 'Corvidae',
    order: 'Passeriformes',
    description: 'The Blue Jay is an intelligent and adaptable bird with bright blue upperparts, white underparts, and a distinctive blue crest. They are known for their loud calls and ability to mimic hawk sounds.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Blue_jay_in_PP_%2830960%29.jpg/1200px-Blue_jay_in_PP_%2830960%29.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC599123-BlueJay.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/Blue_Jay/maps-range',
    habitat: 'Deciduous and mixed forests, parks, residential areas',
    size: '22-30 cm length, wingspan 34-43 cm',
    diet: 'Nuts, seeds, insects, small vertebrates',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'Mallard',
    scientific_name: 'Anas platyrhynchos',
    family: 'Anatidae',
    order: 'Anseriformes',
    description: 'The Mallard is the most abundant and widespread duck in the world. Males have an iridescent green head, white neck ring, and chestnut breast. Females are mottled brown. They are the ancestor of most domestic ducks.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg/1200px-Anas_platyrhynchos_male_female_quadrat.jpg',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC599124-Mallard.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/Mallard/maps-range',
    habitat: 'Wetlands, ponds, lakes, rivers, parks',
    size: '50-65 cm length, wingspan 81-98 cm',
    diet: 'Aquatic plants, insects, small fish',
    conservation_status: 'Least Concern'
  },
  {
    common_name: 'American Crow',
    scientific_name: 'Corvus brachyrhynchos',
    family: 'Corvidae',
    order: 'Passeriformes',
    description: 'The American Crow is a highly intelligent, all-black bird known for problem-solving abilities and complex social behavior. They have a distinctive caw call and are common in a variety of habitats.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Corvus_brachyrhynchos_30196.JPG/1200px-Corvus_brachyrhynchos_30196.JPG',
    audio_url: 'https://www.xeno-canto.org/sounds/uploaded/ZNCDXTUOFL/XC599125-AmCrow.mp3',
    range_map_url: 'https://www.allaboutbirds.org/guide/American_Crow/maps-range',
    habitat: 'Forests, fields, urban and suburban areas',
    size: '40-53 cm length, wingspan 85-100 cm',
    diet: 'Omnivorous - insects, seeds, fruits, carrion',
    conservation_status: 'Least Concern'
  }
];

// Clear existing birds and insert curated data
async function seedCuratedBirds() {
  console.log('Clearing existing bird data...\n');

  await new Promise((resolve, reject) => {
    db.run('DELETE FROM birds', (err) => {
      if (err) {
        console.error('Error clearing birds:', err);
        reject(err);
      } else {
        console.log('Existing bird data cleared.\n');
        resolve();
      }
    });
  });

  console.log('Inserting curated bird data...\n');

  for (const bird of curatedBirds) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO birds
         (common_name, scientific_name, family, bird_order, description, image_url, audio_url, range_map_url, habitat, size, diet, conservation_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bird.common_name,
          bird.scientific_name,
          bird.family,
          bird.order,
          bird.description,
          bird.image_url,
          bird.audio_url,
          bird.range_map_url,
          bird.habitat,
          bird.size,
          bird.diet,
          bird.conservation_status
        ],
        function(err) {
          if (err) {
            console.error(`Error inserting ${bird.common_name}:`, err);
            reject(err);
          } else {
            console.log(`✓ Successfully added ${bird.common_name} (ID: ${this.lastID})`);
            resolve();
          }
        }
      );
    });
  }

  console.log('\n✅ Curated bird data seeding completed!');
  console.log(`Total birds added: ${curatedBirds.length}`);
  process.exit(0);
}

// Run the seeding
seedCuratedBirds();
