import React from "react";
import { Button } from "reactstrap";
import ReactToPrint from "react-to-print";

const PrintBtn = ({ refToConvert }) => {
  return (
    <div className="container-fluid">
      <ReactToPrint
        trigger={() => <Button className="btn-sm float-right"><i className="tim-icons icon-paper"></i> </Button>}
        content={() => refToConvert.current}
        copyStyles
        />
    </div>
  );
};

export default PrintBtn;
