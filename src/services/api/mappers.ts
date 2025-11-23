import { Event } from '../../modules/event/redux/eventSlice';
import { TicketmasterEvent } from './types';

export const mapTicketmasterEvent = (event: TicketmasterEvent): Event => {
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