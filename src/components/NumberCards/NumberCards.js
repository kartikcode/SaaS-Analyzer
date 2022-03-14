import React from "react";
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from "reactstrap";

const NumberCard = ({ label, mainValue, byLine, isVisible }) => {
  if (!isVisible) return <></>;
  return (
    <>
      <Card className="card-stats">
        <CardBody>
          <Row className="align-items-center">
            <Col xs="7">
              <div>
                <p className="h4 text-white-50">{label}</p>
              </div>
            </Col>
            <Col xs="5">
              <div className="numbers">
                <CardTitle tag="h3">{mainValue}</CardTitle>
              </div>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <hr />
          <div className="stats">
            <i
              className="tim-icons icon-bulb-63"
            />
            {byLine}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default NumberCard;
