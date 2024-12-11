import PropTypes from "prop-types";

const ResourcesRow = ({ value }) => {
  return (
    value && (
      <a href={value} target="_blank" rel="noreferrer" className="btn btn-info">
        Recurso
      </a>
    )
  );
};

ResourcesRow.propTypes = {
  value: PropTypes.string.isRequired,
};

export default ResourcesRow;
