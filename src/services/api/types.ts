export interface TicketmasterEvent {
  id: string;
  name: string;
  description?: string;
  info?: string;
  pleaseNote?: string;
  promoter?: {
    id: string;
    name: string;
    description?: string;
  };
  dates: {
    start: {
      localDate: string;
      localTime?: string;
      dateTime?: string;
    };
    end?: {
      localDate: string;
      localTime?: string;
    };
    status?: {
      code: string;
    };
    timezone?: string;
    spanMultipleDays?: boolean;
  };
  sales?: {
    public?: {
      startDateTime?: string;
      endDateTime?: string;
    };
    presales?: Array<{
      name: string;
      startDateTime: string;
      endDateTime: string;
    }>;
  };
  classifications?: Array<{
    primary: boolean;
    segment?: { name: string };
    genre?: { name: string };
    subGenre?: { name: string };
    type?: { name: string };
    subType?: { name: string };
    family?: boolean;
  }>;
  outlets?: Array<{
    url: string;
    type: string;
  }>;
  seatmap?: {
    staticUrl: string;
  };
  accessibility?: {
    ticketLimit?: number;
    info?: string;
  };
  ticketLimit?: {
    info?: string;
  };
  ageRestrictions?: {
    legalAgeEnforced?: boolean;
  };
  _embedded?: {
    venues: Array<{
      name: string;
      type?: string;
      id: string;
      address?: {
        line1?: string;
        line2?: string;
      };
      city: {
        name: string;
      };
      state?: {
        name: string;
        stateCode: string;
      };
      country?: {
        name: string;
        countryCode: string;
      };
      postalCode?: string;
      location?: {
        longitude: string;
        latitude: string;
      };
      timezone?: string;
      markets?: Array<{
        name: string;
        id: string;
      }>;
      dmas?: Array<{
        id: number;
      }>;
      boxOfficeInfo?: {
        phoneNumberDetail?: string;
        openHoursDetail?: string;
        acceptedPaymentDetail?: string;
        willCallDetail?: string;
      };
      parkingDetail?: string;
      accessibleSeatingDetail?: string;
      generalInfo?: {
        generalRule?: string;
        childRule?: string;
      };
    }>;
    attractions?: Array<{
      name: string;
      type: string;
      id: string;
      images?: Array<{
        url: string;
        width: number;
        height: number;
      }>;
      classifications?: Array<{
        primary: boolean;
        segment?: { name: string };
        genre?: { name: string };
        subGenre?: { name: string };
      }>;
    }>;
  };
  images: Array<{
    url: string;
    width: number;
    height: number;
    fallback?: boolean;
  }>;
  url: string;
  priceRanges?: Array<{
    type: string;
    currency: string;
    min: number;
    max: number;
  }>;
}