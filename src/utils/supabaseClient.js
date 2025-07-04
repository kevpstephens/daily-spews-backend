const { createClient } = require("@supabase/supabase-js");
const logger = require("./logger");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Upload function
const uploadUserAvatar = async (path, file) => {
  try {
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      return { error };
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    return { publicUrl: publicUrlData.publicUrl };
  } catch (err) {
    logger.error("Supabase upload error:", err);
    return { error: err };
  }
};

module.exports = {
  supabase,
  uploadUserAvatar,
};
