import AudienceHeroSkeleton, { audienceMetadata } from '@/components/site/AudienceHeroSkeleton';

export const metadata = audienceMetadata('For Individuals');

export default function IndividualPage() {
  return (
    <AudienceHeroSkeleton
      eyebrow="For individuals"
      headline="200,000 points, and no idea what they're worth."
      body="You earned them. We find the seat they can actually book — searched by hand, with proof of the exact point cost, so you finally use them for something worth flying."
    />
  );
}
