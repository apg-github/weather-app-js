export const addLoadingPage = async () => {
  document.getElementsByTagName("body")[0].classList.add("loading");
};

export const removeLoadingPage = () => {
  document.getElementsByTagName("body")[0].classList.remove("loading");
};
