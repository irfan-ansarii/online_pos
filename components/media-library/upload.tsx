import React from "react";
import { Loader2, ImagePlus } from "lucide-react";
import { useCreateFile } from "@/hooks/useFile";
import { Input } from "@/components/ui/input";

const Upload = () => {
  const { isLoading, mutate } = useCreateFile();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = e.target.files;
    const form = new FormData();

    for (const file of files) {
      form.append("files", file);
    }

    mutate(form, {
      onSuccess: (response) => console.log("success;", response),
      onError: (error) => console.log("error:", error),
    });
  };

  return (
    <div className="relative rounded-md bg-accent border-2 border-dashed h-20 mb-3">
      <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        ) : (
          <ImagePlus className="w-8 h-8" />
        )}
      </span>

      {!isLoading && (
        <Input
          type="file"
          multiple
          className="h-full file:hidden opacity-0 cursor-pointer"
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Upload;
