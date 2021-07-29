import admin from 'firebase-admin';
import { firestore } from '..';

export class Kickboard {
  public static async getKickboards(
    latitude: number,
    longitude: number
  ): Promise<
    {
      id: string;
      lat: number;
      lng: number;
      battery: number;
      baseMinute: number;
      basePrice: number;
      extraMinute: number;
      extraPrice: number;
    }[]
  > {
    const distance = 1;
    const results: {
      id: string;
      lat: number;
      lng: number;
      battery: number;
      baseMinute: number;
      basePrice: number;
      extraMinute: number;
      extraPrice: number;
    }[] = [];
    const kick = firestore.collection('kick');

    const lat = 0.0144927536231884;
    const lon = 0.0181818181818182;

    const lowerLat = latitude - lat * distance;
    const lowerLon = longitude - lon * distance;

    const greaterLat = latitude + lat * distance;
    const greaterLon = longitude + lon * distance;

    const lesserGeopoint = new admin.firestore.GeoPoint(lowerLat, lowerLon);
    const greaterGeopoint = new admin.firestore.GeoPoint(
      greaterLat,
      greaterLon
    );

    const kickboards = await kick
      .where('can_ride', '==', true)
      .where('location', '>=', lesserGeopoint)
      .where('location', '<=', greaterGeopoint)
      .get();

    kickboards.forEach((doc) => {
      const kickboard = doc.data();
      if (kickboard.battery === 0) return;
      results.push({
        id: kickboard.name,
        lat: kickboard.location.latitude,
        lng: kickboard.location.longitude,
        battery: kickboard.battery,
        baseMinute: 5,
        basePrice: 1200,
        extraMinute: 1,
        extraPrice: 180,
      });
    });

    return results;
  }
}
