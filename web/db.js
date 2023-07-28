import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zddababgomdjevjhgcyg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZGFiYWJnb21kamV2amhnY3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4NzY2MzIsImV4cCI6MjAwNTQ1MjYzMn0.JTiwALcWS1gcBZXY9oaYHAh_hfOJGMNWP8ENve7ZzIM";
const supabase = createClient(supabaseUrl, supabaseKey);

async function createStoreEntry(id, temp) {
  console.log("Creating store entry");
  console.log(id);
  const { data, error } = await supabase
    .from("stores")
    .insert([{ id: id }], { returning: "minimal" });
  if (error) {
    console.log(error);
  }
  return data;
}

async function createProductEntry(storeId, productJson, productEmbedding) {
  console.log("Creating product entry");

  const { data, error } = await supabase
    .from("products")
    .insert([
      { embedding: productEmbedding, product: productJson, store_id: storeId },
    ])
    .select();
  if (error) {
    console.log(error);
  }
  return data;
}

async function getSimilarProducts(query_embeddings, storeId) {
  const { data: products } = await supabase.rpc("match_products", {
    query_embedding: query_embeddings, // Pass the embedding you want to compare
    match_threshold: 0.78, // Choose an appropriate threshold for your data
    match_count: 1, // Choose the number of matches
  });
  console.log("Getting similar products");
  return JSON.stringify(products, null, 2);
}

export { createStoreEntry, createProductEntry, getSimilarProducts };
