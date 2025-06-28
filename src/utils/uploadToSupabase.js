const { supabase } = require("./supabaseClient");
const { v4: uuid } = require("uuid");

async function uploadToSupabase(file, bucket = "article-images") {
  const filename = `${uuid()}`;
  const { buffer, mimetype } = file;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return publicUrl.publicUrl;
}

module.exports = uploadToSupabase;
