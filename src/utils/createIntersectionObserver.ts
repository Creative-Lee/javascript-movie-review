type IntersectionObserverConfiguration = {
  onIntersection: CallableFunction;
  option?: IntersectionObserverInit;
};

const createIntersectionObserver = (config: IntersectionObserverConfiguration) => {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      config.onIntersection();
    });
  }, config.option);
};

export default createIntersectionObserver;
