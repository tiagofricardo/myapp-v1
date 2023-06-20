import multiparty from "multiparty";
import fs from "fs";
import { supabase } from "@/libs/supabase";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

export default async function handler(req, res) {
  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const file = files.file[0];
  const availableMimes = ["image/png", "image/jpeg"];
  const mimeType = mime.lookup(file.path);

  if (!availableMimes.includes(mimeType)) {
    return res.status(400).json("File not valid");
  }

  const rawData = fs.readFileSync(file.path);
  const filename = `${uuidv4()}-${file.originalFilename}`;

  try {
    const supaRes = await supabase.storage
      .from("ServiceImages")
      .upload(filename, rawData, {
        cacheControl: "3600",
        upsert: false,
      });
    const imageLink = `https://iuvrqbhlgqdianovamjs.supabase.co/storage/v1/object/public/ServiceImages/${supaRes.data.path}`;

    return res.status(200).json(imageLink);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
