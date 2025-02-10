interface Reservations {
  completed: number;
  confirmed: number;
  pending: number;
}

export interface ReservationDashboardData {
  date: string;
  reservations: Reservations;
}
