const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatTime_start_bus_api = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')}T${[hour, minute, second].map(formatNumber).join('%3A')}%2B08%3A00`
}

const formatTime_end_bus_api = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() 
  const hour = date.getHours()
  const minute = date.getMinutes() - 3
  const second = date.getSeconds()
  if (minute < 0) {
    hour -= 1;
    minute += 60;
  }

  return `${[year, month, day].map(formatNumber).join('-')}T${[hour, minute, second].map(formatNumber).join('%3A')}%2B08%3A00`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  formatTime_start_bus_api,
  formatTime_end_bus_api
}
