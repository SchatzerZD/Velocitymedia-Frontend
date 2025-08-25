
export default {
  mounted(el) {
    el.classList.add("before-fade");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("fade-in");
          el.classList.remove("fade-out");
        } else {
          el.classList.remove("fade-in");
          el.classList.add("fade-out");
        }
      },
      { threshold: 0.65 }
    );

    observer.observe(el);
  }
};
