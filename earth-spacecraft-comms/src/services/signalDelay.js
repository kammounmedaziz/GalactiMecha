import { promisify } from 'util';

const simulateDelay = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

const calculateSignalDelay = (distance) => {
  const speedOfLight = 299792458; // Speed of light in meters per second
  return (distance / speedOfLight) * 1000; // Convert to milliseconds
};

export const delaySignal = async (distance) => {
  const delay = calculateSignalDelay(distance);
  await simulateDelay(delay);
  return delay;
};