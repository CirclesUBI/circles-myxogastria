import { useScrollTrigger } from '@mui/material';

export const useCustomScrollTrigger = () =>
  useScrollTrigger({ disableHysteresis: true, threshold: 0 });
