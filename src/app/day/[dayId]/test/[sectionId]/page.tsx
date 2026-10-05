import { TestRunner } from '@/components/TestRunner';

export default async function TestPage(props: PageProps<'/day/[dayId]/test/[sectionId]'>) {
  const { dayId, sectionId } = await props.params;
  const { mode } = await props.searchParams;
  const review = mode === 'review';
  // key theo chế độ để chuyển làm bài ↔ làm lại câu sai luôn tạo phiên mới
  return <TestRunner key={`${sectionId}-${review}`} dayId={Number(dayId)} sectionId={sectionId} review={review} />;
}
