import { Event } from '../../modules/event/redux/eventSlice';
import { ticketmasterClient } from './client';
import { mapTicketmasterEvent } from './mappers';

/**
 * No query parameters available to limit returned event information, the API always returns full event object.
 * https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2
 */
export const searchEvents = async (keyword: string, page: number = 0, size: number = 10): Promise<{events: Event[], total: number}> => {
  try {
    const params = {
      keyword,
      size,
      page,
    };

    const response = await ticketmasterClient.get('/events.json', params);
    
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
    
    const params = {
      size,
      page,
      sort: 'date,desc',
      startDateTime: today.toISOString().split('T')[0] + 'T00:00:00Z',
      endDateTime: endDate.toISOString().split('T')[0] + 'T23:59:59Z',
    };

    const response = await ticketmasterClient.get('/events.json', params);
    
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
    const response = await ticketmasterClient.get(`/events/${eventId}.json`);
    
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

