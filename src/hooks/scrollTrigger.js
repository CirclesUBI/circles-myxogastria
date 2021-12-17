import { useScrollTrigger } from '@material-ui/core';

export const useCustomScrollTrigger = () =>
  useScrollTrigger({ disableHysteresis: true, threshold: 0 });
