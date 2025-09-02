"use client";

import { CldUploadWidget } from "next-cloudinary";

type UploadImageButtonProps = {
  buttonLabel?: string | React.ReactNode;
  onComplete?: (url: string) => void; // callback
  className?: string;
};

export default function UploadImageButton({
  buttonLabel = "Upload Image",
  onComplete,
  className,
}: UploadImageButtonProps) {
  return (
    <CldUploadWidget
      uploadPreset="profile-picture-preset"
      onSuccess={(result) => {
        const url = (result?.info as any).secure_url;
        if (url && onComplete) onComplete(url);
      }}
    >
      {({ open }) => (
        <button type="button" onClick={() => open()} className={`cursor-pointer ${className}`}>
          {buttonLabel}
        </button>
      )}
    </CldUploadWidget>
  );
}
