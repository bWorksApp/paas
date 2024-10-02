import { useRecordContext, useGetList } from "react-admin";
import { Link } from "react-router-dom";
import { stringify } from "query-string";

const LinkBidField = (props) => {
  const total = props.total;

  return total ? (
    <Link
      to={{
        pathname: "/plutusTxs",
        search: stringify({
          filter: JSON.stringify({}),
        }),
      }}
    >
      {total}
    </Link>
  ) : null;
};

LinkBidField.defaultProps = { label: "Contract TXs" };

export default LinkBidField;
