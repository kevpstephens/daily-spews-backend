const supabase = require("./supabaseClient");
const { v4: uuid } = require("uuid");

async function uploadAvatar(buffer, mimetype) {
  const filename = `${uuid()}`; // unique name
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filename, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("avatars")
    .getPublicUrl(filename);

  return publicUrl.publicUrl;
}

module.exports = uploadAvatar;
