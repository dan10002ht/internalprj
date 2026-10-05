import { VocabStudy } from '@/components/VocabStudy';

export default async function VocabPage(props: PageProps<'/day/[dayId]/vocab'>) {
  const { dayId } = await props.params;
  return <VocabStudy dayId={Number(dayId)} />;
}
