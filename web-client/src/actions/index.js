export const keys = {
  LOADING_PRODUCT: "LOADING_PRODUCT",
  LOADING_PRODUCT_LIST: "LOADING_PRODUCT_LIST"
};

export const getAction = (type, data) => ({ type, ...data });
