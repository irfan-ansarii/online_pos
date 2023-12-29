import React from "react";
import { mutate } from "swr";
import { Loader2, ImagePlus } from "lucide-react";
import { createFiles } from "@/actions/file-actions";
import { Input } from "@/components/ui/input";

const Upload = () => {
  const [loading, setLoading] = React.useState(false);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = e.target.files;
    const form = new FormData();

    for (const file of files) {
      form.append("files", file);
    }

    try {
      await createFiles(form);
      console.log("success");
      mutate("/files");
    } catch (error: any) {
      console.log("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-md bg-background transition duration-300 border-2 border-dashed h-20 hover:bg-accent flex-0">
      <span className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : (
          <>
            <ImagePlus className="w-8 h-8" />
            Upload
          </>
        )}
      </span>

      {!loading && (
        <Input
          type="file"
          multiple
          className="h-full file:hidden opacity-0 inset-0 cursor-pointer"
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Upload;
