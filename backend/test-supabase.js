const supabase = require('./config/supabase');
async function test() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (!data || data.length === 0) return console.log('No products');
  const id = data[0].id;
  const { data: updated, error: updateError } = await supabase.from('products').update({ name: 'Test 2' }).eq('id', id).select();
  console.log('Update result:', updated, updateError);
}
test();
