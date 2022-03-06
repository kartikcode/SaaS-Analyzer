/*!

=========================================================
* Black Dashboard PRO React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

// reactstrap components
import { Table } from "reactstrap";

const SortingTable = (props) => {
  const [bodyData, setBodyData] = React.useState(props.tbody);
  const [column, setColumn] = React.useState({
    name: -1,
    order: "",
  });
  const sortTable = (key) => {
    let order = "";
    if (
      (column.name === key && column.order === "desc") ||
      column.name !== key
    ) {
      order = "asc";
      bodyData.sort((a, b) =>
        a.data[key].text > b.data[key].text
          ? 1
          : a.data[key].text < b.data[key].text
          ? -1
          : 0
      );
    } else if (column.name === key && column.order === "asc") {
      order = "desc";
      bodyData.sort((a, b) =>
        a.data[key].text > b.data[key].text
          ? -1
          : a.data[key].text < b.data[key].text
          ? 1
          : 0
      );
    }
    setBodyData(bodyData);
    setColumn({
      name: key,
      order: order,
    });
  };
  return (
    <Table className="tablesorter" responsive>
      <thead className="text-primary">
        <tr>
          {props.thead.map((prop, key) => {
            return (
              <th
                className={classnames(
                  "header",
                  {
                    headerSortDown:
                      key === column.name && column.order === "asc",
                  },
                  {
                    headerSortUp:
                      key === column.name && column.order === "desc",
                  },
                  {
                    [prop.className]: prop.className !== undefined,
                  }
                )}
                key={key}
                onClick={() => sortTable(key)}
              >
                {prop.text}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {bodyData.map((prop, key) => {
          return (
            <tr
              className={classnames({
                [prop.className]: prop.className !== undefined,
              })}
              key={key}
            >
              {prop.data.map((data, k) => {
                return (
                  <td
                    className={classnames({
                      [data.className]: data.className !== undefined,
                    })}
                    key={k}
                  >
                    {data.text}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

SortingTable.propTypes = {
  thead: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  tbody: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          className: PropTypes.string,
          text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default SortingTable;
