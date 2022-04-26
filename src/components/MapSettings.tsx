import { useMapSettings } from "../hooks/useMapSettings";
import { Checkbox } from "./Checkbox";

export const MapSettings = () => {
  const { settings, update: setMapSettings } = useMapSettings();
  return (
    <>
      <Checkbox
        checked={settings.recenter}
        label="Recenter"
        id="recenter"
        onClick={() => {
          setMapSettings({
            recenter: !settings.recenter,
          });
        }}
      />
      <Checkbox
        checked={settings.headingMarker}
        label="Headingmarker"
        id="headingmarker"
        onClick={() => {
          setMapSettings({
            headingMarker: !settings.headingMarker,
          });
        }}
      />
      <Checkbox
        checked={settings.GNSS}
        label="GNSS"
        id="gnss"
        onClick={() => {
          setMapSettings({
            GNSS: !settings.GNSS,
          });
        }}
      />
      <Checkbox
        checked={settings.GNSSHistory}
        label="GNSSHistory"
        id="gnssHistory"
        onClick={() => {
          setMapSettings({
            GNSSHistory: !settings.GNSSHistory,
          });
        }}
      />
      <Checkbox
        checked={settings.singlecell}
        label="Singlecell"
        id="singlecell"
        onClick={() => {
          setMapSettings({
            singlecell: !settings.singlecell,
          });
        }}
      />
      <Checkbox
        checked={settings.singlecellHistory}
        label="Singlecell History"
        id="singlecellHistory"
        onClick={() => {
          setMapSettings({
            singlecellHistory: !settings.singlecellHistory,
          });
        }}
      />
      <Checkbox
        checked={settings.multicell}
        label="Multicell"
        id="multicell"
        onClick={() => {
          setMapSettings({
            multicell: !settings.multicell,
          });
        }}
      />
      <Checkbox
        checked={settings.multicellHistory}
        label="Multicell History"
        id="multicellHistory"
        onClick={() => {
          setMapSettings({
            multicellHistory: !settings.multicellHistory,
          });
        }}
      />
    </>
  );
};
