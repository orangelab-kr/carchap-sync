import { getPlatformClient } from '..';

export interface KickboardResponse {
  id: string;
  lat: number;
  lng: number;
  battery: number;
  hasHelmet: boolean;
  baseMinute: number;
  basePrice: number;
  extraMinute: number;
  extraPrice: number;
}

export enum KickboardLost {
  FINAL = 0,
  THIRD = 1,
  SECOND = 2,
  FIRST = 3,
}

export interface KickboardModel {
  kickboardCode: string;
  lost: KickboardLost | null;
  photo: string | null;
  helmetId: string | null;
  status: {
    gps: {
      latitude: number;
      longitude: number;
    };
    power: {
      scooter: {
        battery: number;
      };
    };
  };
}

export class Kickboard {
  public static async getKickboards(
    lat: number,
    lng: number
  ): Promise<KickboardResponse[]> {
    return getPlatformClient()
      .get('kickboard/near', {
        searchParams: { lat, lng, radius: 1000 },
      })
      .json<{
        opcode: number;
        kickboards: KickboardModel[];
        total: number;
      }>()
      .then(({ kickboards }) =>
        kickboards.map((kickboard) => ({
          id: kickboard.kickboardCode,
          lat: kickboard.status.gps.latitude,
          lng: kickboard.status.gps.longitude,
          battery: kickboard.status.power.scooter.battery,
          hasHelmet: !!kickboard.helmetId,
          baseMinute: 0,
          basePrice: 1000,
          extraMinute: 1,
          extraPrice: 180,
        }))
      );
  }
}
