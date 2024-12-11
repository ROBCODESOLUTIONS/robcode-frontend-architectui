import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { fetchContents } from "../../../services/ContentService";
import { useAuth } from "../../../context/AuthContext";
import { Animated } from "react-animated-css";

const SeriesComponent = () => {
  const { authToken } = useAuth();
  const [contents, setContents] = useState({});
  // const [selectedContent, setSelectedContent] = useState(null);
  // const [subSections, setSubSections] = useState([]);

  useEffect(() => {
    fetchContents(authToken.access_token)
      .then((data) => setContents(data))
      .catch((error) => console.error("Error al cargar los contenidos", error));
  }, [authToken]);

  const [selectedContent, setSelectedContent] = useState(null);
  const elements = useRef([]);

  const handleContentClick = (index) => {
    setSelectedContent(index);
  };

  return (
    <div className="row">
      <div className="col-2">
        {/* Estructura de navegación de Bootstrap */}
        <div className="flex-column align-items-stretch pe-4 border-end">
          <nav className="nav nav-pills flex-row h-75" style={{ overflowY: "auto", maxHeight: "500px" }}>
            {Object.keys(contents).map((content, index) => (
              <a
                href="#"
                key={index}
                className={
                  "nav-link " +
                  (selectedContent === index
                    ? "active"
                    : "text-secondary text-opacity-50")
                }
                onClick={() => handleContentClick(index)}
                data-id={`content-${index}`}
              >
                {contents[content].title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="col-8">
        <div
          data-bs-spy="scroll"
          data-bs-target="#navbar-example3"
          data-bs-smooth-scroll="true"
          className="scrollspy-example-2"
          tabIndex="0"
        >
          {Object.keys(contents).map((content, index) => (
            <Animated
              animationIn="bounceIn"
              animationOut="fadeOut"
              isVisible={true}
              key={index}
              id={"content-" + index}
              ref={elements}
              className={`${selectedContent === index ? "" : "d-none"}`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: contents[content].body ?? "",
                }}
              />
            </Animated>
          ))}
        </div>
      </div>
    </div>
  );
};

SeriesComponent.propTypes = {
  content: PropTypes.object.isRequired,
};

export default SeriesComponent;
