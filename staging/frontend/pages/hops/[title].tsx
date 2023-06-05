import DashboardFrame from "@/components/Dashboard/DashboardFrame";

export default function HopDetail({ hopsData, hopTitle }: any) {
  return (
    <DashboardFrame title={`${hopTitle} Details`}>
      <p>hop detail {hopsData}</p>
    </DashboardFrame>
  );
}

export async function getServerSideProps({ params }: any) {
  console.log(params.title);
  const hopTitle = 1;
  const results = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}`
  ).then((res) => res.json());

  return {
    props: {
      hopsData: params.title,
      hopTitle: params.title,
    },
  };
}
