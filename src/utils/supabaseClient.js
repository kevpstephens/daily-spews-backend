/* ======================================================= */
// Supabase Client Configuration and File Upload Utilities

// Handles file uploads to Supabase storage, primarily for user avatars.
// Uses service role key for admin-level operations.
/* ======================================================= */

const { createClient } = require("@supabase/supabase-js");
const logger = require("./logger");

// Initialise Supabase client with service role for storage operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 *! UploadUserAvatar
 * Uploads a user avatar image to Supabase storage
 * @param {string} path - Storage path for the file (e.g., "user123/avatar.jpg")
 * @param {Object} file - Multer file object containing buffer and mimetype
 * @param {Buffer} file.buffer - File data as buffer
 * @param {string} file.mimetype - MIME type of the file (e.g., "image/jpeg")
 * @returns {Object} Object containing either publicUrl or error
 */

const uploadUserAvatar = async (path, file) => {
  try {
    // Upload file to Supabase storage bucket
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true, // Overwrite existing file with same path
      });

    if (error) {
      logger.error("Supabase storage upload failed", {
        path,
        error: error.message,
      });
      return { error };
    }

    // Generate public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    logger.info("Avatar upload successful", {
      path,
      publicUrl: publicUrlData.publicUrl,
    });

    return { publicUrl: publicUrlData.publicUrl };
  } catch (err) {
    logger.error("Unexpected error during avatar upload", {
      path,
      error: err.message,
      stack: err.stack,
    });
    return { error: err };
  }
};

module.exports = {
  supabase,
  uploadUserAvatar,
};
