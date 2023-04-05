import React, { useState, useEffect } from "react";
import MapContext from "./MapTestContext";
import "ol/ol.css";
import { Map as OlMap, View } from "ol";
import { defaults as defaultControls, FullScreen } from "ol/control";
import { fromLonLat, get as getProjection } from "ol/proj";
import { Tile as TileLayer } from "ol/layer";
import { TileWMS } from "ol/source";
import OSM from "ol/source/OSM.js";
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from "ol/interaction";
// Vector
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Style from "ol/style/Style.js";
import Fill from "ol/style/Fill.js";
import GeoJSON from "ol/format/GeoJSON.js";
import Stroke from "ol/style/Stroke.js";

// 경북 map
// import gbMap from "../assets/sig_wsg84_gb_geo_low.json";
import gbMap from "../assets/sig_wsg84_gb_geo.geojson";

const MapTest = ({ children }) => {
  const [mapObj, setMapObj] = useState({});

  const style = new Style({
    fill: new Fill({
      color: "#eeeeee",
    }),
  });

  // OSM Base Map : Open Street Map의 약자
  const osmLayer = new TileLayer({ source: new OSM() });

  const koreaLayer = new TileLayer({
    source: new TileWMS({
      url: "http://localhost:9999/geoserver/korea/wms",
      params: { LAYERS: "korea:gbmap", TILED: true }, //workspace:layer
      serverType: "geoserver",
      transition: 0,
    }),
  });

  // let features = new ol.format.GeoJson();

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      url: gbMap,
      // features: gbMap,
      format: new GeoJSON(),
    }),
    // background: "white",
    // style: function (feature) {
    //   const color = feature.get("COLOR") || "#eeeeee";
    //   style.getFill().setColor(color);
    //   return style;
    // },
  });

  useEffect(() => {
    const map = new OlMap({
      controls: defaultControls({ zoom: false, rotate: false }).extend([
        new FullScreen(),
      ]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      // OSM : Open Street Map의 약자
      layers: [
        osmLayer,
        // koreaLayer,
        vectorLayer,
        // layers: [
        //   new TileLayer({
        //     source: new OSM(),
        //   }),
        //   new TileLayer({
        //     source: new TileWMS({
        //       url: "http://localhost:9999/geoserver/korea/wms",
        //       params: { LAYERS: "korea:gbmap", TILED: true }, //workspace:layer
        //       serverType: "geoserver",
        //       transition: 0,
        //     }),
        //   }),

        // params: {
        //   FORMAT: "image/png",
        //   VERSION: "1.3.0",
        //   tiled: true,
        //   STYLES: "",
        //   LAYERS: "korea",
        // },
        // new TileLayer({
        //   source: new TileWMS({
        //     url: "http://localhost:9999/geoserver/korea/wms",
        //     params: { LAYERS: "korea:gbmap", TILED: true }, //workspace:layer
        //     serverType: "geoserver",
        //     // Countries have transparency, so do not fade tiles:
        //     transition: 0,
      ],
      target: "map",
      view: new View({
        projection: getProjection("EPSG:3857"),
        center: fromLonLat(
          [128.5055956, 36.5760207], //[경도, 위도] 값 설정 -> 경상북도청기준으로 설정
          getProjection("EPSG:3857")
        ),
        zoom: 7, // 초기 zoom 값
      }),
    });

    // 오픈레이어스 hover 예시
    const selectStyle = new Style({
      fill: new Fill({
        color: "#eeeeee",
      }),
      stroke: new Stroke({
        color: "rgba(255, 255, 255, 0.7)",
        width: 2,
      }),
    });

    const status = document.getElementById("status");

    let selected = null;
    map.on("pointermove", function (e) {
      if (selected !== null) {
        selected.setStyle(undefined);
        selected = null;
      }

      map.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        selectStyle.getFill().setColor(f.get("COLOR") || "#eeeeee");
        f.setStyle(selectStyle);
        return true;
      });

      if (selected) {
        status.innerHTML = selected.get("ECO_NAME");
      } else {
        status.innerHTML = "&nbsp;";
      }
    });

    setMapObj({ map });
    return () => map.setTarget(undefined);
  }, []);

  return <MapContext.Provider value={mapObj}>{children}</MapContext.Provider>;
};

export default MapTest;
