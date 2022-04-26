import { createContext, FunctionComponent, useContext, useState } from "react"

type Settings = {
  recenter: boolean,
  headingMarker: boolean,
  GNSS: boolean,
  GNSSHistory: boolean,
  singlecell: boolean,
  singlecellHistory: boolean,
  multicell: boolean,
  multicellHistory: boolean
}

const defaultSettings = {
  recenter: true,
  headingMarker: true,
  GNSS: true,
  GNSSHistory: false,
  singlecell: true,
  singlecellHistory: true,
  multicell: true,
  multicellHistory: true,
}

export const MapSettingsContext = createContext<{
	settings: Settings
	update: (_: Partial<Settings>) => void
}>({
	settings: defaultSettings,
	update: () => undefined,
})

export const useMapSettings = () => useContext(MapSettingsContext)

export const MapSettingsProvider: FunctionComponent = ({ children }) => {
	const [settings, update] = useState<Settings>(defaultSettings)

	return (
		<MapSettingsContext.Provider
			value={{
				settings,
				update: (newSettings: Partial<Settings>) => {
					update((settings) => {
						const updated = { ...settings, ...newSettings }
						return updated
					})
				},
			}}
		>
			{children}
		</MapSettingsContext.Provider>
	)
}