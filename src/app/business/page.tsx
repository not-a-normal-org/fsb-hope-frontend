import AudienceHeroSkeleton, { audienceMetadata } from '@/components/site/AudienceHeroSkeleton';

export const metadata = audienceMetadata('For Business');

export default function BusinessPage() {
  return (
    <AudienceHeroSkeleton
      eyebrow="For business"
      headline="Turn company travel spend into premium seats."
      body="For teams that fly often. We run account-level award searches by hand across 30+ programs and deliver proof — so your travel budget reaches further, reliably."
    />
  );
}
