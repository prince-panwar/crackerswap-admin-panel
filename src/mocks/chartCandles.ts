export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const btcCandles: CandleData[] = [
  { time: '00:00', open: 95820, high: 95950, low: 95700, close: 95880, volume: 1240 },
  { time: '01:00', open: 95880, high: 96100, low: 95850, close: 96040, volume: 1820 },
  { time: '02:00', open: 96040, high: 96120, low: 95800, close: 95890, volume: 1560 },
  { time: '03:00', open: 95890, high: 95950, low: 95600, close: 95680, volume: 2100 },
  { time: '04:00', open: 95680, high: 95800, low: 95450, close: 95520, volume: 2900 },
  { time: '05:00', open: 95520, high: 95700, low: 95300, close: 95640, volume: 3400 },
  { time: '06:00', open: 95640, high: 95850, low: 95550, close: 95780, volume: 2800 },
  { time: '07:00', open: 95780, high: 96000, low: 95700, close: 95950, volume: 3200 },
  { time: '08:00', open: 95950, high: 96200, low: 95900, close: 96140, volume: 4500 },
  { time: '09:00', open: 96140, high: 96400, low: 96050, close: 96320, volume: 5200 },
  { time: '10:00', open: 96320, high: 96550, low: 96200, close: 96280, volume: 6100 },
  { time: '11:00', open: 96280, high: 96400, low: 96000, close: 96050, volume: 4800 },
  { time: '12:00', open: 96050, high: 96150, low: 95800, close: 95890, volume: 3900 },
  { time: '13:00', open: 95890, high: 96000, low: 95650, close: 95720, volume: 4200 },
  { time: '14:00', open: 95720, high: 95850, low: 95400, close: 95510, volume: 5500 },
  { time: '15:00', open: 95510, high: 95700, low: 95350, close: 95630, volume: 4700 },
  { time: '16:00', open: 95630, high: 95900, low: 95500, close: 95840, volume: 5100 },
  { time: '17:00', open: 95840, high: 96100, low: 95750, close: 96020, volume: 6800 },
  { time: '18:00', open: 96020, high: 96300, low: 95950, close: 96250, volume: 7200 },
  { time: '19:00', open: 96250, high: 96500, low: 96100, close: 96340, volume: 8900 },
  { time: '20:00', open: 96340, high: 96600, low: 96250, close: 96480, volume: 9500 },
  { time: '21:00', open: 96480, high: 96700, low: 96350, close: 96520, volume: 10200 },
  { time: '22:00', open: 96520, high: 96750, low: 96400, close: 96490, volume: 8700 },
  { time: '23:00', open: 96490, high: 96600, low: 96300, close: 96425, volume: 6500 },
];