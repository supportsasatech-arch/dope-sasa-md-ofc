import moment from 'moment-timezone';

export const SL_TIMEZONE = 'Asia/Colombo';

export function getCurrentSLTime() {
  return moment().tz(SL_TIMEZONE);
}

export function formatDateSL(date) {
  return moment(date).tz(SL_TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
}
