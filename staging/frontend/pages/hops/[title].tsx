import DashboardFrame from "@/components/Dashboard/DashboardFrame";

export default function HopDetail({ hopsData, hopTitle }: any) {
  return (
    <DashboardFrame title="Hop Details">
      <p>hop detail {hopsData}</p>
    </DashboardFrame>
  );
}

export async function getServerSideProps({ params }: any) {
  const results = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${params.title}`
  ).then((res) => res.json());

  console.log(results);

  return {
    props: {
      hopsData: params.title,
      hopTitle: params.title,
    },
  };
}
