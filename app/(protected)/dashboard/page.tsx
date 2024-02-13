import React from "react";
import Link from "next/link";
import { format, sub, startOfYear, endOfYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

const generatePeriod = (
  label: string,
  startDate: Date,
  endDate = new Date()
) => ({
  label,
  href: `${formatDate(startDate)}:${formatDate(endDate)}`,
});

const periods = [
  generatePeriod("Today", new Date()),
  generatePeriod(
    "Yesterday",
    sub(new Date(), { days: 1 }),
    sub(new Date(), { days: 1 })
  ),
  generatePeriod("Last 7 Days", sub(new Date(), { days: 7 })),
  generatePeriod("Last 30 Days", sub(new Date(), { days: 30 })),
  generatePeriod("Last 90 Days", sub(new Date(), { days: 90 })),
  generatePeriod(
    "Last year",
    startOfYear(sub(new Date(), { years: 1 })),
    endOfYear(sub(new Date(), { years: 1 }))
  ),
];

interface Props {
  searchParams: {
    period: string;
  };
}
const DashboardPage = async ({ searchParams }: Props) => {
  const active = periods.find((p) => p.href === searchParams.period);

  if (!searchParams.period) {
    redirect(`/dashboard?period=${periods[2].href}`);
  }

  return (
    <div className="grid grid-cols-2 w-full col-span-12">
      <div className="text-lg font-semibold">Dashboard</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="ml-auto text-muted-foreground w-44 justify-start flex"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {active?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          {periods.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <Link href={`/dashboard?period=${item.href}`}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DashboardPage;
