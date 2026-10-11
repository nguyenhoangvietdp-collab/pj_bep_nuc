import Market from "../../components/market";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Market view="meal" id={id} />;
}
