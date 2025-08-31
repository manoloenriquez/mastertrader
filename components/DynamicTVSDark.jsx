import dynamic from "next/dynamic";

const MyChart = dynamic(() => import("./TradingChartDark"), { ssr: false });

export default function DynamicTVSDark() {
  return (
    <div className="main-chart flex-grow-1">
      <MyChart />
    </div>
  );
}
