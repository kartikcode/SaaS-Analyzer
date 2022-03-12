import React from "react";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import { Line, Bar } from "react-chartjs-2";

const ChartCard = ({ type, label, mainValue, chartObject, isVisible }) => {
  if(!isVisible) return (<></>);
  return (
    <>
      <Card className="card-chart">
        <CardHeader>
          <h5 className="card-category">{label}</h5>
          <CardTitle tag="h3">
            <i className="tim-icons icon-send text-info" /> {mainValue}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="chart-area">
            {type === "line" ? (
              <Line data={chartObject.data} options={chartObject.options} />
            ) : (
              <Bar data={chartObject.data} options={chartObject.options} />
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ChartCard;
