import moment from 'moment';

export const getTimestamp = () => moment().toISOString(true);
