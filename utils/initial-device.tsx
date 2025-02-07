const InitialDevice = () => {
  let device = 'mobile';
  if (window.innerWidth > 1199) {
    device = 'windows';
  } else if (window.innerWidth > 767) {
    device = 'tablet';
  }
  return device;
};

export default InitialDevice;
