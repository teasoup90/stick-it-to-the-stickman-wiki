import { ImageIcon } from "lucide-react";

export function MediaPlaceholder({ label, className = "aspect-video" }: { label: string; className?: string }) {
  return <div className={`media-placeholder ${className}`}><div className="absolute inset-0 grid place-items-center"><div className="grid justify-items-center gap-3"><ImageIcon className="size-6" /><span>{label}</span></div></div></div>;
}
