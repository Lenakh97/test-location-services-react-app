import * as turf from "@turf/turf"

export const makeCircle = (lat:number,lng:number, accuracy:number) =>{
    const center = turf.point([lat, lng])
    const radius = accuracy/1000
    return turf.circle(center, radius)
}