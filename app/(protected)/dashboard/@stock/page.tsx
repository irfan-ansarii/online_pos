import {
  getStockAdjustmentAnalytics,
  getStockAnalytics,
} from "@/actions/analytics/analytic-actions";
import StockChart from "./_components/chart";
import PiePlaceholder from "../_components/pie-placeholder";

interface StockProps {
  name: string;
  _count: number;
}

interface AdjustmentProps {
  name: string;
  _sum: number;
}

const PaymentOverviewPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;

  const { data: total } = (await getStockAnalytics()) as { data: StockProps[] };

  const { data: adjustment } = (await getStockAdjustmentAnalytics(period)) as {
    data: AdjustmentProps[];
  };

  return (
    <>
      {total.length === 0 && adjustment.length === 0 ? (
        <PiePlaceholder />
      ) : (
        <StockChart stockData={total} adjustmentData={adjustment} />
      )}
    </>
  );
};

export default PaymentOverviewPage;
