require('dotenv').config();
const supabase = require('./config/supabase');

async function fixImages() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products. Fixing image URLs...`);
  
  for (const product of products) {
    if (product.image && product.image.includes('localhost:5000')) {
      // Replace localhost:5000 with the new vercel backend URL
      // Make sure the user changes 'YOUR-BACKEND-URL' to their actual URL!
      const newImage = product.image.replace('http://localhost:5000', 'https://ecommerse-store-backend.vercel.app');
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ image: newImage })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`Failed to update ${product.name}:`, updateError);
      } else {
        console.log(`Updated: ${product.name}`);
      }
    }
  }
  
  console.log('Finished updating image URLs!');
}

fixImages();
