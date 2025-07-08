/* ======================================================= */
// Generic Supabase File Upload Utility

// Handles general file uploads to Supabase storage buckets.
// Generates unique filenames using UUIDs to prevent conflicts.
/* ======================================================= */

import { v4 as uuid } from "uuid";
import { supabase } from "./supabaseClient.js";

/**
 *! UploadToSupabase
 * Uploads files to Supabase storage with auto-generated unique filenames
 * @param {Object} file - File object containing buffer and mimetype
 * @param {Buffer} file.buffer - File data as buffer
 * @param {string} file.mimetype - MIME type of the file (e.g., "image/jpeg", "image/png")
 * @param {string} bucket - Supabase storage bucket name (defaults to "article-images")
 * @returns {string} Public URL of the uploaded file
 * @throws {Error} Throws Supabase upload error if upload fails
 */
async function uploadToSupabase(
  { buffer, mimetype },
  bucket = "article-images",
) {
  // Generate unique filename using UUID to prevent naming conflicts
  const filename = `${uuid()}`;

  // Upload file to specified Supabase storage bucket
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: mimetype,
      upsert: false, // Don't overwrite - UUIDs should be unique anyway
    });

  if (uploadError) throw uploadError;

  // Generate and return public URL for the uploaded file
  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return publicUrl.publicUrl;
}

export default uploadToSupabase;
