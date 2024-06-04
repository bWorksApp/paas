import { useRecordContext, useGetList } from "react-admin";
import { Link } from "react-router-dom";
import { stringify } from "query-string";

const LinkBidField = (props) => {
  const record = useRecordContext(props);
  const jobId = props.record?.id || record.id;
  const { data, total, isLoading, error } = useGetList("jobbids", {
    filter: { jobId, queryType: "employer" },
  });
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p style={{ color: "red" }}>Error!</p>;
  }

  return record ? (
    <Link
      to={{
        pathname: "/plutusTxs",
        search: stringify({
          filter: JSON.stringify({ plutusScriptId: record.id }),
        }),
      }}
    >
      {total}
    </Link>
  ) : null;
};

LinkBidField.defaultProps = { label: "Contract TXs" };

export default LinkBidField;
