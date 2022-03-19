import React from "react";
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";

const NumberCard = ({ label, mainValue, byLine, isVisible, sentiment }) => {
  let borderColor = "border-dark";
  if (!isVisible) return <></>;
  if (sentiment === "good") {
    borderColor = "border-success";
  } else if (sentiment === "bad") {
    borderColor = "border-danger";
  }
  return (
    <>
      <Card className={"card-stats border rounded " + borderColor}>
        <CardBody>
          <Row className="align-items-center">
            <Col xs="6">
              <div>
                <p className="h5 text-white-50">{label}</p>
              </div>
            </Col>
            <Col xs="6">
              <div className="numbers">
                <CardTitle tag="h3">{mainValue}</CardTitle>
              </div>
            </Col>
          </Row>
        </CardBody>
        {byLine !== "" && (
          <CardFooter>
            <hr />
            <div className="stats">
              <i className="tim-icons icon-bulb-63" />
              {byLine}
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default NumberCard;
