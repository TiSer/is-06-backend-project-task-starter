import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { PhotoCard } from "@/components/photo-card";
import { galleryPhotos } from "@/lib/data";

export default function GalleryPage() {
  return (
    <PageShell>
      <PageHeader
        title="Photo Gallery"
        description="Track day moments from DniproKart, Autodrom, and Kiev Ring."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {galleryPhotos.map((photo) => (
          <PhotoCard
            key={photo.id}
            title={photo.title}
            track={photo.track}
            date={photo.date}
            src={photo.src}
          />
        ))}
      </div>
    </PageShell>
  );
}
