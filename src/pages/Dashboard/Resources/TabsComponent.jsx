// src/components/TabsComponent.jsx
import { useState, Suspense } from "react";
// import SeriesComponent from "./SeriesComponent";
// import GalleryComponent from "./GalleryComponent";
import ProjectsComponent from "./ProjectsComponent";
import { Tab, Tabs } from "react-bootstrap";

const TabsComponent = () => {
  const [activeTab, setActiveTab] = useState("proyectos"); // 'series', 'libros', 'proyectos'

  return (
    <Tabs
      variant="pills"
      id="controlled-tab-example"
      activeKey={activeTab}
      onSelect={(k) => setActiveTab(k)}
      className="mb-3 justify-content-center"
    >
      <Tab eventKey="proyectos" title="Proyectos">
        <Suspense fallback={<div>Cargando...</div>}>
          <ProjectsComponent />
        </Suspense>
      </Tab>
      <Tab eventKey="series" title="Sesiones Digitales">
        <Suspense fallback={<div>Cargando...</div>}>
          {/* <SeriesComponent /> */}
        </Suspense>
      </Tab>
      <Tab eventKey="libros" title="Libros">
        <Suspense fallback={<div>Cargando...</div>}>
          {/* <GalleryComponent /> */}
        </Suspense>
      </Tab>
    </Tabs>
  );
};

export default TabsComponent;
