import "./App.css";
import { useContext } from "react";
import MapTestContext from "./components/MapTestContext";

function App() {
  const { map } = useContext(MapTestContext);

  // zoom in & out
  const handleZoomInClick = () => {
    const zoom = map.getView().getZoom() + 1;
    map.getView().animate({
      zoom,
      duration: 500,
    });
  };

  const handleZoomOutClick = () => {
    const zoom = map.getView().getZoom() - 1;
    map.getView().animate({
      zoom,
      duration: 500,
    });
  };

  return (
    <>
      <div
        id="map"
        style={{ position: "relative", width: "100%", height: "90vh" }}
      />
      <button onClick={handleZoomInClick}>+</button>
      <button onClick={handleZoomOutClick}>-</button>
    </>
  );
}

export default App;
