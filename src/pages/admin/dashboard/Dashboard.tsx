import { useCallback, useEffect, useState } from "react";
import {
  View,
  Grid,
  Flex,
  Card,
  Placeholder,
  useTheme,
} from "@aws-amplify/ui-react";
import { getExamResult } from "@/api/admin/api-result/get-result.api";
import { removeLoading, showLoading } from "@/services/loading";
import ExamSources from "./ExamSources";
import ExamSummary from "./ExamSummary";

interface ScoreRange {
  label: string;
  min: number;
  max: number;
}

interface ExamResult {
  part_number: string;
  students: { submitted_at: string; score: number }[];
}

const scoreRanges: ScoreRange[] = [
  { label: "0-450", min: 0, max: 450 },
  { label: "451-600", min: 451, max: 600 },
  { label: "601-800", min: 601, max: 800 },
  { label: "801-990", min: 801, max: 990 },
];

type ChartData = {
  barChartData: { name: string; data: number[] }[];
  trafficSourceData: number[];
  labels: string[];
  dates: string[];
};

const processChartData = (examResults: ExamResult[]): ChartData => {
  const dateMap: Record<string, Record<string, number>> = {};
  const scoreDistribution: Record<string, number> = {};

  examResults.forEach(({ students }) => {
    students.forEach(({ submitted_at, score }) => {
      const date = submitted_at.split("T")[0];
      if (!dateMap[date]) {
        dateMap[date] = {
          "0-450": 0,
          "455-600": 0,
          "605-800": 0,
          "805-990": 0,
        };
      }

      scoreRanges.forEach(({ label, min, max }) => {
        if (score >= min && score <= max) {
          dateMap[date][label] += 1;
          scoreDistribution[label] = (scoreDistribution[label] || 0) + 1;
        }
      });
    });
  });

  const barChartData = scoreRanges.map(({ label }) => ({
    name: label,
    data: Object.values(dateMap).map((entry) => entry[label]),
  }));

  const trafficSourceData = Object.values(scoreDistribution);
  const labels = Object.keys(scoreDistribution);

  return {
    barChartData,
    trafficSourceData,
    labels,
    dates: Object.keys(dateMap),
  };
};

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState<
    { name: string; data: number[] }[] | null
  >(null);
  const [trafficSourceData, setTrafficSourceData] = useState<number[] | null>(
    null
  );
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const { tokens } = useTheme();

  const getExamResults = useCallback(() => {
    showLoading();
    getExamResult().subscribe({
      next: (res) => {
        const examResults = res.data;
        if (!examResults) return;

        const { barChartData, trafficSourceData, dates } =
          processChartData(examResults);
        setBarChartData(barChartData);
        setTrafficSourceData(trafficSourceData);
        setChartLabels(dates);
        removeLoading();
      },
      error: removeLoading,
    });
  }, []);

  useEffect(() => {
    getExamResults();
  }, [getExamResults]);

  return (
    <>
      <div>
        <h2 className="text-[24px] font-extrabold">Báo cáo</h2>
      </div>
      <View borderRadius="6px" maxWidth="100%" padding="0rem" minHeight="100vh">
        <Grid
          templateColumns={{ base: "1fr", large: "1fr 1fr 1fr" }}
          gap={tokens.space.xl}
        >
          <View columnSpan={[1, 1, 1, 2]} rowSpan={{ base: 3, large: 4 }}>
            <Card borderRadius="15px">
              <div className="card-title">Tổng quan điểm thi</div>
              <div className="chart-wrap">
                {barChartData ? (
                  <ExamSummary
                    data={barChartData}
                    type="bar"
                    labels={chartLabels}
                  />
                ) : (
                  <Flex direction="column" minHeight="285px">
                    <Placeholder size="small" />
                    <Placeholder size="small" />
                  </Flex>
                )}
              </div>
            </Card>
          </View>
          <View rowSpan={{ base: 1, large: 4 }}>
            <Card height="100%" borderRadius="15px">
              <div className="card-title">Thống kê điểm thi</div>
              <div className="chart-wrap">
                {trafficSourceData ? (
                  <ExamSources
                    data={trafficSourceData}
                    type="donut"
                    labels={scoreRanges.map((r) => r.label)}
                  />
                ) : (
                  <Flex direction="column" minHeight="285px">
                    <Placeholder size="small" />
                    <Placeholder size="small" />
                  </Flex>
                )}
              </div>
            </Card>
          </View>
        </Grid>
      </View>
    </>
  );
};

export default Dashboard;
