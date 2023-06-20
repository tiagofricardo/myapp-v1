import { supabase } from "@/libs/supabase";

export default async function (req, res) {
  try {
    const { imagePath } = req.query;
    const index = imagePath.indexOf("ServiceImages");
    const image = imagePath.substring(
      index + "ServiceImages/".length,
      imagePath.length
    );

    const supaRes = await supabase.storage
      .from("ServiceImages")
      .remove([image]);

    return res.status(200).json(supaRes);
  } catch (error) {
    return res.status(400).json("Error on deleting associated image");
  }
}
