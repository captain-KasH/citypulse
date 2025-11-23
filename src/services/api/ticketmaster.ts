import axios from 'axios';
import { API_CONFIG } from '../../utils/constants';
import { Event } from '../../modules/event/redux/eventSlice';

const api = axios.create({
  baseURL: API_CONFIG.TICKETMASTER_BASE_URL,
  params: {
    apikey: API_CONFIG.TICKETMASTER_API_KEY,
  },
});

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

/**
 * No query parameters available to limit returned event information, the API always returns full event object.
 * https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
 */
export const searchEvents = async (keyword: string, page: number = 0, size: number = 10): Promise<{events: Event[], total: number}> => {
  try {
    const params: any = {
      keyword,
      size,
      page,
    };

    const response = await api.get('/events.json', { params });
    
    if (response.data._embedded?.events) {
      const events = response.data._embedded.events
        .filter((event: any) => event && event.id && event.name)
        .map(mapTicketmasterEvent);
      const total = response.data.page?.totalElements || 0;
      return { events, total };
    }
    
    return { events: [], total: 0 };
  } catch (error) {
    console.error('Error searching events:', error);
    return { events: [], total: 0 };
  }
};

export const getUpcomingEvents = async (page: number = 0, size: number = 10): Promise<{events: Event[], total: number}> => {
  try {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 14);
    
    // ToDo:: add location coordinates later to search near by event.
    const params: any = {
      size,
      page,
      sort: 'date,desc',
      startDateTime: today.toISOString().split('T')[0] + 'T00:00:00Z',
      endDateTime: endDate.toISOString().split('T')[0] + 'T23:59:59Z',
    };

    const response = await api.get('/events.json', { params });
    
    if (response.data._embedded?.events) {
      const events = response.data._embedded.events
        .filter((event: any) => event && event.id && event.name)
        .map(mapTicketmasterEvent);
      const total = response.data.page?.totalElements || 0;
      return { events, total };
    }
    
    return { events: [], total: 0 };
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return { events: [], total: 0 };
  }
};

export const getEventDetails = async (eventId: string): Promise<Event | null> => {
  try {
    const response = await api.get(`/events/${eventId}.json`);
    
    if (response.data) {
      const mappedEvent = mapTicketmasterEvent(response.data);
      return mappedEvent;
    }
    
    return null;
  } catch (error: any) {
    if (error.response) {
      console.error('📊 Error Response Status:', error.response.status);
      console.error('📋 Error Response Data:', error.response.data);
    }
    return null;
  }
};

const mapTicketmasterEvent = (event: TicketmasterEvent): Event => {
  const venue = event._embedded?.venues?.[0];
  const image = event.images?.find(img => img.width > 300) || event.images?.[0];
  const classification = event.classifications?.find(c => c.primary);
  const attractions = event._embedded?.attractions?.map(a => a.name) || [];
  
  return {
    id: event.id,
    name: event.name || 'Event Name TBA',
    date: event.dates?.start?.localDate || new Date().toISOString().split('T')[0],
    venue: venue?.name || 'TBA',
    city: venue?.city?.name || 'TBA',
    image: image?.url || '',
    url: event.url || '',
    priceRange: event.priceRanges?.[0] ? {
      min: event.priceRanges[0].min,
      max: event.priceRanges[0].max,
    } : undefined,
    // Additional details
    time: event.dates?.start?.localTime,
    endDate: event.dates?.end?.localDate,
    endTime: event.dates?.end?.localTime,
    description: event.description,
    info: event.info,
    pleaseNote: event.pleaseNote,
    genre: classification?.genre?.name,
    segment: classification?.segment?.name,
    subGenre: classification?.subGenre?.name,
    eventType: classification?.type?.name,
    timezone: event.dates?.timezone,
    status: event.dates?.status?.code,
    promoter: event.promoter?.name,
    attractions: attractions,
    saleStartDate: event.sales?.public?.startDateTime,
    saleEndDate: event.sales?.public?.endDateTime,
    presales: event.sales?.presales?.map(p => ({
      name: p.name,
      startDate: p.startDateTime,
      endDate: p.endDateTime,
    })),
    ageRestriction: event.ageRestrictions?.legalAgeEnforced,
    ticketLimit: event.ticketLimit?.info,
    accessibility: event.accessibility?.info,
    parkingInfo: venue?.parkingDetail,
    boxOfficeInfo: venue?.boxOfficeInfo ? {
      phone: venue.boxOfficeInfo.phoneNumberDetail,
      hours: venue.boxOfficeInfo.openHoursDetail,
      payment: venue.boxOfficeInfo.acceptedPaymentDetail,
      willCall: venue.boxOfficeInfo.willCallDetail,
    } : undefined,
    venueRules: venue?.generalInfo ? {
      general: venue.generalInfo.generalRule,
      children: venue.generalInfo.childRule,
    } : undefined,
    address: venue?.address ? {
      line1: venue.address.line1,
      line2: venue.address.line2,
      city: venue.city.name,
      state: venue.state?.name,
      postalCode: venue.postalCode,
      country: venue.country?.name,
    } : undefined,
    location: venue?.location ? {
      latitude: parseFloat(venue.location.latitude),
      longitude: parseFloat(venue.location.longitude),
    } : undefined,
  };
};