require('dotenv').config();
const supabase = require('./config/supabase');

async function testUpload() {
  console.log('Testing Supabase Storage upload...');
  const { data, error } = await supabase.storage
    .from('products')
    .upload('test.txt', 'Hello World', {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error('Supabase upload failed! Reason:', error.message);
  } else {
    console.log('Upload successful! Data:', data);
  }
}

testUpload();
