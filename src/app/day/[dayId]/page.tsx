import { DayView } from '@/components/DayView';

export default async function DayPage(props: PageProps<'/day/[dayId]'>) {
  const { dayId } = await props.params;
  return <DayView dayId={Number(dayId)} />;
}
