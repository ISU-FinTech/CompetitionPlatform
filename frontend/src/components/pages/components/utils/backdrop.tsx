import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store'; 

const LoadingBackdrop = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingBackdrop;
